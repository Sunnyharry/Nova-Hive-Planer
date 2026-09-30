const {chromium}=require(process.env.NOVA_PLAYWRIGHT||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const fixture=JSON.parse(fs.readFileSync('test/fixtures/s04-terrain-art.json','utf8'));
 const raw={schemaVersion:'2.0',map:{game:'Last War: Survival',season:'S04',width:1000,height:1000,coordinateSystem:'source_grid_coordinates',coordinatesTransformed:false},blockAreas:fixture.map(a=>({id:a.id,type:a.type,blocksBasePlacement:true,boundsInclusive:a.bounds,cells:a.cells})),mudAreas:[]};
 const browser=await chromium.launch({headless:true,executablePath:process.env.NOVA_CHROME}),context=await browser.newContext({viewport:{width:1440,height:1000}}),errors=[];let record;
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));await context.route('https://**',r=>r.abort());
 await context.exposeBinding('__terrainQA',(_,url)=>String(url).includes('/api/view/')?record:{plans:[]});
 await context.addInitScript(()=>{window.fetch=async(url)=>new Response(JSON.stringify(await window.__terrainQA(String(url))),{status:200,headers:{'Content-Type':'application/json'}});});
 const p=await context.newPage(),out=process.env.NOVA_QA_OUTPUT;if(out)fs.mkdirSync(out,{recursive:true});
 const load=async(x,y)=>p.evaluate(({raw,x,y})=>{let s=HiveModel.makeLayout('empty',{title:'S04-Grafiken 2.0.2'});s.origin={x:0,y:0,mapX:0,mapY:0};s=HiveModel.addObject(s,HiveModel.makeObject(s,'note',x,y));s=HiveWorldMap.apply(s,HiveWorldMap.parse(raw));s.mapStyle='game';s.mapOptions={labels:true,grid:false};HiveArchiveBridge.load(HiveWorkspace.saveFile(HiveWorkspace.createWorkspace(s)));},{raw,x,y});
 for(const file of ['dist/index.html','nova-hive-planner.html']){
  await p.goto('file:///'+path.resolve(file).replace(/\\/g,'/'));await p.waitForFunction(()=>globalThis.HiveArchiveBridge);await load(843,662);
  assert.equal(await p.locator('[data-map-art]').count(),60);
  assert.equal(await p.locator('use[href="#asset-sushi-restaurant-webp"]').count(),10);
  assert.equal(await p.locator('[data-map-art="s04-area-076"]>g').getAttribute('transform'),'translate(841.573486328125 -662.1199951171875) rotate(161.3351593017578) scale(1)');
  const before=await p.evaluate(()=>JSON.stringify(HiveWorkspace.activePlan(HiveArchiveBridge.getWorkspace()).worldMap));
  await p.locator('#map-style').selectOption('plan');assert.equal(await p.locator('[data-map-art]').count(),0);
  await p.locator('#map-style').selectOption('game');assert.equal(await p.locator('[data-map-art]').count(),60);
  assert.equal(await p.evaluate(()=>JSON.stringify(HiveWorkspace.activePlan(HiveArchiveBridge.getWorkspace()).worldMap)),before);
  if(out&&file==='dist/index.html'){
   await p.screenshot({path:path.join(out,'editor-berg-843-662.png')});
   const download=p.waitForEvent('download');await p.locator('[data-export="svg"]').evaluate(e=>e.click());const d=await download;await d.saveAs(path.join(out,'berg-export.svg'));
   const exported=fs.readFileSync(path.join(out,'berg-export.svg'),'utf8');assert(exported.includes('translate(841.573486328125 -662.1199951171875)'));assert.equal((exported.match(/href="#asset-sushi-restaurant-webp"/g)||[]).length,10);
   await load(209,250);await p.screenshot({path:path.join(out,'editor-sushi.png')});
  }
  await load(843,662);record=await p.evaluate(()=>({name:'S04 art viewer',updatedAt:new Date().toISOString(),plan:HiveWorkspace.activePlan(HiveArchiveBridge.getWorkspace())}));
 }
 const v=await context.newPage();await v.goto('file:///'+path.resolve('viewer/index.html').replace(/\\/g,'/')+'?plan=terrain-qa');await v.waitForFunction(()=>!document.getElementById('map-style').disabled);
 assert.equal(await v.locator('[data-map-art]').count(),60);assert.equal(await v.locator('use[href="#asset-sushi-restaurant-webp"]').count(),10);
 if(out)await v.screenshot({path:path.join(out,'viewer-berg-843-662.png')});
 assert.deepEqual(errors,[]);await browser.close();console.log('Passed: original map masks, repaired user coordinate, all mountain/lake/Sushi artwork in editor, standalone, viewer and SVG export.');
})().catch(e=>{console.error(e);process.exit(1);});
