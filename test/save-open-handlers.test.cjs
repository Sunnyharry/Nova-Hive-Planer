// Exercise the actual app event handlers with rendering disabled, without a browser or server.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map(),downloads=[],blobs=new Map();let blobId=0;
class Element{
 constructor(id=''){this.id=id;this.value='';this.checked=false;this.hidden=false;this.files=[];this.options=[];this.listeners={};this.style={};this.dataset={};this.classList={toggle(){},add(){},remove(){}};this.open=false;}
 addEventListener(name,handler){(this.listeners[name]??=[]).push(handler);}
 async fire(name){for(const fn of this.listeners[name]??[])await fn({target:this,preventDefault(){}});}
 click(){if(this.href)downloads.push({name:this.download,blob:blobs.get(this.href)});else return this.fire('click');}
 setAttribute(name,value){this[name]=String(value);}getAttribute(name){return this[name];}
 showModal(){this.open=true;}close(){this.open=false;}focus(){}remove(){}append(){}setCustomValidity(){}
 querySelector(){return new Element();}querySelectorAll(){return [];}getBoundingClientRect(){return {width:1000,height:700,left:0,top:0};}
 getContext(){return {measureText:s=>({width:s.length*30})};}
}
const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
const document={getElementById:get,createElement:tag=>new Element(tag),querySelectorAll:()=>[],addEventListener(){},body:new Element(),documentElement:{lang:'de'}};
const context=vm.createContext({console,document,window:{addEventListener(){}},Blob,URL:{createObjectURL(blob){const id='blob:'+ ++blobId;blobs.set(id,blob);return id;},revokeObjectURL(){}},setTimeout(){return 1;},clearTimeout(){},requestAnimationFrame(fn){fn();},ResizeObserver:class{observe(){}},TextDecoder});
for(const name of ['i18n','model','workspace'])vm.runInContext(fs.readFileSync('dist/'+name+'.js','utf8'),context);
let app=fs.readFileSync('dist/app.js','utf8');
const start="I.apply(document);$('language-select').value=I.language;render();requestAnimationFrame(fitMap);";assert.ok(app.includes(start));
app=app.replace(start,"render=()=>renderControls();fitMap=()=>{};renderMap=()=>{};globalThis.testApp={get state(){return state;},get workspace(){return workspace;},commit,restoreHistory};"+start);
vm.runInContext(app,context);
const M=context.HiveModel,api=context.testApp,json=value=>JSON.parse(JSON.stringify(value));
async function change(id,value){get(id).value=value;await get(id).fire('change');}
async function openText(text){get('plan-file').files=[{size:Buffer.byteLength(text),text:async()=>text}];await get('plan-file').fire('change');}
(async()=>{
 // Start on Empty, create custom terrain and a named base, and save via the real Save button.
 await change('layout-select','empty');assert.equal(api.state.layout,'empty');assert.equal(get('layout-select').value,'empty');assert.equal(api.state.objects.length,0);
 let s=M.addPlayers(api.state,'Harry\nMary').state;s=M.addObject(s,M.makeObject(s,'base',10,10));s=M.assign(s,s.players[0].id,s.objects[0].id);s=M.addObject(s,M.makeObject(s,'terrain',30,30));api.commit(s);const custom=json(api.state);
 await change('layout-select','compact');await change('plan-title','Edited compact');const compact=json(api.state);
 await change('season-select','off');assert.equal(api.state.season,'off');assert.equal(get('season-select').value,'off');assert.equal(get('confirm-dialog').open,false);
 await change('season-select','4');await change('layout-select','empty');assert.deepEqual(json(api.state),custom);
 await get('save-plan').fire('click');assert.equal(downloads.length,1);const savedText=await downloads[0].blob.text();const saved=JSON.parse(savedText);assert.equal(saved.variants.length,21);assert.deepEqual(saved.active,{season:'4',layout:'empty'});
 // Mutate another layout, then load and accept the actual replacement dialog.
 await change('layout-select','spaced');await change('plan-title','Unsaved replacement');const beforeOpen=json(api.workspace);
 await openText(savedText);assert.equal(get('confirm-dialog').open,true);assert.equal(api.state.title,'Unsaved replacement');
 await get('confirm-yes').fire('click');assert.equal(get('confirm-dialog').open,false);assert.deepEqual(json(api.state),custom);assert.equal(get('layout-select').value,'empty');assert.equal(get('season-select').value,'4');
 // Undo/redo restores the whole previous workspace, not just the visible map.
 api.restoreHistory('undo');assert.deepEqual(json(api.workspace),beforeOpen);api.restoreHistory('redo');assert.deepEqual(json(api.state),custom);
 await change('layout-select','compact');assert.deepEqual(json(api.state),compact);await change('layout-select','empty');assert.deepEqual(json(api.state),custom);
 // Explicit reset affects only the opened variant and can be undone.
 await get('apply-layout').fire('click');await get('confirm-yes').fire('click');assert.equal(api.state.objects.length,0);api.restoreHistory('undo');assert.deepEqual(json(api.state),custom);
 // Cancelled and invalid imports leave all variants intact.
 const intact=json(api.workspace);await openText(savedText);assert.equal(get('confirm-dialog').open,true);await get('confirm-dialog').fire('cancel');get('confirm-dialog').close();assert.deepEqual(json(api.workspace),intact);
 await openText('{broken');assert.deepEqual(json(api.workspace),intact);assert.equal(get('toast').hidden,false);
 // The previous single-plan format also restores its custom empty layout, never the default template.
 await openText(JSON.stringify(custom));await get('confirm-yes').fire('click');assert.deepEqual(json(api.state),custom);assert.equal(get('layout-select').value,'empty');
 console.log('Passed: real Save/Open handlers, download payload, replacement confirmation, active dropdown restoration, switching, reset, undo/redo and cancelled/invalid imports. Rendering was stubbed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
