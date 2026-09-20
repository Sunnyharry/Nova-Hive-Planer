const assert=require('node:assert/strict');require('../dist/model.js');require('../dist/workspace.js');const M=HiveModel,W=HiveWorkspace;
for(const type of ['stronghold','city']){
 let s=M.makeLayout('empty'),o=M.makeObject(s,type);s=M.addObject(s,o);const original=M.coords(s,o);
 s=M.updateObject(s,o.id,{w:24,h:21,coreW:8,coreH:9});o=s.objects[0];assert.deepEqual(M.coords(s,o),original);
 const core=M.solidFootprint(o);assert.equal(core.w,8);assert.equal(core.h,9);assert.ok(Number.isInteger(M.coords(s,core).x)&&Number.isInteger(M.coords(s,core).y));assert.equal(M.rect(core).left-M.rect(o).left,8);assert.equal(M.rect(core).bottom-M.rect(o).bottom,6);
 const base=M.makeObject(s,'base',M.rect(core).right+1.5,core.y);s=M.addObject(s,base);const before=structuredClone(s);assert.throws(()=>M.updateObject(s,o.id,{coreW:12}));assert.deepEqual(s,before);
 for(const patch of [{coreW:25},{coreH:22},{coreW:0},{coreH:0},{coreW:2.5},{w:7},{h:8},{w:1001},{h:2.5}])assert.throws(()=>M.updateObject(s,o.id,patch));
 const r=M.rect(o),candidate=M.terrainResizeCandidate(o,'ne',r.left+1,r.bottom+1);assert.equal(candidate.w,8);assert.equal(candidate.h,9);assert.equal(M.rect(candidate).left,r.left);assert.equal(M.rect(candidate).bottom,r.bottom);
 assert.deepEqual(M.validate(s),s);assert.deepEqual(W.activePlan(W.readFile(W.saveFile(W.createWorkspace(s)))),s);
 const invalid=structuredClone(s);invalid.objects[0].coreW=0;assert.throws(()=>M.validate(invalid));
 const legacy=M.makeLayout('empty');legacy.objects.push(M.makeObject(legacy,type));legacy.version=7;const migrated=M.validate(legacy);assert.equal(M.coreSize(migrated.objects[0]),type==='stronghold'?5:7);
}
let s=M.makeLayout('empty'),missile=M.makeObject(s,'missile');assert.deepEqual([missile.w,missile.h],[35,35]);s=M.addObject(s,missile);
for(const type of ['base','terrain','stronghold','city','marshall','center','missile']){let q=M.makeLayout('empty'),a=M.makeObject(q,type);q=M.addObject(q,a);const b=M.makeObject(q,'missile',a.x,a.y);q=M.addObject(q,b);assert.equal(M.blocks(a,b),false);assert.equal(M.blocks(b,a),false);assert.doesNotThrow(()=>M.validate({...q,objects:[...q.objects].reverse()}));}
const area={left:-40.5,right:40.5,bottom:-40.5,top:40.5};assert.deepEqual(M.planBaseFill(s,area,2).positions.map(o=>[o.x,o.y]),M.planBaseFill(M.makeLayout('empty'),area,2).positions.map(o=>[o.x,o.y]));
s=M.addObject(s,M.makeObject(s,'base'));const old=M.coords(s,missile);s=M.updateObject(s,missile.id,{w:50,h:42});missile=s.objects[0];assert.deepEqual(M.coords(s,missile),old);s=M.moveObject(s,missile.id,1.5,2.5);s=M.moveObject(s,s.objects[1].id,2,3);assert.doesNotThrow(()=>M.validate(s));
const rect=M.rect(s.objects[0]);s=M.resizeTerrain(s,missile.id,'ne',rect.left+48,rect.bottom+46);assert.deepEqual([s.objects[0].w,s.objects[0].h],[48,46]);assert.throws(()=>M.setObjectCorner(s,missile.id,999,999));assert.throws(()=>M.updateObject(s,missile.id,{w:35.5}));
assert.deepEqual(W.activePlan(W.readFile(W.saveFile(W.createWorkspace(s)))),s);
console.log('Passed: independent mud/core dimensions, integer alignment, fixed numeric anchor, corner resizing, atomic collisions, legacy plans and collision-free missile movement/filling/save-open.');
