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
for(const name of ['i18n','model','workspace','themes'])vm.runInContext(fs.readFileSync('dist/'+name+'.js','utf8'),context);
let app=fs.readFileSync('dist/app.js','utf8');
const start="I.apply(document);$('language-select').value=I.language;render();requestAnimationFrame(fitMap);";assert.ok(app.includes(start));
app=app.replace(start,"render=()=>renderControls();fitMap=()=>{};renderMap=()=>{};globalThis.testApp={get state(){return state;},get workspace(){return workspace;},commit,restoreHistory,renderInspector,scene,exportSvg,select:o=>{selectedId=o.id;selectedObjectIds=new Set([o.id]);}};"+start);
vm.runInContext(app,context);
const M=context.HiveModel,api=context.testApp,json=value=>JSON.parse(JSON.stringify(value));


const T=context.HiveThemes;let s=M.makeLayout('spaced');s=M.addPlayers(s,'Harry\nMary\nXtra\nPhoenix').state;s=M.autofill(s).state;const terrain=M.makeObject(s,'terrain',40,0);s=M.addObject(s,terrain);s=M.updateObject(s,terrain.id,{color:'#175ca4'});api.commit(s);const before=json(api.state);for(const theme of ['night','sky','sand','sage']){T.set(theme);const svg=api.exportSvg().source;assert.ok(svg.includes('#175ca4'));assert.deepEqual(json(api.state),before);if(theme!=='night')assert.ok(!svg.includes('fill="#0b1726"'));}console.log('Passed: all four themed SVG exports preserve geometry and custom terrain colors.');
