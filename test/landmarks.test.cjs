const assert=require('node:assert/strict');require('../dist/model.js');require('../dist/workspace.js');const M=HiveModel,W=HiveWorkspace;
for(const [type,size,core] of [['stronghold',13,5],['city',15,7]]){
 let s=M.makeLayout('empty'),land=M.makeObject(s,type,0,0);assert.equal(land.w,size);assert.equal(M.coreSize(land),core);s=M.addObject(s,land);
 const x=(core+3)/2,base=M.makeObject(s,'base',x,0);s=M.addObject(s,base);assert.ok(M.overlaps(base,land));assert.equal(M.blocks(base,land),false);
 assert.throws(()=>M.addObject(s,M.makeObject(s,'base',x-1,0)));assert.throws(()=>M.moveObject(s,base.id,0,0));
 const moved=M.moveObjects(s,s.objects.map(o=>({id:o.id,x:o.x+20,y:o.y+20})));assert.equal(moved.objects.length,2);M.validate(moved);
 assert.doesNotThrow(()=>M.validate({...s,objects:[...s.objects].reverse()}));
 const f=M.fillBases(M.addObject(M.makeLayout('empty'),land),{left:-20,right:20,bottom:-20,top:20},0);const result=f.state??f;assert.ok(result.objects.some(o=>o.type==='base'&&M.overlaps(o,land)));assert.ok(result.objects.filter(o=>o.type==='base').every(o=>!M.overlaps(o,M.solidFootprint(land))));
 assert.throws(()=>M.setObjectCorner(s,land.id,1000-size+1,500));
 const w=W.createWorkspace(s);assert.deepEqual(W.activePlan(W.readFile(W.saveFile(w))),s);
}
let s=M.makeLayout('empty');const a=M.makeObject(s,'terrain',0,0),b=M.makeObject(s,'terrain',4,0);s=M.addObject(M.addObject(s,a),b);s=M.connectTerrains(s,[a.id,b.id]);s=M.updateObject(s,a.id,{color:'#00AaFF'});assert.ok(s.objects.every(o=>o.color==='#00aaff'));assert.deepEqual(M.validate(s),s);assert.throws(()=>M.updateObject(s,a.id,{color:'url(evil)'}));const old=M.makeLayout('empty');old.version=6;assert.equal(M.validate(old).version,7);
console.log('Passed: landmark cores vs mud, move/import/fill/bounds, terrain colors, schema 6.');
