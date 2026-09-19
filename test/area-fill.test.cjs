const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
vm.runInThisContext(fs.readFileSync('dist/model.js','utf8'));
const M=globalThis.HiveModel;
const box={left:-26.5,right:26.5,bottom:-26.5,top:26.5};
let state=M.makeLayout('empty');state=M.addObject(state,M.makeObject(state,'center',0,0));
const center=state.objects[0],distance=p=>p.x*p.x+p.y*p.y,key=p=>p.x+','+p.y;
for(const offset of [-1e12,1e12])assert.deepEqual(M.planBaseFill(state,{left:offset,right:offset+20,bottom:offset,top:offset+20},1).positions,[]);
for(const gap of [0,1,2]){
 const preview=M.planBaseFill(state,box,gap),filled=M.fillBases(state,box,gap);
 assert.deepEqual(filled.state.objects.slice(1).map(({x,y})=>({x,y})),preview.positions);
 assert.equal(filled.added,preview.positions.length);assert.equal(preview.limited,false);
 for(let i=0;i<preview.positions.length;i++){
  const p=preview.positions[i],base={...p,w:3,h:3};M.assertWorldPlacement(state,base);
  assert.equal(M.overlaps(base,center),false);
  if(i)assert.ok(distance(preview.positions[i-1])<=distance(p),'inside-out order');
  for(const q of preview.positions.slice(0,i))assert.equal(M.overlaps(base,{...q,w:3+2*gap,h:3+2*gap}),false,'requested minimum base spacing');
 }
 // The first row must exist on all four faces, with at most one empty tile.
 for(const axis of ['x','y'])for(const sign of [-1,1]){
  const other=axis==='x'?'y':'x',row=preview.positions.filter(p=>sign*p[axis]>=6&&Math.abs(p[other])<6);
  assert.ok(row.length);assert.ok(Math.min(...row.map(p=>sign*p[axis]-6))<=1);
 }
 // Resizing or drawing from another corner must not change grid alignment.
 const smaller={left:-18.5,right:14.5,bottom:-10.5,top:22.5};
 const inside=p=>p.x-1.5>=smaller.left&&p.x+1.5<=smaller.right&&p.y-1.5>=smaller.bottom&&p.y+1.5<=smaller.top;
 assert.deepEqual(M.planBaseFill(state,smaller,gap).positions,preview.positions.filter(inside));
 assert.deepEqual(M.planBaseFill(state,{left:box.right,right:box.left,bottom:box.top,top:box.bottom},gap),preview);
 // Grid follows a moved center, not world zero or the selection's lower-left corner.
 const moved=M.moveObject(state,center.id,13,-17),translated={left:box.left+13,right:box.right+13,bottom:box.bottom-17,top:box.top-17};
 assert.deepEqual(M.planBaseFill(moved,translated,gap).positions,preview.positions.map(p=>({x:p.x+13,y:p.y-17})));
 // Obstacles leave other positions unchanged, and an off-center box creates only its own seats.
 const terrain={...M.makeObject(state,'terrain',14,0),x:14,y:0,w:5,h:9},blocked=M.addObject(state,terrain);
 const expected=preview.positions.filter(p=>!M.overlaps({...p,w:3,h:3},terrain));
 assert.deepEqual(M.planBaseFill(blocked,box,gap).positions,expected);
 assert.deepEqual(M.planBaseFill(state,{left:10.5,right:box.right,bottom:box.bottom,top:box.top},gap).positions,preview.positions.filter(p=>p.x-1.5>=10.5));
 // At the object limit, keep the closest candidates, not a corner of the world.
 const full=M.planBaseFill(state,M.worldBounds(state),gap);assert.equal(full.positions.length,799);assert.equal(full.limited,true);
 const oracle=[],onAxis=n=>gap===0?n%3===0:gap===1?Math.abs(n)%4===2:n===0||Math.abs(n)>=6&&(Math.abs(n)-6)%5===0;
 for(let x=-100;x<=100;x++)for(let y=-100;y<=100;y++)if(onAxis(x)&&onAxis(y)&&!M.overlaps({x,y,w:3,h:3},center))oracle.push({x:x||0,y:y||0});
 oracle.sort((a,b)=>distance(a)-distance(b)||b.y-a.y||a.x-b.x);
 assert.deepEqual(full.positions,oracle.slice(0,799));
 const included=new Set(full.positions.map(key));assert.ok(preview.positions.every(p=>included.has(key(p))));
 assert.ok(full.positions.every((p,i)=>!i||distance(full.positions[i-1])<=distance(p)));
 assert.ok(Math.max(...full.positions.map(p=>Math.abs(p.x)))<100);
 // Exact capacity must not claim truncation when no extra valid seat exists.
 const lone=preview.positions[0],only={left:lone.x-1.5,right:lone.x+1.5,bottom:lone.y-1.5,top:lone.y+1.5};
 const crowded={...state,objects:[...state.objects,...Array.from({length:798},(_,i)=>({id:'obstacle_'+i,type:'terrain',x:300,y:300,w:1,h:1}))]};
 const exact=M.planBaseFill(crowded,only,gap);assert.equal(exact.positions.length,1);assert.equal(exact.limited,false);
 assert.deepEqual(M.validate(JSON.parse(JSON.stringify(filled.state))),filled.state);
}
// Marshall and no-center fallback also retain their grid when the box changes.
for(const season of ['off','4']){
 let s=M.makeLayout('empty',{...state,season,origin:{x:500,y:500,mapX:11,mapY:7}});
 if(season==='off')s=M.addObject(s,M.makeObject(s,'marshall',11,7));
 const all=M.planBaseFill(s,box,2).positions,part={left:-18.5,right:18.5,bottom:-18.5,top:18.5};
 assert.deepEqual(M.planBaseFill(s,part,2).positions,all.filter(p=>p.x-1.5>=part.left&&p.x+1.5<=part.right&&p.y-1.5>=part.bottom&&p.y+1.5<=part.top));
}
// Centers at both world corners produce only whole, in-world bases.
for(const value of [0,991]){
 const edge=M.setObjectCorner(state,center.id,value,value);
 const filled=M.fillBases(edge,M.worldBounds(edge),1);
 for(const o of filled.state.objects)M.assertWorldPlacement(filled.state,o);
}
console.log('Passed: center clearance, all base gaps, stable anchored grids, moved reference, inside-out order and cap, obstacles, exact preview, finite world and persistence.');
