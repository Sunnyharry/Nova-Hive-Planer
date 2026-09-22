const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
vm.runInThisContext(fs.readFileSync('dist/model.js','utf8'));
const M=globalThis.HiveModel;
const players=(state,n)=>M.addPlayers(state,Array.from({length:n},(_,i)=>`Member ${i+1}`).join('\n')).state;
const grouped=(state,ids,group)=>ids.reduce((s,id)=>M.setPlayerGroup(s,id,group),state);
const seats=(state,group)=>state.objects.filter(o=>state.groups.find(g=>g.id===group).playerIds.includes(o.playerId));

// Every selectable season produces a valid collision-free layout. Season 4 is unchanged.
for(const season of M.SEASONS)for(const kind of ['compact','spaced']){
 const s=M.setSeason(M.makeLayout(kind),season);
 assert.equal(s.objects.filter(o=>o.type==='base').length,100);
 assert.equal(s.objects.filter(o=>o.type==='center').length,season==='4'?1:0);
 assert.equal(s.objects.filter(o=>o.beacon).length,season==='4'?4:0);
 assert.equal(s.objects.filter(o=>o.type==='marshall').length,1);
 assert.equal(M.isDeveloping(s),!['off','4'].includes(season));
 assert.deepEqual(M.validate(JSON.parse(JSON.stringify(s))),s);
 for(const o of s.objects)assert.equal(M.collision(s,o),null);
 if(season!=='4'){
  const marshall=s.objects.find(o=>o.type==='marshall');
  assert.equal(marshall.x,s.origin.mapX);assert.equal(marshall.y,s.origin.mapY);assert.equal(s.showLight,false);
  for(const type of ['center','beacon'])assert.throws(()=>M.makeObject(s,type),/Season 4/);
  const base=s.objects.find(o=>o.type==='base');assert.throws(()=>M.updateObject(s,base.id,{beacon:'A'}),/Season 4/);
 }
}
let off=M.setOrigin(M.setSeason(M.makeLayout(),'off'),601,709);
const guard=off.objects.find(o=>o.type==='marshall'),base=off.objects.find(o=>o.type==='base');
const moved=M.moveObject(off,guard.id,1,0);
assert.deepEqual(M.coords(moved,moved.objects.find(o=>o.id===guard.id)),{x:602,y:709});
assert.equal(M.cornerCoords(moved,base).x,M.cornerCoords(off,base).x);
assert.equal(M.anchorType(moved),'marshall');
const noGuard=M.removeObject(moved,guard.id);assert.deepEqual(noGuard.origin,moved.origin);
const shifted=M.setOrigin(moved,700,800);
assert.deepEqual(M.autofillOptions(shifted).seats.map(o=>o.id),M.autofillOptions(moved).seats.map(o=>o.id));

// Legacy files migrate safely; new plans retain groups through save/load and season changes.
let state=players(M.makeLayout(),12),ids=state.players.map(p=>p.id);
state=grouped(state,ids.slice(0,3),1);state=grouped(state,ids.slice(3,6),10);
state=M.assign(state,ids[0],state.objects.find(o=>o.beacon==='A').id);
const legacy=M.clone(state);legacy.version=1;delete legacy.season;delete legacy.groups;
const migrated=M.validate(legacy);assert.equal(migrated.version,M.VERSION);assert.equal(migrated.season,'4');assert.equal(migrated.groups.length,10);assert.ok(migrated.groups.every(g=>!g.playerIds.length));
assert.deepEqual(migrated.objects,state.objects);assert.deepEqual(migrated.players,state.players);
assert.deepEqual(M.validate(JSON.parse(JSON.stringify(state))),state);
const switched=M.setSeason(state,'off');assert.deepEqual(switched.groups,state.groups);assert.deepEqual(switched.players,state.players);
assert.ok(M.objectForPlayer(switched,ids[0]));assert.deepEqual(M.validate(switched),switched);
let bad=M.clone(state);bad.groups[1].playerIds.push(ids[0]);assert.throws(()=>M.validate(bad),/einer Gruppe/);
bad=M.clone(state);bad.groups[0].id=11;assert.throws(()=>M.validate(bad),/Gruppenliste/);
const before=M.clone(state),same=M.setPlayerGroup(state,ids[0],1);assert.equal(same,state);
const transferred=M.setPlayerGroup(state,ids[0],2);assert.equal(M.groupForPlayer(transferred,ids[0]).id,2);assert.ok(!transferred.groups[0].playerIds.includes(ids[0]));assert.deepEqual(state,before);
assert.equal(M.groupForPlayer(M.setPlayerGroup(transferred,ids[0],null),ids[0]),null);
assert.throws(()=>M.setPlayerGroup(state,ids[0],11),/1 bis 10/);
assert.equal(M.groupForPlayer(M.removePlayer(state,ids[0]),ids[0]),null);
const cleared=M.clearPlayers(state);
assert.equal(cleared.players.length,0);assert.ok(cleared.groups.every(g=>!g.playerIds.length));assert.ok(cleared.objects.every(o=>!o.playerId));
assert.deepEqual(cleared.objects.map(({playerId,...o})=>o),state.objects.map(({playerId,...o})=>o));assert.deepEqual(state,before,'An undo snapshot retains names, groups and assignments.');
assert.deepEqual(M.validate(cleared),cleared);

// Three players can all touch in compact mode. Multiple groups stay connected in both layouts.
for(const kind of ['compact','spaced']){
 let s=players(M.setSeason(M.makeLayout(kind),'off'),11),p=s.players.map(p=>p.id);
 s=grouped(s,p.slice(0,3),1);s=grouped(s,p.slice(3,7),2);s=grouped(s,p.slice(7,10),10);
 const prior=M.clone(s),result=M.autofill(s),gap=kind==='compact'?0:1;
 assert.equal(result.assigned,11);assert.deepEqual(result.splitGroups,[]);assert.deepEqual(s,prior);
 for(const g of [1,2,10])assert.equal(M.groupComponents(seats(result.state,g),gap),1);
 const triple=seats(result.state,1);
 for(const a of triple)for(const b of triple)if(a!==b)assert.ok(M.areNeighbors(a,b,gap));
 assert.ok(Math.min(...triple.map(o=>o.x**2+o.y**2))<=(kind==='compact'?9:16),'The first group touches the central ring.');
 const freeAfterGroups=M.autofillOptions({...s,objects:result.state.objects.map(o=>o.playerId===p[10]?{...o,playerId:null}:o)}).seats;
 assert.equal(M.objectForPlayer(result.state,p[10]).id,freeAfterGroups[0].id,'The ungrouped player uses the closest remaining seat.');
 assert.deepEqual(M.autofill(s).state,result.state,'Placement is deterministic.');assert.deepEqual(M.validate(result.state),result.state);
}

// A manually placed group member anchors the rest; other manual seats and beacons stay fixed.
let anchored=players(M.makeLayout('compact'),6),ap=anchored.players.map(p=>p.id);
anchored=grouped(anchored,ap.slice(0,3),1);
const manual=anchored.objects.find(o=>o.slot===1),beacon=anchored.objects.find(o=>o.beacon==='B');
anchored=M.assign(anchored,ap[0],manual.id);anchored=M.assign(anchored,ap[5],beacon.id);
const anchorResult=M.autofill(anchored);
assert.equal(M.objectForPlayer(anchorResult.state,ap[0]).id,manual.id);assert.equal(M.objectForPlayer(anchorResult.state,ap[5]).id,beacon.id);
assert.equal(M.groupComponents(seats(anchorResult.state,1),0),1);assert.deepEqual(anchorResult.splitGroups,[]);
assert.equal(anchorResult.state.objects.filter(o=>o.beacon&&!o.playerId).length,3);

// Obstacles, separated fixed anchors and insufficient seats produce an honest split-group result.
let blocked=players(M.makeLayout('empty'),4),bp=blocked.players.map(p=>p.id);blocked=grouped(blocked,bp,1);
for(const [x,y] of [[0,0],[3,0],[30,0]])blocked=M.addObject(blocked,M.makeObject(blocked,'base',x,y));
blocked=M.addObject(blocked,M.makeObject(blocked,'terrain',12,0));
const sparse=M.autofill(blocked);assert.equal(sparse.assigned,3);assert.equal(sparse.remaining,1);assert.deepEqual(sparse.splitGroups,[1]);assert.deepEqual(M.validate(sparse.state),sparse.state);
let fixed=players(M.makeLayout('empty'),3),fp=fixed.players.map(p=>p.id);fixed=grouped(fixed,fp,2);
for(const [x,y] of [[0,0],[3,0],[40,0]])fixed=M.addObject(fixed,M.makeObject(fixed,'base',x,y));
fixed=M.assign(fixed,fp[0],fixed.objects[0].id);fixed=M.assign(fixed,fp[1],fixed.objects[2].id);
const split=M.autofill(fixed);assert.deepEqual(split.splitGroups,[2]);assert.equal(M.objectForPlayer(split.state,fp[0]).x,0);assert.equal(M.objectForPlayer(split.state,fp[1]).x,40);

// Corner resizing keeps the opposite corner fixed, snaps to tiles, and changes both dimensions together.
let ground=M.makeLayout('empty'),terrain=M.makeObject(ground,'terrain',0,0);ground=M.addObject(ground,terrain);
const initial=M.rect(terrain);
for(const corner of ['nw','ne','sw','se']){
 const east=corner.endsWith('e'),north=corner.startsWith('n'),fx=east?initial.left:initial.right,fy=north?initial.bottom:initial.top;
 const result=M.resizeTerrain(ground,terrain.id,corner,fx+(east?1:-1)*5,fy+(north?1:-1)*6),o=result.objects[0],r=M.rect(o);
 assert.equal(o.w,5);assert.equal(o.h,6);assert.equal(east?r.left:r.right,fx);assert.equal(north?r.bottom:r.top,fy);
 assert.equal(o.x,M.snap(o.x,o.w));assert.equal(o.y,M.snap(o.y,o.h));assert.deepEqual(M.validate(result),result);
 const small=M.terrainResizeCandidate(terrain,corner,fx+(east?1:-1)*1.1,fy+(north?1:-1)*1.1);assert.equal(small.w,1);assert.equal(small.h,1);
 const square=M.terrainResizeCandidate(terrain,corner,fx+(east?1:-1)*5.2,fy+(north?1:-1)*5.2);assert.equal(square.w,5);assert.equal(square.h,5);
}
const overlap=M.makeObject(ground,'terrain',5,5);ground=M.addObject(ground,overlap);
const expanded=M.resizeTerrain(ground,terrain.id,'ne',7.5,7.5);assert.equal(M.collision(expanded,expanded.objects[0]),null);assert.deepEqual(M.validate(expanded),expanded);
const building=M.makeObject(ground,'base',12,0);ground=M.addObject(ground,building);const unchanged=M.clone(ground);
assert.throws(()=>M.resizeTerrain(ground,terrain.id,'ne',14.5,7.5),/überschneidet/);assert.deepEqual(ground,unchanged);
assert.equal(M.terrainResizeCandidate(terrain,'ne',100,100).w,60);assert.equal(M.terrainResizeCandidate(terrain,'ne',-100,-100).w,1);
assert.throws(()=>M.terrainResizeCandidate(building,'ne',10,10),/Terrain-Größe/);
console.log('Passed: seven season layouts, Marshall coordinates, v1 migration, group persistence and transfers, one-click clearing with intact undo snapshots, connected central group autofill, fixed anchors, split warnings, and all four terrain corners.');
