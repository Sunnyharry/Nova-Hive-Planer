const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
vm.runInThisContext(fs.readFileSync('dist/model.js','utf8'));const M=globalThis.HiveModel;
const roundTrip=s=>assert.deepEqual(M.validate(JSON.parse(JSON.stringify(s))),s);
const terrain=(s,x,y,w,h)=>({...M.makeObject(s,'terrain'),x:x+(w-1)/2,y:y+(h-1)/2,w,h});

// The exact requested corner is independent of dimensions and of a moved coordinate origin.
for(const [w,h] of [[5,5],[5,6],[4,4],[1,1],[60,60]]){
 let s=M.makeLayout('empty');const o=terrain(s,0,0,w,h);s=M.addObject(s,o);s=M.setTerrainCorner(s,o.id,820,920);
 let placed=s.objects[0];assert.deepEqual(M.terrainCornerCoords(s,placed),{x:820,y:920});assert.equal(placed.x,320+(w-1)/2);assert.equal(placed.y,420+(h-1)/2);
 s=M.updateObject(s,o.id,{w:6,h:9});assert.deepEqual(M.terrainCornerCoords(s,s.objects[0]),{x:820,y:920});roundTrip(s);
 s=M.moveObject(s,o.id,s.objects[0].x+1,s.objects[0].y-1);assert.deepEqual(M.terrainCornerCoords(s,s.objects[0]),{x:821,y:919});roundTrip(s);
}
let shifted=M.makeLayout('empty');shifted.origin={x:810,y:900,mapX:100,mapY:-40};let so=terrain(shifted,130,10,5,6);shifted=M.addObject(shifted,so);shifted=M.setTerrainCorner(shifted,so.id,820,920);assert.deepEqual(M.rect(shifted.objects[0]),{left:109.5,right:114.5,bottom:-20.5,top:-14.5});roundTrip(shifted);
assert.throws(()=>M.setTerrainCorner(shifted,so.id,820.25,920));assert.throws(()=>M.setTerrainCorner(shifted,so.id,Infinity,920));
const invalid=M.clone(shifted);invalid.objects[0].x+=.01;assert.throws(()=>M.validate(invalid));

// An L shape has one visible perimeter, preserves its cut-out, and moves as one unit.
let shape=M.makeLayout('empty');const a=terrain(shape,0,0,3,9),b=terrain(shape,3,0,6,3);shape=M.addObject(M.addObject(shape,a),b);shape=M.connectTerrains(shape,[a.id,b.id]);
const group=shape.objects[0].terrainGroup;assert.equal(shape.objects[1].terrainGroup,group);assert.deepEqual(M.expandObjectIds(shape,[a.id]),[a.id,b.id]);roundTrip(shape);
const geometry=M.terrainUnionGeometry(shape.objects);assert.equal(geometry.slices.reduce((sum,r)=>sum+(r.right-r.left)*(r.top-r.bottom),0),45);
assert.equal(geometry.edges.reduce((sum,[x1,y1,x2,y2])=>sum+Math.abs(x2-x1)+Math.abs(y2-y1),0),36);
const inCutout=M.makeObject(shape,'base',6,6);shape=M.addObject(shape,inCutout);assert.equal(M.collision(shape,inCutout),null);roundTrip(shape);
let moved=M.setTerrainCorner(shape,b.id,820,920);assert.deepEqual(M.terrainCornerCoords(moved,moved.objects[0]),{x:820,y:920});assert.equal(moved.objects[1].x-moved.objects[0].x,b.x-a.x);assert.deepEqual(moved.objects[2],inCutout);roundTrip(moved);
assert.throws(()=>M.moveObjects(shape,[{id:a.id,x:a.x+1,y:a.y}]));assert.throws(()=>M.updateObject(shape,a.id,{w:5}));
const separated=M.disconnectTerrains(shape,[b.id]);assert.ok(separated.objects.every(o=>!o.terrainGroup));assert.equal(M.removeObject(shape,a.id).objects.length,1);
let another=terrain(shape,20,20,4,4);assert.throws(()=>M.connectTerrains(M.addObject(shape,another),[a.id,another.id]));
// Joining an already connected shape includes all its pieces.
let bridge=terrain(shape,9,0,3,3),expanded=M.addObject(shape,bridge);expanded=M.connectTerrains(expanded,[b.id,bridge.id]);assert.equal(new Set(expanded.objects.filter(o=>o.type==='terrain').map(o=>o.terrainGroup)).size,1);roundTrip(expanded);
// Overlapping parts have no doubled interior borders; a ring keeps its central hole.
const overlapping=[terrain(shape,0,0,5,5),terrain(shape,3,0,5,5)],union=M.terrainUnionGeometry(overlapping);
assert.equal(union.slices.reduce((sum,r)=>sum+(r.right-r.left)*(r.top-r.bottom),0),40);assert.equal(union.edges.reduce((sum,[x1,y1,x2,y2])=>sum+Math.abs(x2-x1)+Math.abs(y2-y1),0),26);
const ring=[terrain(shape,0,0,9,3),terrain(shape,0,6,9,3),terrain(shape,0,3,3,3),terrain(shape,6,3,3,3)],ringGeo=M.terrainUnionGeometry(ring);
assert.equal(ringGeo.slices.reduce((sum,r)=>sum+(r.right-r.left)*(r.top-r.bottom),0),72);assert.equal(ringGeo.edges.reduce((sum,[x1,y1,x2,y2])=>sum+Math.abs(x2-x1)+Math.abs(y2-y1),0),48);

// Batch movement ignores the selected objects' old positions, but rejects a collision atomically.
let batch=M.makeLayout('empty');for(const x of [0,3,30])batch=M.addObject(batch,M.makeObject(batch,'base',x,0));const snapshot=M.clone(batch),[ba,bb]=batch.objects;
let result=M.moveObjects(batch,[{id:ba.id,x:3,y:0},{id:bb.id,x:6,y:0}]);assert.deepEqual(result.objects.map(o=>o.x),[3,6,30]);roundTrip(result);assert.deepEqual(batch,snapshot);
assert.throws(()=>M.moveObjects(batch,[{id:ba.id,x:27,y:0},{id:bb.id,x:30,y:0}]));assert.deepEqual(batch,snapshot);
assert.throws(()=>M.moveObjects(batch,[{id:ba.id,x:.5,y:0}]));
let anchored=M.makeLayout('empty'),center=M.makeObject(anchored,'center',0,0);anchored=M.addObject(anchored,center);let base=M.makeObject(anchored,'base',8,0);anchored=M.addObject(anchored,base);
const withCenter=M.moveObjects(anchored,[{id:center.id,x:4,y:4},{id:base.id,x:12,y:4}]);assert.deepEqual(M.cornerCoords(withCenter,withCenter.objects[0]),{x:500,y:500});assert.deepEqual(M.cornerCoords(withCenter,withCenter.objects[1]),{x:511,y:503});roundTrip(withCenter);

// All spacing options produce bounded, non-overlapping bases and preserve occupied objects.
for(const gap of [0,1,2]){
 const empty=M.makeLayout('empty'),area={left:-1.5,right:13.5,bottom:-1.5,top:13.5},preview=M.planBaseFill(empty,area,gap),filled=M.fillBases(empty,area,gap);
 assert.equal(filled.added,{0:25,1:16,2:9}[gap]);assert.deepEqual(filled.state.objects.map(o=>({x:o.x,y:o.y})),preview.positions);assert.equal(empty.objects.length,0);roundTrip(filled.state);
 for(const o of filled.state.objects){const r=M.rect(o);assert.ok(r.left>=area.left&&r.right<=area.right&&r.bottom>=area.bottom&&r.top<=area.top);assert.equal(M.collision(filled.state,o),null);}
 const xs=[...new Set(filled.state.objects.map(o=>o.x))].sort((a,b)=>a-b);assert.equal(xs[1]-xs[0],3+gap);
 assert.deepEqual(M.planBaseFill(empty,{left:area.right,right:area.left,bottom:area.top,top:area.bottom},gap),preview);
 const occupied=filled.state.objects[0],partial={...empty,objects:[occupied]},refill=M.fillBases(partial,area,gap);assert.deepEqual(refill.state.objects[0],occupied);assert.equal(refill.added,filled.added-1);
}
let obstacles=M.makeLayout('empty');obstacles=M.addObject(obstacles,M.makeObject(obstacles,'center',0,0));obstacles=M.addObject(obstacles,terrain(obstacles,5,-1,4,8));const prior=M.clone(obstacles);
for(const gap of [0,1,2]){const r=M.fillBases(obstacles,{left:-15.5,right:15.5,bottom:-15.5,top:15.5},gap);assert.ok(r.added>0&&r.skipped>0);for(const o of r.state.objects)assert.equal(M.collision(r.state,o),null);assert.deepEqual(obstacles,prior);roundTrip(r.state);}
const tiny=M.fillBases(M.makeLayout('empty'),{left:0,right:2,bottom:0,top:2},0);assert.equal(tiny.added,0);
const huge=M.fillBases(M.makeLayout('empty'),{left:-5000,right:5000,bottom:-5000,top:5000},0);assert.equal(huge.added,800);assert.ok(huge.limited);roundTrip(huge.state);
const legacy=M.addPlayers(M.makeLayout(),'P1\nP2').state;legacy.version=3;legacy.players[0].priority=1;legacy.priorityLabels=['Core','',''];const loaded=M.validate(legacy);assert.equal(loaded.version,M.VERSION);assert.equal(loaded.players[0].priority,1);assert.deepEqual(loaded.priorityLabels,legacy.priorityLabels);
console.log('Passed: exact 820/920 corner, rectangular resizing, union outlines and holes, compound movement/persistence, atomic selection movement, anchor coordinates, all three fill spacings, obstacle skipping and limits, v3 migration.');
