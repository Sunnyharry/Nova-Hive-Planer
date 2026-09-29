const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const n of ['world-map','model','workspace'])vm.runInThisContext(fs.readFileSync('dist/'+n+'.js','utf8'));
const D=HiveWorldMap,M=HiveModel,W=HiveWorkspace;
const raw={schemaVersion:'2.0',map:{game:'Last War: Survival',season:'S04',width:1000,height:1000,coordinateSystem:'source_grid_coordinates',coordinatesTransformed:false},blockAreas:[{id:'lake',type:'lake',blocksBasePlacement:true,boundsInclusive:{minX:810,maxX:813,minY:730,maxY:733},cells:[[810,730],[811,730],[813,733]]},{id:'city',type:'city',blocksBasePlacement:true,boundsInclusive:{minX:820,maxX:826,minY:730,maxY:736},objects:[{level:3}],cells:Array.from({length:49},(_,i)=>[820+i%7,730+Math.floor(i/7)])}],mudAreas:[{id:'mud',blocksBasePlacement:false,alwaysPvp:true,boundsInclusive:{minX:818,maxX:828,minY:728,maxY:738}}]};
const data=D.parse(raw);let s=M.makeLayout('empty');s=D.apply(s,data);
const base=(x,y)=>{const o=M.makeObject(s,'base');return {...o,...M.positionFromCoords(s,x-1,y-1,o)};};
assert.equal(D.status(s,base(810,730)).blocked,true,'base edge includes exact lake tile');
assert.equal(D.status(s,base(812,731)).blocked,true,'a corner alone blocks the whole base');
assert.equal(D.status(s,base(811,733)).blocked,false,'empty cells inside terrain bounds remain free');
assert.throws(()=>M.addObject(s,base(823,733)),/importierten/);
assert.deepEqual(D.status(s,base(818,728)),{blocked:false,mud:true},'mud alone is buildable');
assert.doesNotThrow(()=>M.addObject(s,base(818,728)));
assert.equal(D.eligible({...s,mapOptions:{avoidMud:true}},base(818,728)),false);
assert.equal(D.status({...s,mapOptions:{terrain:false,buildings:false,mud:false}},base(823,733)).blocked,true,'visibility is independent');
assert.deepEqual(D.apply(s,data).worldMap,s.worldMap,'repeat import replaces without duplicates');
assert.throws(()=>D.apply({...s,season:'3'},data),/Season/);
assert.throws(()=>D.parse({...raw,schemaVersion:'other'}));
assert.throws(()=>D.parse({...raw,map:{...raw.map,coordinatesTransformed:true}}));
assert.throws(()=>D.validate({...data,mud:[{id:'bad',bounds:{minX:0,maxX:1000,minY:0,maxY:0}}]}));
assert.throws(()=>D.validate({...data,areas:[...data.areas,data.areas[0]]}));
// Import can create conflicts; saving must retain them so users can resolve them.
let conflict=M.makeLayout('empty');conflict=M.addObject(conflict,base(823,733));conflict=D.apply(conflict,data);conflict.mapStyle='game';conflict.mapOptions={avoidMud:true,mud:false};
const workspace=W.createWorkspace(conflict),restored=W.activePlan(W.readFile(JSON.parse(JSON.stringify(W.saveFile(workspace)))));
assert.equal(restored.mapStyle,'game');assert.equal(restored.mapOptions.avoidMud,true);assert.deepEqual(restored.worldMap,data);assert.equal(D.status(restored,restored.objects[0]).blocked,true);
const shifted=M.moveObject(restored,restored.objects[0].id,0,0);assert.equal(D.status(shifted,shifted.objects[0]).blocked,false);
const corner=M.worldBounds(s),area={left:corner.left+805,right:corner.left+832,bottom:corner.bottom+725,top:corner.bottom+742};
for(const p of M.planBaseFill(s,area,0).positions)assert.equal(D.status(s,{...p,type:'base',w:3,h:3}).blocked,false);
for(const p of M.planBaseFill({...s,mapOptions:{avoidMud:true}},area,0).positions)assert.deepEqual(D.status(s,{...p,type:'base',w:3,h:3}),{blocked:false,mud:false});
const audit=HiveQoL.audit(s,area);for(const p of audit.landings)assert.equal(D.status(s,{...p,type:'base'}).blocked,false);
// S04 sample from the extracted source, when present in the development workspace.
if(fs.existsSync('../outputs/S04-map-planner.json')){const full=D.parse(JSON.parse(fs.readFileSync('../outputs/S04-map-planner.json'))),i=D.index(full);assert.equal(full.areas.length,282);assert.equal(full.mud.length,187);assert.equal(i.blocked.reduce((a,b)=>a+b,0),25597);assert.equal(i.mud.reduce((a,b)=>a+b,0),48298);assert.equal(i.blocked[734000+816],1);assert.equal(i.blocked[733000+809],0);assert.equal(i.mud[733000+809],1);assert.equal(i.mud[733000+805],0);assert.equal(D.parse(JSON.parse(fs.readFileSync('../outputs/S04-base-blockers.json'))).areas.length,88);}
console.log('Passed: exact terrain holes, full base footprints, mud overlap, hidden blockers, season and malformed input, repeat imports, conflict persistence, filling and free-space scan.');
