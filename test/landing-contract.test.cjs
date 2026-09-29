const assert=require('node:assert/strict'),fs=require('node:fs');
require('../dist/world-map.js');require('../dist/model.js');
const M=HiveModel,Q=HiveQoL,D=HiveWorldMap,area={left:-1.5,right:1.5,bottom:-1.5,top:1.5};
const check=s=>Q.audit(s,area).totalLandings;
for(const gap of [0,1,2])for(const mudEdge of [false,true]){
 let s={...M.makeLayout('empty'),mapOptions:{mudEdge,avoidMud:true},worldMap:{schema:'nova-static-map',version:1,season:'4',areas:[],mud:[{id:'all-mud',bounds:{minX:480,maxX:520,minY:480,maxY:520}}]}};
 for(const [x,y] of [[-3,0],[3,0],[0,-3],[0,3],[-3,-3],[3,3]])s=M.addObject(s,{...M.makeObject(s,'base',x,y),spacing:gap});
 assert.equal(check(s),1,'all nine cells may be in mud and touch six bases regardless of fill spacing');
 const overlap={...s,objects:[...s.objects,{...M.makeObject(s,'base',2,0),spacing:gap}]};assert.equal(check(overlap),0,'one overlapping column blocks the landing');
}
for(const type of ['terrain','city','stronghold','center','marshall']){
 let s=M.makeLayout('empty'),o=M.makeObject(s,type,0,0);const solid=M.solidFootprint(o);
 o={...o,x:o.x-solid.x+solid.w/2+1.5};s=M.addObject(s,o);assert.equal(check(s),1,type+': contact with the solid edge is legal');
 assert.equal(check({...s,objects:[{...o,x:o.x-1}]}),0,type+': overlap with the solid core is illegal');
}
// User example: X865/Y713 is the base centre, not a corner.
if(fs.existsSync('../outputs/S04-map-planner.json')){
 let s=D.apply(M.makeLayout('empty'),D.parse(JSON.parse(fs.readFileSync('../outputs/S04-map-planner.json'))));
 const x=s.origin.mapX+865-s.origin.x,y=s.origin.mapY+713-s.origin.y,box={left:x-1.5,right:x+1.5,bottom:y-1.5,top:y+1.5};
 assert.equal(Q.audit(s,box).totalLandings,1,'X865/Y713 has nine unblocked static map cells');
 assert.equal(Q.audit(s,{left:x-2.5,right:x+.5,bottom:y-1.5,top:y+1.5}).totalLandings,1,'X864/Y713 can touch the mountain edge without a gap');
 let neighbours=0;for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3]]){const o={...M.makeObject(s,'base',x+dx,y+dy),spacing:2};if(!D.status(s,o).blocked){s=M.addObject(s,o);neighbours++;}}assert.ok(neighbours>0);
 assert.equal(Q.audit(s,box).totalLandings,1,'X865/Y713 remains legal with touching bases and spacing=2');
 const larger=Q.audit(s,{left:x-30.5,right:x+30.5,bottom:y-30.5,top:y+30.5});
 assert.ok(larger.landingMask[712*1000+864],'large scan retains the exact same landing');
}
console.log('Passed: nine-cell landing contract, full mud, touching edges/corners, ignored fill options, solid cores, overlap rejection and X865/Y713.');
