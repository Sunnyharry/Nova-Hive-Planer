const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const n of ['world-map','model','workspace'])vm.runInThisContext(fs.readFileSync('dist/'+n+'.js','utf8'));
const M=HiveModel,Q=HiveQoL,WM=HiveWorldMap,box={left:-26.5,right:26.5,bottom:-26.5,top:26.5};
let state=M.makeLayout('empty');state=M.addObject(state,M.makeObject(state,'center',0,0));
const center=state.objects[0];
function checkSpacing(s,area,gap){const before=M.clone(s),p=M.planBaseFill(s,area,gap),r=M.fillBases(s,area,gap);assert.deepEqual(s,before);assert.deepEqual(r.state.objects.slice(s.objects.length).map(({x,y})=>({x,y})),p.positions);const added=[];
 for(const point of p.positions){const o={...point,w:3,h:3,type:'base'};M.assertWorldPlacement(s,o);const b=M.rect(o);assert.ok(b.left>=area.left&&b.right<=area.right&&b.bottom>=area.bottom&&b.top<=area.top);
  for(const obstacle of [...s.objects,...added]){if(['note','missile'].includes(obstacle.type))continue;const core=M.solidFootprint(obstacle);assert.ok(!M.overlaps(o,{...core,w:core.w+2*gap,h:core.h+2*gap}),'exact clearance to every solid footprint');}
  assert.ok(M.baseSeatEligible(s,o));added.push(o);
 }assert.deepEqual(M.validate(r.state),r.state);return p;}
for(const gap of [0,1,2]){
 const p=checkSpacing(state,box,gap);assert.ok(p.positions.length>0);assert.equal(p.limited,false);
 // All four faces get a boundary-aligned row at the chosen gap (including gap 2).
 for(const axis of ['x','y'])for(const sign of [-1,1])assert.ok(p.positions.some(o=>o[axis]===sign*(6+gap)&&Math.abs(o[axis==='x'?'y':'x'])<6));
 assert.deepEqual(M.planBaseFill(state,{left:box.right,right:box.left,bottom:box.top,top:box.bottom},gap),p);
 const moved=M.moveObject(state,center.id,13,-17),shifted={left:box.left+13,right:box.right+13,bottom:box.bottom-17,top:box.top-17};assert.deepEqual(M.planBaseFill(moved,shifted,gap).positions,p.positions.map(o=>({x:o.x+13,y:o.y-17})));
 const full=M.planBaseFill(state,M.worldBounds(state),gap);assert.equal(full.positions.length,799);assert.equal(full.limited,true);
 for(const offset of [-1e12,1e12])assert.deepEqual(M.planBaseFill(state,{left:offset,right:offset+20,bottom:offset,top:offset+20},gap).positions,[]);
 // Subsequent passes leave existing objects untouched and still honor every gap.
 const first=M.fillBases(state,{...box,right:0},gap).state;checkSpacing(first,box,gap);
 const terrain={...M.makeObject(state,'terrain',14,0),x:14,y:0,w:5,h:9};checkSpacing(M.addObject(state,terrain),box,gap);
 const decorated=M.addObject(M.addObject(state,M.makeObject(state,'note',20,20)),M.makeObject(state,'missile',20,20));assert.deepEqual(M.planBaseFill(decorated,box,gap).positions,p.positions);
 const lone=p.positions[0],only={left:lone.x-1.5,right:lone.x+1.5,bottom:lone.y-1.5,top:lone.y+1.5},crowded={...state,objects:[...state.objects,...Array.from({length:798},(_,i)=>({id:'obstacle_'+i,type:'terrain',x:300,y:300,w:1,h:1}))]};assert.equal(M.planBaseFill(crowded,only,gap).positions.length,1);assert.equal(M.planBaseFill(crowded,only,gap).limited,false);
}
// Imported terrain clearance and irregular holes use complete cells, never bounding boxes alone.
const worldMap={schema:'nova-static-map',version:1,season:'4',areas:[{id:'lake',type:'lake',level:1,bounds:{minX:510,maxX:520,minY:490,maxY:510},runs:Array.from({length:21},(_,i)=>[490+i,510,520])}],mud:[]};
for(const gap of [0,1,2]){const s={...state,worldMap},p=checkSpacing(s,box,gap);for(const o of p.positions)assert.ok(!M.overlaps({...o,w:3,h:3},{x:15,y:0,w:11+gap*2,h:21+gap*2}));assert.ok(p.positions.some(o=>o.x===8-gap));}
// Union of separate mud rectangles: straight outer strip only, no L or opposite edges.
function mud(cells){return {schema:'nova-static-map',version:1,season:'4',areas:[],mud:cells.map(([x,y],i)=>({id:'m'+i,bounds:{minX:x,maxX:x,minY:y,maxY:y}}))};}
for(const [cells,safe] of [[[[499,499],[500,499],[501,499]],true],[[[499,499]],true],[[[499,499],[500,499],[499,500]],false],[[[499,500],[501,500]],false],[[[500,500]],false]]){
 const s={...M.makeLayout('empty'),worldMap:mud(cells),mapOptions:{mudEdge:true}},o={x:0,y:0,w:3,h:3,type:'base'};assert.equal(M.mudContact(s,o).edge,safe);assert.equal(M.baseSeatEligible(s,o),safe);assert.equal(M.baseSeatEligible({...s,mapOptions:{mudEdge:false}},o),false);
 assert.equal(Q.audit(s,{left:-1.5,right:1.5,bottom:-1.5,top:1.5}).totalLandings,1,'mud remains geometrically buildable for enemy landing audit');
}
for(const type of ['city','stronghold'])for(const gap of [0,1,2])for(const edge of [false,true]){
 let s=M.makeLayout('empty');const land=M.makeObject(s,type,0,0);s={...M.addObject(s,land),mapOptions:{mudEdge:edge}};const p=checkSpacing(s,box,gap);assert.ok(p.positions.length);if(edge)assert.ok(p.positions.some(o=>M.mudContact(s,{...o,w:3,h:3}).fullEdge));
 for(const o of p.positions){const contact=M.mudContact(s,{...o,w:3,h:3});if(!edge)assert.ok(!M.overlaps({...o,w:3,h:3},{...land,w:land.w+2*gap,h:land.h+2*gap}));else if(contact.count)assert.ok(contact.edge);}
}
// A large exterior cannot consume the display budget and hide a cavity inside the hive.
let hive=M.makeLayout('empty');for(const [x,y] of [[-4,0],[4,0],[0,-4],[0,4]])hive=M.addObject(hive,M.makeObject(hive,'base',x,y));const a=Q.audit(hive,{left:-200.5,right:200.5,bottom:-200.5,top:200.5}),g=M.geometry(hive),anchor=(499*1000+499);assert.ok(a.totalLandings>200);assert.equal(a.landingMask[anchor],2);assert.ok(a.rows.some(r=>r.kind===2&&r.y===499&&r.left<=499&&r.right>=499));assert.equal(a.totalLandings,a.nearCount+a.farCount);
let count=0;for(let y=485;y<=515;y++)for(let x=485;x<=515;x++){const o={x:x-499,y:y-499,w:3,h:3};const legal=!hive.objects.some(q=>M.overlaps(o,q));assert.equal(!!a.landingMask[y*1000+x],legal);if(legal)count++;}assert.ok(count);
const all=Q.audit(M.makeLayout('empty'),M.worldBounds(M.makeLayout('empty')));assert.equal(all.totalLandings,998*998);assert.equal(all.landingMask.reduce((n,v)=>n+!!v,0),998*998);
console.log('Passed: hard/imported obstacle gaps 0/1/2, exact boundary rows, repeated passes, preview parity, mud union/strips/corners, manual city mud, decorations, world limits, full audit mask and retained inner cavity.');
