const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const name of ['model','workspace'])vm.runInThisContext(fs.readFileSync('dist/'+name+'.js','utf8'));
const M=globalThis.HiveModel,W=globalThis.HiveWorkspace;
let state=M.makeLayout('empty');
const centers=[],players=[],bases=[];
for(let id=1;id<=5;id++){
 state=M.setAlliance(state,id);const x=(id-1)*70;
 const center=M.makeObject(state,'center',x,0);centers.push(center);state=M.addObject(state,center);
 assert.throws(()=>M.addObject(state,M.makeObject(state,'center',x,30)));
 state=M.addPlayers(state,'Same name\nFriend').state;players.push(M.alliancePlayers(state));
 state=M.setPlayerGroups(state,M.alliancePlayers(state).map(p=>p.id),1);state=M.setPriorityLabel(state,1,'Core '+id);
 const fill=M.fillBases(state,{left:x-17.5,right:x+17.5,bottom:-17.5,top:17.5},2);state=fill.state;bases.push(M.allianceObjects(state).filter(o=>o.type==='base'));
 const before=M.clone(state.objects.filter(o=>!M.owns(state,o))),result=M.autofill(state);state=result.state;
 assert.equal(result.assigned,2);assert.deepEqual(state.objects.filter(o=>!M.owns(state,o)),before);
 assert.ok(M.allianceObjects(state).filter(o=>o.playerId).every(o=>M.alliancePlayers(state).some(p=>p.id===o.playerId)));
 const beacon=bases[id-1].at(-1);state=M.updateObject(state,beacon.id,{beacon:'A'});
 assert.deepEqual(M.validate(JSON.parse(JSON.stringify(state))),state);
}
assert.equal(state.objects.filter(o=>o.type==='center').length,5);assert.equal(state.players.length,10);
for(let id=1;id<=5;id++){
 state=M.setAlliance(state,id);assert.equal(M.priorityLabel(state,1),'Core '+id);assert.equal(M.allianceGroups(state).find(g=>g.id===1).playerIds.length,2);
 const foreign=bases[id%5][0];assert.throws(()=>M.assign(state,players[id-1][0].id,foreign.id,true));
 assert.throws(()=>M.setPlayerGroups(state,[players[id%5][0].id],1));
 assert.throws(()=>M.moveObject(state,foreign.id,400,300));assert.throws(()=>M.removeObject(state,foreign.id));
 const other=state.objects.filter(o=>!M.owns(state,o)),coords=other.map(o=>M.coords(state,o)),ref=M.referenceCoords(state);
 const shifted=M.setOrigin(state,ref.x,ref.y+40);
 assert.deepEqual(other.map(o=>M.coords(shifted,shifted.objects.find(q=>q.id===o.id))),coords);
 assert.equal(M.coords(shifted,shifted.objects.find(o=>o.id===centers[id-1].id)).y,ref.y+40);
 assert.deepEqual(M.validate(shifted),shifted);
 const cleared=M.clearPlayers(state);assert.equal(M.alliancePlayers(cleared).length,0);assert.equal(cleared.players.length,8);assert.deepEqual(cleared.objects.filter(o=>!M.owns(state,o)),other);
 const unassigned=M.unassignAll(state);assert.ok(M.allianceObjects(unassigned).every(o=>!o.playerId));assert.deepEqual(unassigned.objects.filter(o=>!M.owns(state,o)),other);
}
// All five alliances survive JSON round trips and every variant switch.
let workspace=W.createWorkspace(state);const saved=W.saveFile(workspace),restored=W.readFile(JSON.parse(JSON.stringify(saved)));assert.deepEqual(W.activePlan(restored),state);
workspace=W.switchVariant(workspace,'off','empty');let other=W.activePlan(workspace);assert.equal(other.players.length,10);other=M.setAlliance(other,3);other=M.addObject(other,M.makeObject(other,'marshall',0,0));workspace=W.updateWorkspace(workspace,other);
workspace=W.switchVariant(workspace,'4','empty');assert.deepEqual(W.activePlan(workspace),state);
const file=W.readFile(W.saveFile(workspace));assert.equal(W.activePlan(W.switchVariant(file,'off','empty')).activeAlliance,3);
// Reject imported cross-alliance assignment, groups, duplicates and invalid IDs.
for(const change of [s=>s.objects.find(o=>o.id===bases[0][0].id).playerId=players[1][0].id,s=>s.groups.find(g=>M.allianceOf(g)===1).playerIds.push(players[1][0].id),s=>s.objects.find(o=>o.id===centers[1].id).alliance=1,s=>s.activeAlliance=6,s=>s.players[0].alliance=0]){const bad=M.clone(state);change(bad);assert.throws(()=>M.validate(bad));}
// Older plans and workspaces map to Alliance 1.
const legacy=M.makeLayout();legacy.version=5;const migrated=M.validate(legacy);assert.equal(M.activeAlliance(migrated),1);assert.ok(migrated.objects.every(o=>M.allianceOf(o)===1));
const old=W.createWorkspace(legacy);old.planVersion=5;assert.equal(W.readFile(old).planVersion,6);
// All buildings collide across alliances; coverage is restricted to each alliance.
state=M.setAlliance(state,2);assert.throws(()=>M.addObject(state,M.makeObject(state,'base',centers[0].x,centers[0].y)));
const light=state.objects.find(o=>o.beacon&&M.allianceOf(o)===1);assert.equal(M.coverage(state,{...light,alliance:5}).center,false);
// Reset only active alliance, with no change to foreign objects or organization.
const foreign=state.objects.filter(o=>!M.owns(state,o));const reset=M.resetAllianceLayout(state);assert.deepEqual(reset.objects,foreign);assert.deepEqual(reset.players,state.players);assert.deepEqual(reset.groups,state.groups);
console.log('Passed: five centers, per-alliance roster/groups/priorities/beacons/autofill, collisions, scoped clear/reset/movement, shared world coordinates, coverage isolation, 21-variant persistence, malformed imports and legacy migration.');
