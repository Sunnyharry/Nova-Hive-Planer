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
app=app.replace(start,"render=()=>{renderControls();renderMap();renderInspector();};fitMap=()=>{};globalThis.testApp={get state(){return state;},get area(){return fillArea;},get preview(){return fillPreview;},commit,restoreHistory,selectObject,exportSvg,csvExport,get selected(){return [...selectedObjectIds];},get scope(){return selectionScope;}};"+start);
vm.runInContext(app,context);
const M=context.HiveModel,api=context.testApp,json=value=>JSON.parse(JSON.stringify(value)),svg=get('map');
const pointer=(name,x,y,target=svg)=>svg.fire(name,{clientX:x*10,clientY:-y*10,target});
const handle=corner=>{const e=svg.querySelector('[data-fill-resize="'+corner+'"]');assert.ok(e,'visible corner '+corner);return e;};
async function change(id,value){get(id).value=value;await get(id).fire('change');}
async function draw(a,b){await pointer('pointerdown',...a);await pointer('pointermove',...b);await pointer('pointerup',...b);}
(async()=>{
 let s=M.makeLayout('empty');
 for(const [type,x,y] of [['center',0,0],['base',8,0],['terrain',0,15],['missile',0,0]])s=M.addObject(s,M.makeObject(s,type,x,y));
 s=M.setAlliance(s,2);for(const [type,x,y] of [['center',35,0],['base',43,0],['city',35,25]])s=M.addObject(s,M.makeObject(s,type,x,y));
 s=M.setAlliance(s,1);const original=json(s);api.commit(s);await modes[1].fire('click');
 await draw([-22,-22],[60,40]);assert.equal(api.scope,'active');assert.equal(api.selected.length,4);assert.ok(api.selected.every(id=>M.allianceOf(api.state.objects.find(o=>o.id===id))===1));
 await change('selection-scope','all');await draw([-22,-22],[60,40]);assert.equal(api.selected.length,7);assert.match(get('map-selection-count').textContent,/7 Objekte aus 2 Allianzen/);assert.match(get('selection-type').textContent,/7 Objekte aus 2 Allianzen/);
 // Start dragging a selected FOREIGN base: the entire mixed selection must survive.
 const foreign=api.state.objects.find(o=>o.type==='base'&&o.alliance===2),target=new Element();target.dataset.object=foreign.id;
 await pointer('pointerdown',foreign.x,foreign.y,target);await pointer('pointermove',foreign.x+5,foreign.y+7,target);await pointer('pointerup',foreign.x+5,foreign.y+7,target);
 assert.equal(api.selected.length,7);assert.equal(M.activeAlliance(api.state),1);
 for(const o of api.state.objects){const old=original.objects.find(q=>q.id===o.id);assert.equal(o.x,old.x+5);assert.equal(o.y,old.y+7);assert.equal(M.allianceOf(o),M.allianceOf(old));}
 // Center form, keyboard nudging and all-alliance deletion share the same scope.
 get('selection-x').value='700';get('selection-y').value='700';await get('inspector').fire('submit',{target:{id:'selection-position-form'}});
 let q=M.selectionCenter(api.state,api.selected).coordinates;assert.equal(Math.floor(q.x),700);assert.equal(Math.floor(q.y),700);
 await document.fire('keydown',{key:'ArrowRight',target:svg});q=M.selectionCenter(api.state,api.selected).coordinates;assert.equal(Math.floor(q.x),701);
 await change('selection-scope','active');assert.equal(api.selected.length,4);assert.ok(api.selected.every(id=>M.owns(api.state,api.state.objects.find(o=>o.id===id))));
 // Ctrl-add across alliances does not clear an existing selection.
 await change('selection-scope','all');await svg.fire('pointerdown',{clientX:0,clientY:0,target,ctrlKey:true});assert.equal(api.selected.length,5);
 await svg.fire('pointerdown',{clientX:0,clientY:0,target,ctrlKey:true});assert.equal(api.selected.length,4);
 // World and collision constraints still apply; there is no partial move on error.
 const ids=api.state.objects.map(o=>o.id),snapshot=json(api.state);assert.throws(()=>M.setSelectionCenter(api.state,ids,0,0,'all'));assert.deepEqual(json(api.state),snapshot);
 assert.throws(()=>M.setSelectionCenter(api.state,ids,650,650));
 api.selectObject(foreign.id,false,true);const beforeDelete=json(api.state);await get('inspector').fire('click',{target:{id:'delete-selected'}});assert.equal(api.state.objects.length,2);api.restoreHistory('undo');assert.deepEqual(json(api.state),beforeDelete);
 // Selecting a single foreign object permits its existing inspector workflow.
 await api.selectObject(foreign.id);assert.equal(M.activeAlliance(api.state),2);assert.equal(api.selected.length,1);
 console.log('Passed: actual active/all selection frames, cross-alliance Ctrl-click and drag, center placement, arrows, scope narrowing, deletion/undo, identities and bounds. DOM double.');
})().catch(e=>{console.error(e);process.exitCode=1;});
