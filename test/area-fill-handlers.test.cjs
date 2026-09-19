// Actual pointer/keyboard/create/undo handlers, with SVG output inspected through
// a DOM test double. This is not a visual browser test.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();let document;
class Element{
 constructor(id=''){this.id=id;this.value='';this.checked=false;this.hidden=false;this.files=[];this.options=[];this.listeners={};this.style={};this.dataset={};this.classList={toggle(){},add(){},remove(){}};this.open=false;this.innerHTML='';this.capture=null;}
 addEventListener(name,handler){(this.listeners[name]??=[]).push(handler);}
 async fire(name,props={}){const event={target:this,button:0,pointerId:1,preventDefault(){this.defaultPrevented=true;},...props};for(const fn of this.listeners[name]??[])await fn(event);return event;}
 setAttribute(name,value){this[name]=String(value);}getAttribute(name){return this[name];}
 closest(selector){if(selector==='[data-fill-resize]'&&this.dataset.fillResize)return this;if(selector==='[data-resize]'&&this.dataset.resize)return this;if(selector==='[data-object]'&&this.dataset.object)return this;return null;}
 showModal(){this.open=true;}close(){this.open=false;}focus(){document.activeElement=this;}blur(){}remove(){}append(){}setCustomValidity(){}
 querySelector(selector){const match=selector?.match(/^\[data-fill-resize="(\w+)"\]$/);if(match){if(!this.innerHTML.includes('data-fill-resize="'+match[1]+'"'))return null;const e=new Element();e.dataset.fillResize=match[1];return e;}return new Element();}
 querySelectorAll(){return [];}getBoundingClientRect(){return {width:1000,height:700,left:0,top:0};}
 getContext(){return {measureText:s=>({width:s.length*30})};}
 getScreenCTM(){return {inverse(){return {};}};}
 setPointerCapture(id){this.capture=id;}hasPointerCapture(id){return this.capture===id;}releasePointerCapture(){this.capture=null;}
}
const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
const modes=['pan','select','fill'].map(mode=>{const e=new Element();e.dataset.mapMode=mode;return e;});
document=new Element('document');Object.assign(document,{getElementById:get,createElement:tag=>new Element(tag),querySelectorAll:selector=>selector==='[data-map-mode]'?modes:[],body:new Element(),documentElement:{lang:'de'},activeElement:new Element()});
get('fill-gap').value='1';
const context=vm.createContext({console,document,window:{addEventListener(){}},Blob,URL:{},setTimeout(){return 1;},clearTimeout(){},requestAnimationFrame(fn){fn();},ResizeObserver:class{observe(){}},TextDecoder,DOMPoint:class{constructor(x,y){this.x=x;this.y=y;}matrixTransform(){return {x:this.x/10,y:this.y/10};}}});
for(const name of ['i18n','model','workspace'])vm.runInContext(fs.readFileSync('dist/'+name+'.js','utf8'),context);
let app=fs.readFileSync('dist/app.js','utf8');
const start="I.apply(document);$('language-select').value=I.language;render();requestAnimationFrame(fitMap);";assert.ok(app.includes(start));
app=app.replace(start,"render=()=>{renderControls();renderMap();};renderInspector=()=>{};fitMap=()=>{};globalThis.testApp={get state(){return state;},get area(){return fillArea;},get preview(){return fillPreview;},commit,restoreHistory,selectObject,exportSvg,csvExport};"+start);
vm.runInContext(app,context);
const M=context.HiveModel,api=context.testApp,json=value=>JSON.parse(JSON.stringify(value)),svg=get('map');
const pointer=(name,x,y,target=svg)=>svg.fire(name,{clientX:x*10,clientY:-y*10,target});
const handle=corner=>{const e=svg.querySelector('[data-fill-resize="'+corner+'"]');assert.ok(e,'visible corner '+corner);return e;};
async function change(id,value){get(id).value=value;await get(id).fire('change');}
async function draw(a,b){await pointer('pointerdown',...a);await pointer('pointermove',...b);await pointer('pointerup',...b);}
(async()=>{
 await change('layout-select','empty');let s=M.addObject(api.state,M.makeObject(api.state,'center',0,0));s=M.addObject(s,{...M.makeObject(s,'terrain',14,0),x:14,y:0,w:5,h:9});api.commit(s);
 const before=json(api.state);await modes[2].fire('click');
 await pointer('pointerdown',-22.5,-18.5);await pointer('pointermove',22.5,18.5);
 assert.ok(api.preview.positions.length>0);assert.ok(get('area-fill-summary').textContent.includes(String(api.preview.positions.length)+' neue Basen'));assert.equal(get('apply-area-fill').disabled,true);
 assert.ok(svg.innerHTML.includes('fill="#78d7bf"'));assert.deepEqual(json(api.state),before);
 await pointer('pointerup',22.5,18.5);assert.equal((svg.innerHTML.match(/data-fill-resize=/g)||[]).length,4);assert.equal(get('apply-area-fill').disabled,false);
 const initial=json(api.area),count=api.preview.positions.length;
 await pointer('pointerdown',initial.right,initial.top,handle('ne'));await pointer('pointermove',14.5,12.5);
 assert.equal(api.area.left,initial.left);assert.equal(api.area.bottom,initial.bottom);assert.ok(api.preview.positions.length<count);assert.equal(get('apply-area-fill').disabled,true);
 // Pointer-up can contain a final location not seen by pointer-move.
 await pointer('pointerup',13.5,11.5);assert.equal(api.area.right,13.5);assert.equal(api.area.top,11.5);assert.equal(get('apply-area-fill').disabled,false);assert.deepEqual(json(api.state),before);
 // All four handles retain the opposite corner and update the count immediately.
 for(const c of ['nw','ne','sw','se']){
  const old=json(api.area),east=c.endsWith('e'),north=c.startsWith('n'),x=east?old.right:old.left,y=north?old.top:old.bottom;
  await pointer('pointerdown',x,y,handle(c));await pointer('pointermove',x+(east?2:-2),y+(north?2:-2));await pointer('pointerup',x+(east?2:-2),y+(north?2:-2));
  assert.equal(api.area[east?'left':'right'],old[east?'left':'right']);assert.equal(api.area[north?'bottom':'top'],old[north?'bottom':'top']);
  assert.deepEqual(json(api.preview.positions),json(M.planBaseFill(api.state,api.area,1).positions));
 }
 // A cancelled resize or replacement rectangle restores the prior area.
 const stable=json(api.area),stablePreview=json(api.preview);
 await pointer('pointerdown',stable.right,stable.top,handle('ne'));await pointer('pointermove',4,4);await svg.fire('pointercancel');assert.deepEqual(json(api.area),stable);assert.deepEqual(json(api.preview),stablePreview);
 await pointer('pointerdown',-4,-4);await pointer('pointermove',6,6);await svg.fire('pointercancel');assert.deepEqual(json(api.area),stable);
 // Clicking without drawing does not discard the existing preview.
 await pointer('pointerdown',0,0);await pointer('pointerup',0,0);assert.deepEqual(json(api.area),stable);
 await document.fire('keydown',{target:handle('ne'),key:'ArrowRight',shiftKey:true});assert.equal(api.area.right,stable.right+5);assert.equal(api.area.top,stable.top);
 await document.fire('keydown',{target:handle('ne'),key:'ArrowDown'});assert.equal(api.area.top,stable.top-1);assert.equal(document.activeElement.dataset.fillResize,'ne');
 await change('fill-gap','2');assert.deepEqual(json(api.preview.positions),json(M.planBaseFill(api.state,api.area,2).positions));
 // Create commits the exact preview once; undo restores the prior map.
 const expected=json(api.preview.positions);await get('apply-area-fill').fire('click');assert.equal(api.area,null);assert.equal(api.preview,null);assert.equal(get('area-fill-options').hidden,true);
 assert.deepEqual(json(api.state.objects.slice(before.objects.length).map(({x,y})=>({x,y}))),expected);api.restoreHistory('undo');assert.deepEqual(json(api.state),before);
 // Empty previews disable Create, and all corners remain whole and bounded.
 await modes[2].fire('click');await draw([1.5,1.5],[2.5,2.5]);assert.equal(api.preview.positions.length,0);assert.equal(get('apply-area-fill').disabled,true);
 await draw([-900,-900],[900,900]);const world=json(M.worldBounds(api.state));assert.deepEqual(json(api.area),world);assert.equal(api.preview.limited,true);
 await pointer('pointerdown',world.left,world.bottom,handle('sw'));await pointer('pointermove',-1200,-1200);await pointer('pointerup',-1200,-1200);assert.deepEqual(json(api.area),world);
 await draw([world.right,world.top-5],[world.right,world.top]);assert.equal(api.area.right,world.right);assert.equal(api.area.left,world.right-1);
 await pointer('pointerdown',world.right,world.top,handle('ne'));await pointer('pointermove',world.right+20,world.top+20);await pointer('pointerup',world.right+20,world.top+20);assert.equal(api.area.right,world.right);assert.equal(api.area.top,world.top);
 await get('cancel-area-fill').fire('click');assert.equal(api.area,null);assert.deepEqual(json(api.state),before);
 // Actual alliance dropdown, hotkeys, roster import, Autofill and cross-layer selection.
 api.commit(M.addPlayers(api.state,'Home player').state);
 await change('alliance-select','2');assert.equal(M.activeAlliance(api.state),2);
 await document.fire('keydown',{target:svg,key:'a'});await pointer('pointerdown',60,0);
 assert.equal(api.state.objects.filter(o=>o.type==='center').length,2);
 await document.fire('keydown',{target:svg,key:'b'});await pointer('pointerdown',68,0);
 get('names-input').value='Yellow player';await get('names-form').fire('submit');await get('autofill').fire('click');
 const yellow=api.state.objects.find(o=>M.allianceOf(o)===2&&o.type==='base');assert.ok(yellow.playerId);assert.equal(M.playerFor(api.state,yellow).name,'Yellow player');
 assert.ok(svg.innerHTML.includes('#f2c75c'));assert.ok(svg.innerHTML.includes('Allianz 2'));
 await change('alliance-select','1');assert.equal(M.alliancePlayers(api.state).length,1);assert.equal(M.alliancePlayers(api.state)[0].name,'Home player');
 assert.ok(api.csvExport().includes('"Allianz 2";"Yellow player"'));assert.ok(api.exportSvg().source.includes('Allianz 5'));
 api.selectObject(yellow.id);assert.equal(M.activeAlliance(api.state),2);assert.equal(get('alliance-select').value,'2');
 await get('clear-players').fire('click');assert.equal(M.alliancePlayers(api.state).length,0);assert.equal(api.state.players.length,1);
 console.log('Passed: live draw/resize counts, four handles, fixed opposite corners, release position, pointer cancellation, keyboard resizing, gap change, exact Create/undo, empty preview and world limits. DOM test double, not visual browser QA.');
})().catch(error=>{console.error(error);process.exitCode=1;});
