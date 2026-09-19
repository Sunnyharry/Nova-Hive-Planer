const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
vm.runInThisContext(fs.readFileSync('dist/i18n.js','utf8'));
vm.runInThisContext(fs.readFileSync('dist/model.js','utf8'));
const M=globalThis.HiveModel,I=globalThis.HiveI18n;
I.setLanguage('de');
const add=(s,n)=>M.addPlayers(s,Array.from({length:n},(_,i)=>`Player ${i+1}`).join('\n')).state;
let s=add(M.makeLayout(),8),ids=s.players.map(p=>p.id);
assert.ok(s.players.every(p=>p.priority===2));
s=M.setPlayerGroups(s,ids.slice(0,3),3);
const before=M.clone(s);
s=M.setPlayerPriorities(s,ids.slice(0,2),1);
assert.deepEqual(s.groups,before.groups);assert.deepEqual(s.objects,before.objects);assert.deepEqual(before.players.map(p=>p.priority),Array(8).fill(2));
assert.equal(M.setPlayerPriorities(s,ids.slice(0,2),1),s);
const next=M.setPlayerGroups(s,ids.slice(0,2),7);
assert.equal(M.groupForPlayer(next,ids[0]).id,7);assert.equal(next.players[0].priority,1);assert.deepEqual(next.groups.find(g=>g.id===3).playerIds,[ids[2]]);
assert.equal(M.groupForPlayer(M.setPlayerGroups(next,ids.slice(0,2),null),ids[0]),null);
const atomic=M.clone(s);
for(const priority of [0,4,1.5,'1',null])assert.throws(()=>M.setPlayerPriorities(s,[ids[0]],priority));
assert.throws(()=>M.setPlayerPriorities(s,[ids[0],'unknown'],3));assert.throws(()=>M.setPlayerGroups(s,[ids[0],'unknown'],5));assert.deepEqual(s,atomic);

// Editable labels persist independently of translation, map geometry, groups and priority values.
s=M.setPriorityLabel(s,1,'  Frontline  ');assert.equal(M.priorityLabel(s,1),'Frontline');
assert.throws(()=>M.setPriorityLabel(s,1,'x'.repeat(41)));
for(const language of I.languages){I.setLanguage(language);assert.equal(M.priorityLabel(s,1),'Frontline');assert.equal(M.priorityLabel(s,2),I.t('Aktiv'));for(const key of M.PRIORITY_DEFAULTS)assert.ok(I.messages[key]);}
I.setLanguage('de');
for(const season of M.SEASONS){const changed=M.setSeason(s,season);assert.deepEqual(changed.players,s.players);assert.deepEqual(changed.groups,s.groups);assert.deepEqual(changed.priorityLabels,s.priorityLabels);assert.deepEqual(M.validate(JSON.parse(JSON.stringify(changed))),changed);}
assert.deepEqual(M.makeLayout('compact',s).priorityLabels,s.priorityLabels);
const old=M.clone(s);old.version=2;delete old.priorityLabels;for(const p of old.players)delete p.priority;
const migrated=M.validate(old);assert.equal(migrated.version,M.VERSION);assert.ok(migrated.players.every(p=>p.priority===2));assert.deepEqual(migrated.groups,s.groups);assert.deepEqual(migrated.objects,s.objects);assert.deepEqual(migrated.priorityLabels,['','','']);
for(const mutation of [raw=>raw.players[0].priority=0,raw=>delete raw.players[0].priority,raw=>raw.priorityLabels=['one'],raw=>raw.priorityLabels[1]=null]){const bad=M.clone(s);mutation(bad);assert.throws(()=>M.validate(bad));}

// A straight row makes the ordering and lack of a fixed-ring quota unambiguous.
function row(n){let state=add(M.makeLayout('empty'),n);for(let i=0;i<n;i++)state=M.addObject(state,M.makeObject(state,'base',i*4,0));return state;}
let ranked=row(7),p=ranked.players.map(p=>p.id);
ranked=M.setPlayerGroups(ranked,p.slice(0,3),1); // [1,1,2] => 1.33
ranked=M.setPlayerGroups(ranked,p.slice(4,7),2); // [1,3,3] => 2.33
ranked=M.setPlayerPriorities(ranked,p.slice(0,2),1);
ranked=M.setPlayerPriorities(ranked,[p[4]],1);ranked=M.setPlayerPriorities(ranked,p.slice(5),3);
assert.equal(M.groupPriority(ranked,ranked.groups[0]),4/3);assert.equal(M.groupPriority(ranked,ranked.groups[1]),7/3);
const result=M.autofill(ranked),seat=id=>M.objectForPlayer(result.state,id).x;
assert.deepEqual(p.map(seat),[0,4,8,12,16,20,24]);assert.equal(result.assigned,7);assert.deepEqual(result.splitGroups,[]);
assert.deepEqual(M.autofill(ranked),result,'Identical input has identical output.');
let inner=row(3),ip=inner.players.map(p=>p.id);inner=M.setPlayerGroups(inner,ip,1);inner=M.setPlayerPriorities(inner,[ip[0]],3);inner=M.setPlayerPriorities(inner,[ip[2]],1);const innerFill=M.autofill(inner);assert.deepEqual(ip.map(id=>M.objectForPlayer(innerFill.state,id).x),[8,4,0]);
let solo=row(5),sp=solo.players.map(p=>p.id);
solo=M.setPlayerGroups(solo,sp.slice(0,3),1);solo=M.setPlayerPriorities(solo,sp.slice(0,3),3);solo=M.setPlayerPriorities(solo,[sp[4]],1);
const fill=M.autofill(solo);assert.equal(M.objectForPlayer(fill.state,sp[4]).x,0);assert.equal(M.objectForPlayer(fill.state,sp[3]).x,4);
let tie=row(3),tp=tie.players.map(p=>p.id);tie=M.setPlayerGroups(tie,tp.slice(1),1);assert.equal(M.objectForPlayer(M.autofill(tie).state,tp[0]).x,0,'An equal-priority group has no automatic advantage over an earlier solo.');
let limited=row(4),lp=limited.players.map(p=>p.id);limited=M.setPlayerPriorities(limited,lp.slice(2),1);limited.objects=limited.objects.slice(0,2);
const shortage=M.autofill(limited);assert.equal(shortage.assigned,2);assert.equal(shortage.remaining,2);assert.ok(lp.slice(2).every(id=>M.objectForPlayer(shortage.state,id)));assert.ok(lp.slice(0,2).every(id=>!M.objectForPlayer(shortage.state,id)));

// The manually placed P3 member remains a fixed anchor even when a P1 solo is waiting.
let fixed=row(5),fp=fixed.players.map(p=>p.id);fixed=M.setPlayerGroups(fixed,fp.slice(0,3),1);fixed=M.setPlayerPriorities(fixed,fp.slice(0,3),3);fixed=M.setPlayerPriorities(fixed,fp.slice(3),1);fixed=M.assign(fixed,fp[0],fixed.objects[4].id);
const snapshot=M.clone(fixed),anchored=M.autofill(fixed);
assert.deepEqual(fixed,snapshot);assert.deepEqual(M.objectForPlayer(anchored.state,fp[0]),M.objectForPlayer(fixed,fp[0]));assert.deepEqual(anchored.splitGroups,[]);
assert.deepEqual(M.unassignAll(anchored.state).players,anchored.state.players);assert.deepEqual(M.unassignAll(anchored.state).priorityLabels,anchored.state.priorityLabels);
assert.deepEqual(M.clearPlayers(anchored.state).priorityLabels,anchored.state.priorityLabels);
console.log('Passed: batch priorities and independent groups, P2 defaults, editable multilingual labels, v2 migration, all-season persistence, group means versus individuals, stable ties, shortages and fixed manual anchors.');
