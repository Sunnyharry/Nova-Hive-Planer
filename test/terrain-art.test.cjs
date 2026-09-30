const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const f of ['i18n','world-map','map-assets','map-visuals','model'])vm.runInThisContext(fs.readFileSync('dist/'+f+'.js','utf8'));
const M=HiveModel,D=HiveWorldMap,fixture=JSON.parse(fs.readFileSync('test/fixtures/s04-terrain-art.json','utf8'));
const areas=fixture.map(a=>{const rows=new Map();for(const [x,y]of a.cells){if(!rows.has(y))rows.set(y,[]);rows.get(y).push(x);}const runs=[];for(const [y,xs]of rows){let l=xs[0],r=l;for(const x of xs.slice(1)){if(x!==r+1){runs.push([y,l,r]);l=x;}r=x;}runs.push([y,l,r]);}return {id:a.id,type:a.type,bounds:a.bounds,level:1,runs};});
let s=M.makeLayout('empty');s={...s,mapStyle:'game',origin:{x:0,y:0,mapX:0,mapY:0},worldMap:D.validate({schema:'nova-static-map',version:1,season:'4',areas,mud:[]})};
const before=JSON.stringify(s),svg=D.render(s);
assert.equal(fixture.filter(a=>a.type==='mountain').length,45);assert.equal(fixture.filter(a=>a.type==='sushi_restaurant').length,10);
let instances=0;
for(const a of fixture){
 if(a.type==='sushi_restaurant')continue;
 const v=HiveMapVisuals[a.id];assert(v,a.id);let hash=2166136261;for(const [x,y]of a.cells)hash=Math.imul(hash^(y*1000+x),16777619)>>>0;assert.equal(v.signature,hash,a.id);
 assert(svg.includes(`data-map-art="${a.id}"`),a.id+' is rendered with artwork');assert.equal(v.instances.length,a.expected.length);
 for(let i=0;i<v.instances.length;i++){
  instances++;const o=v.instances[i],expected=a.expected[i];for(const key of ['cx','cy','angle','scale','asset'])assert.equal(o[key],expected[key],a.id+' '+key);
  assert(HiveMapAssets[o.asset],a.id+' image exists');const rad=o.angle*Math.PI/180,points=[[o.x,o.y],[o.x+o.w,o.y],[o.x,o.y+o.h],[o.x+o.w,o.y+o.h]].map(([x,y])=>({x:o.cx+o.scale*(x*Math.cos(rad)-y*Math.sin(rad)),y:o.cy-o.scale*(x*Math.sin(rad)+y*Math.cos(rad))}));
  const b=a.bounds;assert(Math.max(...points.map(p=>p.x))>b.minX-.5&&Math.min(...points.map(p=>p.x))<b.maxX+.5&&Math.max(...points.map(p=>p.y))>b.minY-.5&&Math.min(...points.map(p=>p.y))<b.maxY+.5,a.id+' image must overlap its clip mask');
 }
}
assert.equal(instances,75);
const regression=HiveMapVisuals['s04-area-076'].instances[0];assert.equal(regression.cx,841.573486328125);assert.equal(regression.cy,662.1199951171875);assert.equal(regression.angle,161.3351593017578);
assert.equal((svg.match(/href="#asset-sushi-restaurant-webp"/g)||[]).length,10);
assert.match(HiveMapAssets['sushi-restaurant.webp'],/^data:image\/webp;base64,/);
assert.equal(JSON.stringify(s),before,'rendering never changes imported geometry');
const plan=D.render({...s,mapStyle:'plan'});assert(!plan.includes('href="#asset-sushi-restaurant-webp"'));assert(!plan.includes('data-map-art='));assert(plan.includes('Sushi-Restaurants'));
console.log('Passed: all 75 original scene placements, 45 visible mountain areas, X835–851/Y653–670 regression, 10 Sushi graphics, unchanged masks and plan view.');
