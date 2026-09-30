const {chromium}=require(process.env.NOVA_PLAYWRIGHT||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.NOVA_CHROME});
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),errors=[];let record;
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 await context.route('https://**',r=>r.abort());
 await context.exposeBinding('__rechargeQA',(_,url)=>String(url).includes('/api/view/')?record:{plans:[]});
 await context.addInitScript(()=>{window.fetch=async(url)=>new Response(JSON.stringify(await window.__rechargeQA(String(url))),{status:200,headers:{'Content-Type':'application/json'}});});
 const p=await context.newPage();const range=p.locator('[data-recharge-range]');
 for(const file of ['dist/index.html','nova-hive-planner.html']){
  await p.goto('file:///'+path.resolve(file).replace(/\\/g,'/'));
  await p.waitForFunction(()=>globalThis.HiveArchiveBridge);
  await p.evaluate(()=>{const M=HiveModel;let s=M.makeLayout('empty',{title:'Allianzzentrum 2.0.1'});s=M.addObject(s,M.makeObject(s,'center',0,0));s=M.addObject(s,M.makeObject(s,'base',6,0));s.mapStyle='game';s.showLight=false;HiveArchiveBridge.load(HiveWorkspace.saveFile(HiveWorkspace.createWorkspace(s)));});
  assert.equal(await p.locator('[data-center-art]').count(),1);assert.equal(await range.count(),0);
  await p.locator('.object-center').click();await p.locator('#inspector-tab-properties').click();
  assert(await p.locator('#center-recharge').isVisible());await p.locator('#center-recharge').check();
  assert.equal(await range.count(),1);assert.equal(await range.locator('rect').getAttribute('width'),'41');assert.equal(await range.locator('rect').getAttribute('height'),'41');
  await p.locator('#undo').click();assert.equal(await range.count(),0);
  await p.locator('#redo').click();assert.equal(await range.count(),1);
  const fileData=await p.evaluate(()=>HiveWorkspace.saveFile(HiveArchiveBridge.getWorkspace()));
  await p.reload();await p.waitForFunction(()=>globalThis.HiveArchiveBridge);
  await p.evaluate(data=>HiveArchiveBridge.load(data),fileData);assert.equal(await range.count(),1);
  // Repositioning the center moves the range, while the footprint stays 9×9.
  await p.evaluate(()=>{const W=HiveWorkspace,M=HiveModel,s=W.activePlan(HiveArchiveBridge.getWorkspace()),c=s.objects.find(o=>o.type==='center');HiveArchiveBridge.load(W.saveFile(W.updateWorkspace(HiveArchiveBridge.getWorkspace(),M.moveObject(s,c.id,0,15))));});
  const actual=await range.locator('rect').getAttribute('y');assert.equal(actual,'-35.5');
  record=await p.evaluate(()=>({name:'Recharge viewer',updatedAt:new Date().toISOString(),plan:HiveWorkspace.activePlan(HiveArchiveBridge.getWorkspace())}));
 }
 const viewer=await context.newPage();await viewer.goto('file:///'+path.resolve('viewer/index.html').replace(/\\/g,'/')+'?plan=recharge-qa');
 await viewer.waitForFunction(()=>!document.getElementById('map-style').disabled);
 assert.equal(await viewer.locator('[data-center-art]').count(),1);assert.equal(await viewer.locator('[data-recharge-range] rect').getAttribute('width'),'41');
 await viewer.locator('#map-style').selectOption('plan');assert.equal(await viewer.locator('[data-center-art]').count(),0);assert.equal(await viewer.locator('[data-recharge-range]').count(),1);
 await viewer.locator('#map-style').selectOption('game');assert.equal(await viewer.locator('[data-center-art]').count(),1);
 const out=process.env.NOVA_QA_OUTPUT;if(out){fs.mkdirSync(out,{recursive:true});await p.locator('.object-center').click();await p.locator('#inspector-tab-properties').click();await p.screenshot({path:path.join(out,'alliance-center-editor.png')});await viewer.screenshot({path:path.join(out,'alliance-center-viewer.png')});}
 assert.deepEqual(errors,[]);await browser.close();console.log('Passed: editor + standalone artwork, recharge toggle, undo/redo, reload, movement and viewer appearance with preserved range.');
})().catch(e=>{console.error(e);process.exit(1);});
