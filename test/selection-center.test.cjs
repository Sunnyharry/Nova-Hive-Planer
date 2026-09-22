const assert=require('node:assert/strict');require('../dist/model.js');require('../dist/workspace.js');const M=HiveModel,W=HiveWorkspace;
let s=M.makeLayout('empty');
for(const [type,x,y] of [['center',0,0],['base',8,0],['marshall',-8,0],['terrain',0,12],['missile',0,0]]){
 let o=M.makeObject(s,type,x,y);if(type==='terrain')o={...o,x,y,w:5,h:3};s=M.addObject(s,o);
}
const ids=s.objects.map(o=>o.id),before=M.clone(s),info=M.selectionCenter(s,ids);
const moved=M.setSelectionCenter(s,ids,750,800),after=M.selectionCenter(moved,ids);
assert.deepEqual(after.coordinates,{x:750,y:800});
for(let i=0;i<s.objects.length;i++){
 const a=M.coords(s,s.objects[i]),b=M.coords(moved,moved.objects[i]);
 assert.equal(b.x-a.x,750-info.coordinates.x);assert.equal(b.y-a.y,800-info.coordinates.y);
 M.assertWorldPlacement(moved,moved.objects[i]);
}
assert.deepEqual(s,before);assert.deepEqual(W.activePlan(W.readFile(W.saveFile(W.createWorkspace(moved)))),moved);
assert.throws(()=>M.setSelectionCenter(s,ids,0,0));assert.throws(()=>M.setSelectionCenter(s,ids,500.5,500));assert.throws(()=>M.selectionCenter(s,[]));
// Collision fails atomically; unselected objects and coordinates stay fixed.
let pair=M.makeLayout('empty');for(const x of [0,4,30])pair=M.addObject(pair,M.makeObject(pair,'base',x,0));
const pairIds=pair.objects.slice(0,2).map(o=>o.id),snapshot=M.clone(pair);
assert.throws(()=>M.setSelectionCenter(pair,pairIds,528,500));assert.deepEqual(pair,snapshot);
const shifted=M.setSelectionCenter(pair,pairIds,600,650);assert.deepEqual(M.coords(shifted,shifted.objects[2]),M.coords(pair,pair.objects[2]));
// Selecting one part includes its entire connected terrain; its center is the union bounds center.
let terrain=M.makeLayout('empty');for(const x of [0,3])terrain=M.addObject(terrain,{...M.makeObject(terrain,'terrain',x,0),x,y:0,w:3,h:3});
terrain=M.connectTerrains(terrain,terrain.objects.map(o=>o.id));const extra=M.makeObject(terrain,'base',12,0);terrain=M.addObject(terrain,extra);
const expanded=M.selectionCenter(terrain,[terrain.objects[0].id,extra.id]);assert.equal(expanded.ids.length,3);
const connected=M.setSelectionCenter(terrain,[terrain.objects[0].id,extra.id],600,700);assert.deepEqual(M.selectionCenter(connected,expanded.ids).coordinates,{x:600,y:700});
// Audit every footprint type, including non-square terrain and even-size placeholders.
for(const type of ['center','base','beacon','marshall','terrain','stronghold','city','missile']){
 let plan=M.makeLayout('empty'),o=M.makeObject(plan,type,40,70);
 if(type==='terrain')o={...o,x:40,y:70,w:5,h:7};plan=M.addObject(plan,o);
 assert.deepEqual(M.displayCoords(plan,o),{x:540,y:570});
 const q=M.cornerCoords(plan,o);assert.equal(q.x+(o.w-1)/2,540);assert.equal(q.y+(o.h-1)/2,570);
}
let even=M.makeLayout('empty');const missile={...M.makeObject(even,'missile'),x:.5,y:0,w:36,h:35};even=M.addObject(even,missile);
assert.deepEqual(M.displayCoords(even,missile),{x:'X',y:500});
console.log('Passed: group center placement, rigid offsets, reference following, collision rollback, world bounds, connected terrain expansion, save/open and every object center.');
