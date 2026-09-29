const assert=require('node:assert/strict');require('../dist/world-map.js');require('../dist/model.js');require('../dist/workspace.js');
const M=HiveModel,W=HiveWorkspace;
let w=W.createWorkspace(M.makeLayout('empty'));
assert.deepEqual(w.allianceProfiles.map(a=>a.id),[1]);
let s=M.editAlliance(W.activePlan(w),1,'Home','#abcdef');s=M.editAlliance(s,2,'North','#123456');w=W.updateWorkspace(w,s);
for(const season of M.SEASONS)for(const layout of W.LAYOUTS){const p=W.activePlan(W.switchVariant(w,season,layout));assert.equal(M.allianceName(p,1),'Home');assert.equal(M.allianceColor(p,2),'#123456');}
s=M.setAlliance(W.activePlan(w),2);s=M.addPlayers(s,'Alice').state;s=M.addObject(s,M.makeObject(s,'base',30,40));s=M.assign(s,s.players[0].id,s.objects[0].id);w=W.updateWorkspace(w,s);
assert.throws(()=>W.removeAlliance(w,2));const ids=s.objects.map(o=>o.id),players=M.clone(s.players);w=W.updateWorkspace(w,M.editAlliance(s,2,'Renamed','#654321'));
assert.deepEqual(W.activePlan(w).objects.map(o=>o.id),ids);assert.deepEqual(W.activePlan(w).players,players);
// Legacy data: third alliance exists only in an inactive variant and a blueprint.
const old=M.clone(w);old.planVersion=11;delete old.allianceProfiles;const variant=old.variants.find(v=>v.season==='off'&&v.layout==='empty');variant.activeAlliance=3;variant.objects=[{...M.makeObject(M.makeLayout('empty'),'base',50,60),alliance:3}];
const migrated=W.readFile(old);assert.deepEqual(migrated.allianceProfiles.map(a=>a.id),[1,2,3]);assert.equal(M.allianceOf(W.activePlan(W.switchVariant(migrated,'off','empty')).objects[0]),3);
assert.deepEqual(W.readFile(W.saveFile(migrated)),migrated);
const withEmpty=W.updateWorkspace(migrated,M.editAlliance(W.activePlan(migrated),4,'Empty','#112233'));const removed=W.removeAlliance(withEmpty,4);assert.deepEqual(removed.allianceProfiles.map(a=>a.id),[1,2,3]);assert.throws(()=>W.removeAlliance(migrated,3));assert.throws(()=>W.removeAlliance(W.createWorkspace(M.makeLayout('empty')),1));
for(const profiles of [[],[{id:1,name:'Bad',color:'url(x)'}],[{id:1,name:'A',color:'#112233'},{id:1,name:'B',color:'#445566'}]])assert.throws(()=>M.validate({...M.makeLayout('empty'),allianceProfiles:profiles}));
let many=M.makeLayout('empty');for(let id=2;id<=8;id++)many=M.editAlliance(many,id,'Team '+id,'#112233');many=M.addPlayers(many,'Last').state;many=M.addObject(many,M.makeObject(many,'base'));assert.equal(M.allianceOf(many.objects[0]),8);assert.deepEqual(M.validate(many),many);
console.log('Passed: one initial alliance, shared name/color across 21 variants, stable IDs/assignments, legacy three-alliance migration including inactive geometry, deletion guards and dynamic IDs beyond five.');
