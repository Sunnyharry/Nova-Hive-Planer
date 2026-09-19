const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
vm.runInThisContext(fs.readFileSync('dist/model.js','utf8'));const M=globalThis.HiveModel;
const roundTrip=s=>assert.deepEqual(M.validate(JSON.parse(JSON.stringify(s))),s);
const checkWorld=s=>{const b=M.worldBounds(s);assert.equal(b.right-b.left,1000);assert.equal(b.top-b.bottom,1000);for(const o of s.objects){const q=M.coords(s,o);assert.ok(Number.isInteger(q.x)&&Number.isInteger(q.y));M.assertWorldPlacement(s,o);}roundTrip(s);};
// Every type uses a bottom-left tile. Its entire footprint, not just its center, must fit.
for(const type of ['base','beacon','marshall','center','terrain']){
 let s=M.makeLayout('empty'),o=M.makeObject(s,type);s=M.addObject(s,o);const world=M.worldBounds(s);
 s=M.setObjectCorner(s,o.id,820,920);assert.deepEqual(M.coords(s,s.objects[0]),{x:820,y:920});assert.deepEqual(M.worldBounds(s),world);checkWorld(s);
 s=M.setObjectCorner(s,o.id,0,0);assert.deepEqual(M.coords(s,s.objects[0]),{x:0,y:0});checkWorld(s);
 s=M.setObjectCorner(s,o.id,1000-o.w,1000-o.h);checkWorld(s);const before=M.clone(s);
 for(const [x,y] of [[1001-o.w,1000-o.h],[1000-o.w,1001-o.h],[-1,0],[0,-1],[0.5,5],[5,0.1],[1000,0],[0,1000],[NaN,5],[Infinity,5]])assert.throws(()=>M.setObjectCorner(s,o.id,x,y));
 assert.deepEqual(s,before);
}
// Resizing through every corner retains integer public coordinates for odd and even dimensions.
for(const [w,h] of [[1,1],[4,4],[5,5],[5,6],[6,5],[60,60]]){
 let s=M.makeLayout('empty'),o=M.makeObject(s,'terrain');s=M.addObject(s,o);s=M.updateObject(s,o.id,{w,h});s=M.setObjectCorner(s,o.id,820,920);
 assert.deepEqual(M.coords(s,s.objects[0]),{x:820,y:920});checkWorld(s);
 s=M.updateObject(s,o.id,{w:6,h:9});assert.deepEqual(M.coords(s,s.objects[0]),{x:820,y:920});
 for(const corner of ['nw','ne','sw','se']){const r=M.rect(s.objects[0]);const east=corner.endsWith('e'),north=corner.startsWith('n');const resized=M.resizeTerrain(s,o.id,corner,(east?r.right:r.left)+(east?2:-2),(north?r.top:r.bottom)+(north?1:-1));checkWorld(resized);}
 const moved=M.moveObject(s,o.id,s.objects[0].x+1.4,s.objects[0].y-2.2);assert.deepEqual(M.coords(moved,moved.objects[0]),{x:821,y:918});checkWorld(moved);
}
let edge=M.makeLayout('empty'),tile=M.makeObject(edge,'terrain');edge=M.addObject(edge,tile);edge=M.updateObject(edge,tile.id,{w:1,h:1});edge=M.setObjectCorner(edge,tile.id,999,999);checkWorld(edge);assert.throws(()=>M.updateObject(edge,tile.id,{w:2}));assert.throws(()=>M.resizeTerrain(edge,tile.id,'ne',10000,10000));
// Moving or adding the reference leaves every other object's world position and world borders unchanged.
for(const season of ['4','off']){
 let s=M.setSeason(M.makeLayout('empty'),season),base=M.makeObject(s,'base',20,20);s=M.addObject(s,base);const baseBefore=M.coords(s,base),world=M.worldBounds(s);
 const anchor=M.makeObject(s,M.anchorType(s),10,0);s=M.addObject(s,anchor);assert.deepEqual(M.coords(s,base),baseBefore);assert.deepEqual(M.worldBounds(s),world);
 s=M.setObjectCorner(s,anchor.id,820,920);assert.deepEqual(M.coords(s,s.objects.find(o=>o.id===anchor.id)),{x:820,y:920});assert.deepEqual(M.coords(s,base),baseBefore);assert.deepEqual(M.worldBounds(s),world);checkWorld(s);
 s=M.removeObject(s,anchor.id);assert.deepEqual(M.coords(s,base),baseBefore);checkWorld(s);
}
for(const season of M.SEASONS){const s=M.setSeason(M.makeLayout('spaced'),season);checkWorld(s);const aligned=M.setOrigin(s,700,800);assert.deepEqual(M.referenceCoords(aligned),{x:700,y:800});checkWorld(aligned);assert.throws(()=>M.setOrigin(s,0,0));}
// Group moves and compound terrain fail atomically at any boundary.
let group=M.makeLayout('empty');for(const x of [0,3])group=M.addObject(group,M.makeObject(group,'base',x,0));const copy=M.clone(group);assert.throws(()=>M.moveObjects(group,group.objects.map(o=>({id:o.id,x:o.x+499,y:o.y}))));assert.deepEqual(group,copy);
let shape=M.makeLayout('empty');for(const [x,y,w,h] of [[0,0,3,6],[3,0,6,3]]){let o={...M.makeObject(shape,'terrain'),x:x+(w-1)/2,y:y+(h-1)/2,w,h};shape=M.addObject(shape,o);}shape=M.connectTerrains(shape,shape.objects.map(o=>o.id));shape=M.setObjectCorner(shape,shape.objects[0].id,991,994);checkWorld(shape);const beforeShape=M.clone(shape);assert.throws(()=>M.setObjectCorner(shape,shape.objects[1].id,992,994));assert.deepEqual(shape,beforeShape);
// Area filling clips to the world even when the selected rectangle extends beyond it.
for(const gap of [0,1,2]){
 const s=M.makeLayout('empty'),w=M.worldBounds(s),filled=M.fillBases(s,{left:w.right-16,right:w.right+30,bottom:w.top-16,top:w.top+30},gap);
 assert.ok(filled.added>0);checkWorld(filled.state);for(const o of filled.state.objects){const q=M.coords(filled.state,o);assert.ok(q.x>=984&&q.y>=984&&q.x<=997&&q.y<=997);}
 assert.equal(M.fillBases(s,{left:w.right+1,right:w.right+100,bottom:w.bottom,top:w.top},gap).added,0);
}
// Legacy files migrate to aligned tiles without losing players, priorities or terrain connections.
for(const version of [1,2,3,4]){
 const legacy=M.addPlayers(M.makeLayout(),'Harry\nMary').state;legacy.version=version;if(version===1){delete legacy.groups;delete legacy.season;}if(version<=2){delete legacy.priorityLabels;for(const p of legacy.players)delete p.priority;}
 checkWorld(M.validate(legacy));
}
let legacy=M.makeLayout('empty');legacy.version=4;legacy.objects.push({...M.makeObject(legacy,'terrain'),x:322.5,y:423,w:5,h:6,terrainGroup:'joined'});legacy.objects.push({...M.makeObject(legacy,'terrain'),x:327.5,y:421.5,w:5,h:3,terrainGroup:'joined'});const legacyBefore=M.clone(legacy),migrated=M.validate(legacy);assert.deepEqual(M.coords(migrated,migrated.objects[0]),{x:820,y:920});assert.equal(migrated.objects[0].terrainGroup,'joined');assert.deepEqual(legacy,legacyBefore);checkWorld(migrated);
const offGrid=M.clone(migrated);offGrid.objects[0].x+=.5;assert.throws(()=>M.validate(offGrid));
const outside=M.clone(legacy);outside.origin.x=1200;assert.throws(()=>M.validate(outside),/ältere Plan/);
// Large local drawing offsets are not world coordinates and still round-trip correctly.
let offset=M.makeLayout('empty');offset.origin.mapX=5000;offset.origin.mapY=5000;let anchor=M.makeObject(offset,'center',5000,5000);offset=M.addObject(offset,anchor);offset=M.setObjectCorner(offset,anchor.id,991,991);checkWorld(offset);
console.log('Passed: integer bottom-left coordinates for every object, all map edges, rectangular resizing, reference movement, all seasons, atomic groups, clipped fill and legacy migration.');
