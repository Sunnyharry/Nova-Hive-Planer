// Actual pointer/keyboard/create/undo handlers, with SVG output inspected through
// a DOM test double. This is not a visual browser test.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();let document;
class Element{
 constructor(id=''){this.id=id;this.value='';this.checked=false;this.hidden=false;this.files=[];this.options=[];this.listeners={};this.style={};this.dataset={};this.classList={toggle(){},add(){},remove(){}};this.open=false;this.innerHTML='';this.capture=null;}
 addEventListener(name,handler){(this.listeners[name]??=[]).push(handler);}
 async fire(name,props={}){const event={target:this,button:0,pointerId:1,preventDefault(){this.defaultPrevented=true;},...props};for(const fn of this.listeners[name]??[])await fn(event);return event;}
 setAttribute(name,value){this[name]=String(value);}getAttribute(name){return this[name];}
 closest(selector){if(selector==='button')return this;if(selector==='[data-fill-resize]'&&this.dataset.fillResize)return this;if(selector==='[data-resize]'&&this.dataset.resize)return this;if(selector==='[data-object]'&&this.dataset.object)return this;return null;}
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
const storage=new Map();const context=vm.createContext({localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},console,document,window:{addEventListener(){}},Blob,URL:{},setTimeout(){return 1;},clearTimeout(){},requestAnimationFrame(fn){fn();},ResizeObserver:class{observe(){}},TextDecoder,DOMPoint:class{constructor(x,y){this.x=x;this.y=y;}matrixTransform(){return {x:this.x/10,y:this.y/10};}}});
for(const name of ['i18n','model','workspace'])vm.runInContext(fs.readFileSync('dist/'+name+'.js','utf8'),context);
let app=fs.readFileSync('dist/app.js','utf8');
const start="I.apply(document);$('language-select').value=I.language;render();requestAnimationFrame(fitMap);";assert.ok(app.includes(start));
app=app.replace(start,"render=()=>{renderControls();renderMap();renderInspector();renderQoL();};fitMap=()=>{};globalThis.testApp={get state(){return state;},get area(){return fillArea;},get preview(){return fillPreview;},commit,restoreHistory,selectObject,exportSvg,csvExport,get selected(){return [...selectedObjectIds];},get scope(){return selectionScope;},armObject,saveRecovery,restoreRecovery,renderQoL};"+start);
vm.runInContext(app,context);
const M=context.HiveModel,api=context.testApp,json=value=>JSON.parse(JSON.stringify(value)),svg=get('map');
const pointer=(name,x,y,target=svg)=>svg.fire(name,{clientX:x*10,clientY:-y*10,target});
const handle=corner=>{const e=svg.querySelector('[data-fill-resize="'+corner+'"]');assert.ok(e,'visible corner '+corner);return e;};
async function change(id,value){get(id).value=value;await get(id).fire('change');}
async function draw(a,b){await pointer('pointerdown',...a);await pointer('pointermove',...b);await pointer('pointerup',...b);}
const click=(id,dataset={})=>{const target=get(id);Object.assign(target.dataset,dataset);return get('qol-panel').fire('click',{target});};
async function name(value){get('qol-name-input').value=value;await get('qol-name-form').fire('submit');}
(async()=>{
 let s=M.addPlayers(M.makeLayout('empty'),'Alice\nBob').state;for(const x of [0,12])s=M.addObject(s,M.makeObject(s,'base',x,x===0?0:4));const ids=s.objects.map(o=>o.id);s=M.assign(s,s.players[0].id,ids[0]);s=M.assign(s,s.players[1].id,ids[1]);api.commit(s);api.selectObject(ids[0]);
 await click('qol-lock');assert.equal(api.state.objects[0].locked,true);const locked=json(api.state);await document.fire('keydown',{key:'Delete',target:svg});assert.deepEqual(json(api.state),locked);await click('qol-unlock');
 api.selectObject(ids[1],false,true);await click('qol-swap');assert.equal(api.state.objects[0].playerId,s.players[1].id);
 get('paste-alliance').value='keep';await click('qol-copy');await click('qol-paste');await pointer('pointermove',50,50);assert.ok(svg.innerHTML.includes('opacity=".65"'));await pointer('pointerdown',50,50);assert.equal(api.state.objects.length,4);assert.ok(api.state.objects.slice(2).every(o=>o.playerId===null));
 api.selectObject(ids[0]);api.selectObject(ids[1],false,true);get('arrange-mode').value='row';get('arrange-gap').value='2';await click('arrange-preview');assert.equal(get('arrange-apply').disabled,false);await click('arrange-apply');assert.equal(api.state.objects[1].x-api.state.objects[0].x,5);assert.equal(api.state.objects[1].y,api.state.objects[0].y);
 await click('save-object-group');await name('North');assert.ok(api.state.objects.slice(0,2).every(o=>o.selectionGroup==='North'));
 await click('save-blueprint');await name('Pair');assert.equal(api.state.blueprints[0].name,'Pair');assert.equal(api.state.blueprints[0].plan.objects.length,2);
 get('object-search').value='Alice';await get('object-search').fire('input');assert.ok(get('object-tree').innerHTML.includes('Alice'));assert.ok(!get('object-tree').innerHTML.includes('Bob'));
 api.armObject('note');await pointer('pointerdown',0,0);assert.ok(api.state.objects.some(o=>o.type==='note'));assert.ok(api.exportSvg().source.includes('Notiz'));
 const opt=get('view-exportNotes');opt.dataset.view='exportNotes';opt.checked=false;await get('qol-panel').fire('change',{target:opt});assert.ok(!api.exportSvg().source.includes('Notiz'));
 const hide=get('view-names');hide.dataset.view='names';hide.checked=false;await get('qol-panel').fire('change',{target:hide});assert.ok(!svg.innerHTML.includes('class="map-name"'));
 await click('draw-check-area');await draw([-1.5,-1.5],[10.5,8.5]);assert.ok(get('check-results').innerHTML.includes('Freie 3×3-Positionen'));
 api.saveRecovery();const recovery=JSON.parse(storage.get('nova-hive-workspace-recovery-v1'));assert.deepEqual(json(M.validate(context.HiveWorkspace.activePlan(context.HiveWorkspace.readFile(recovery.workspace)))),json(api.state));
 const old=json(api.state);api.commit(M.makeLayout('empty'));api.restoreRecovery();assert.deepEqual(json(api.state),old);
 // Generated labels, hints and dialogs rebuild on language changes.
 get('language-select').value='en';await get('language-select').fire('change');assert.ok(get('qol-panel').innerHTML.includes('Selection actions'));
 console.log('Passed: actual lock/unlock, copy/paste preview, player swap, exact-spacing preview/apply, groups, blueprints, search, notes/export visibility, area-check drawing, recovery and translated controls. DOM double.');
})().catch(e=>{console.error(e);process.exitCode=1;});
