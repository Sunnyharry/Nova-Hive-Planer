const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const file of ['model','workspace'])vm.runInThisContext(fs.readFileSync('dist/'+file+'.js','utf8'));
const M=globalThis.HiveModel,W=globalThis.HiveWorkspace;
let workspace=W.createWorkspace();assert.equal(workspace.variants.length,21);assert.deepEqual(workspace.active,{season:'4',layout:'spaced'});
let state=M.addPlayers(W.activePlan(workspace),'Harry\nMary\nMikey').state;
state=M.setPlayerPriorities(state,[state.players[0].id],1);state=M.setPlayerGroup(state,state.players[0].id,3);const players=state.players;
state=M.assign(state,players[0].id,state.objects.find(o=>o.beacon==='A').id);state.title='Spaced work';workspace=W.updateWorkspace(workspace,state);const spaced=M.clone(state);
// A custom empty layout, including joined terrain, has its own complete state.
workspace=W.switchVariant(workspace,'4','empty');state=W.activePlan(workspace);assert.equal(state.objects.length,0);assert.deepEqual(state.players,players);
for(const [x,y,w,h] of [[30,30,4,6],[34,30,5,3]]){const terrain={...M.makeObject(state,'terrain'),x:x+(w-1)/2,y:y+(h-1)/2,w,h};state=M.addObject(state,terrain);}
state=M.connectTerrains(state,state.objects.map(o=>o.id));state=M.setTerrainCorner(state,state.objects[0].id,820,920);
state=M.addObject(state,M.makeObject(state,'center',0,0));state=M.fillBases(state,{left:10,right:30,bottom:0,top:20},2).state;state=M.assign(state,players[1].id,state.objects.find(o=>o.type==='base').id);state.title='My custom empty map';state.showLight=false;
workspace=W.updateWorkspace(workspace,state);const empty=M.clone(state),beforeSwitch=JSON.stringify(workspace);
workspace=W.switchVariant(workspace,'4','compact');state=W.activePlan(workspace);state=M.assign(state,players[2].id,state.objects.find(o=>o.type==='base').id);state=M.setOrigin(state,700,700);workspace=W.updateWorkspace(workspace,state);const compact=M.clone(state);
workspace=W.switchVariant(workspace,'off','empty');state=W.activePlan(workspace);state=M.addObject(state,M.makeObject(state,'marshall',10,10));state.title='Off-season custom';workspace=W.updateWorkspace(workspace,state);const off=M.clone(state);
workspace=W.switchVariant(workspace,'4','empty');assert.deepEqual(W.activePlan(workspace),empty);
const saved=JSON.parse(JSON.stringify(W.saveFile(workspace))),loaded=W.readFile(saved);assert.equal(loaded.variants.length,21);assert.deepEqual(loaded.active,{season:'4',layout:'empty'});assert.deepEqual(W.activePlan(loaded),empty);
for(const [season,layout,expected] of [['4','spaced',spaced],['4','compact',compact],['off','empty',off]])assert.deepEqual(W.activePlan(W.switchVariant(loaded,season,layout)),expected);
assert.equal(JSON.parse(beforeSwitch).variants.find(v=>v.season==='4'&&v.layout==='empty').title,empty.title);
// Shared player edits reach every variant without replacing geometry or assignments.
let modified=M.setPlayerPriorities(W.activePlan(loaded),[players[2].id],1);modified=M.setPlayerGroup(modified,players[2].id,10);modified=M.setPriorityLabel(modified,1,'Core');modified.players[2].name='Mikey updated';let shared=W.updateWorkspace(loaded,modified);
let other=W.activePlan(W.switchVariant(shared,'4','compact'));assert.equal(other.players[2].name,'Mikey updated');assert.equal(other.players[2].priority,1);assert.equal(M.groupForPlayer(other,players[2].id).id,10);assert.equal(other.priorityLabels[0],'Core');assert.deepEqual(other.objects,compact.objects);
const history=shared;shared=W.updateWorkspace(shared,M.removePlayer(W.activePlan(shared),players[2].id));assert.ok(shared.variants.every(v=>v.objects.every(o=>o.playerId!==players[2].id)));assert.ok(history.variants.find(v=>v.season==='4'&&v.layout==='compact').objects.some(o=>o.playerId===players[2].id));W.validateWorkspace(shared);
const cleared=W.updateWorkspace(loaded,M.clearPlayers(W.activePlan(loaded)));assert.equal(cleared.players.length,0);assert.ok(cleared.variants.every(v=>v.objects.every(o=>!o.playerId)));W.validateWorkspace(cleared);
// Clearing assignments and resetting geometry affect only the active variant.
const unassigned=W.updateWorkspace(loaded,M.unassignAll(W.activePlan(loaded)));assert.deepEqual(W.activePlan(W.switchVariant(unassigned,'4','compact')),compact);
const reset=W.updateWorkspace(loaded,M.makeLayout('empty',W.activePlan(loaded)));assert.equal(W.activePlan(reset).objects.length,0);assert.deepEqual(W.activePlan(W.switchVariant(reset,'4','compact')),compact);assert.deepEqual(W.activePlan(loaded),empty);
// Every visited combination, including developing seasons, survives a single save/load.
let all=W.createWorkspace();for(const season of M.SEASONS)for(const layout of W.LAYOUTS){all=W.switchVariant(all,season,layout);const p=W.activePlan(all);p.title=season+'/'+layout;all=W.updateWorkspace(all,p);}const allLoaded=W.readFile(W.saveFile(all));assert.deepEqual(allLoaded,all);
// Older single-plan files remain in their exact active season/layout, including empty layouts.
for(const layout of W.LAYOUTS){const p=M.makeLayout(layout);p.title='Legacy '+layout;if(layout==='empty')p.objects.push(M.makeObject(p,'base',10,10));const read=W.readFile(p);assert.deepEqual(W.activePlan(read),p);assert.equal(read.variants.length,21);}
const badSamples=[raw=>raw.variants.pop(),raw=>raw.variants[0]=raw.variants[1],raw=>raw.active.layout='unknown',raw=>raw.planVersion=1,raw=>raw.variants[0].objects[0].x=10000,raw=>raw.variants[0].objects[0].playerId='missing',raw=>raw.players[0].priority=0];
for(const mutate of badSamples){const bad=M.clone(saved);mutate(bad);assert.throws(()=>W.readFile(bad));assert.deepEqual(W.activePlan(loaded),empty);}
assert.throws(()=>W.switchVariant(loaded,'4','unknown'));
console.log('Passed: all 21 variants, custom empty-map round-trip, active layout, independent geometry and assignments, shared roster organization, immutable history and malformed-file rejection.');
