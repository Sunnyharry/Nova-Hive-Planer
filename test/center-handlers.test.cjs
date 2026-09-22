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
app=app.replace(start,"render=()=>renderControls();fitMap=()=>{};renderMap=()=>{};globalThis.testApp={get state(){return state;},get workspace(){return workspace;},commit,restoreHistory,renderInspector,scene,select:o=>{selectedId=o.id;selectedObjectIds=new Set([o.id]);}};"+start);
vm.runInContext(app,context);
const M=context.HiveModel,api=context.testApp,json=value=>JSON.parse(JSON.stringify(value));


(async()=>{
 let s=M.makeLayout('empty'),o=M.makeObject(s,'base');s=M.addObject(s,o);api.commit(s);api.select(o);api.renderInspector();assert.ok(get('inspector').innerHTML.includes('Objektzentrum'));assert.ok(get('inspector').innerHTML.includes('object-name-edit'));assert.ok(get('inspector').innerHTML.includes('value="500"'));
 get('object-x').value='820';get('object-y').value='920';for(const fn of get('inspector').listeners.submit)await fn({target:{id:'position-form'},preventDefault(){}});assert.deepEqual(json(M.displayCoords(api.state,api.state.objects[0])),{x:820,y:920});
 get('object-name-edit').value='My base';for(const fn of get('inspector').listeners.change)await fn({target:get('object-name-edit')});assert.equal(M.objectLabel(api.state,api.state.objects[0]),'My base');assert.ok(api.scene().includes('My base'));assert.ok(api.scene().includes('X 820'));
 const before=json(api.state);get('object-x').value='';for(const fn of get('inspector').listeners.submit)await fn({target:{id:'position-form'},preventDefault(){}});assert.deepEqual(json(api.state),before);
 s=M.makeLayout('empty');o=M.makeObject(s,'terrain');s=M.addObject(s,o);api.commit(s);api.select(o);api.renderInspector();assert.ok(get('inspector').innerHTML.includes('placeholder="X"'));assert.ok(api.scene().includes('X X / Y X'));assert.ok(!api.scene().includes('NaN'));
 console.log('Passed: real center form submit, base rename, map labels, blank-input rejection and even-size placeholders with DOM double.');
})().catch(e=>{console.error(e);process.exitCode=1;});
