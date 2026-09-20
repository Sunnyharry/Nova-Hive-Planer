(function(){
'use strict';
const M=globalThis.HiveModel,I=globalThis.HiveI18n,$=id=>document.getElementById(id),svg=$('map'),stage=$('stage'),t=(k,p)=>I.t(k,p),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let plan=null,record=null,chosen=null,cam={x:0,y:0,scale:12},pointers=new Map(),gesture=null,loading=false,missileDrag=null;
const text=(x,y,s,size=.55,color='#e6f2fa',weight=500)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${size}" font-weight="${weight}">${esc(s)}</text>`;
function label(o,name,width,y=0,size=.65){const chars=[...name],chunk=Math.max(5,Math.floor(width/(size*.55))),lines=[];for(let i=0;i<chars.length;i+=chunk)lines.push(chars.slice(i,i+chunk).join(''));const rows=lines.slice(0,3);if(lines.length>3)rows[2]=rows[2].slice(0,-1)+'…';return rows.map((s,i)=>text(o.x,-o.y+y+(i-(rows.length-1)/2)*size*1.12,s,size)).join('');}
function terrainInk(o){if(!o.color)return '#f0c4c4';const c=[1,3,5].map(i=>parseInt(o.color.slice(i,i+2),16));return c[0]*.299+c[1]*.587+c[2]*.114>145?'#14232c':'#fff';}
function render(){if(!plan)return;let s='<defs><pattern id="grid" x="-.5" y="-.5" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#263e50" stroke-width=".03"/></pattern></defs>';const world=M.worldBounds(plan);s+=`<rect x="${world.left}" y="${-world.top}" width="1000" height="1000" fill="url(#grid)"/>`;
 for(const o of plan.objects)if(M.coreSize(o))s+=`<rect x="${o.x-o.w/2}" y="${-o.y-o.h/2}" width="${o.w}" height="${o.h}" fill="#765638" fill-opacity=".5" stroke="#ad865f" stroke-width=".06"/>`;
 if(plan.showLight)for(const o of plan.objects)if(o.beacon){const c=M.ALLIANCE_COLORS[M.allianceOf(o)-1];const r=M.rect({x:o.x,y:o.y,w:o.lightSize,h:o.lightSize}),left=Math.max(r.left,world.left),top=Math.min(r.top,world.top),right=Math.min(r.right,world.right),bottom=Math.max(r.bottom,world.bottom);s+=`<rect x="${left}" y="${-top}" width="${right-left}" height="${top-bottom}" fill="${c}" fill-opacity=".04" stroke="${c}" stroke-width=".08"/>`;}
 const seen=new Set();for(const o of [...plan.objects.filter(o=>o.type!=='missile'),...plan.objects.filter(o=>o.type==='missile')]){const name=M.objectLabel(plan,o),q=M.coords(plan,o),c=M.ALLIANCE_COLORS[M.allianceOf(o)-1];
  if(o.terrainGroup){if(seen.has(o.terrainGroup))continue;seen.add(o.terrainGroup);const parts=M.terrainParts(plan,o),g=M.terrainUnionGeometry(parts),d=g.slices.map(r=>`M${r.left} ${-r.top}H${r.right}V${-r.bottom}H${r.left}Z`).join(' '),edges=g.edges.map(([x,y,x2,y2])=>`M${x} ${-y}L${x2} ${-y2}`).join(' '),p=parts.reduce((a,b)=>a.w*a.h>b.w*b.h?a:b);s+=`<path d="${d}" fill="${o.color??'#645157'}"/><path d="${edges}" fill="none" stroke="#b9a298" stroke-width=".08"/>`+text(p.x,-p.y,name,Math.min(.65,p.w/(name.length*.6)),terrainInk(o));continue;}
  if(o.type==='missile'){const size=Math.min(.65,o.w/12,o.h/4);s+=`<rect x="${o.x-o.w/2}" y="${-o.y-o.h/2}" width="${o.w}" height="${o.h}" fill="#ef4444" fill-opacity=".13" stroke="#ff6565" stroke-width=".18" stroke-dasharray=".65 .3"/>`+text(o.x,-o.y-o.h/2+size*1.3,name+' · '+o.w+' × '+o.h,size,'#ffb6b6')+text(o.x,-o.y-o.h/2+size*2.5,'X '+q.x+' / Y '+q.y,size*.7,'#ffb6b6');s+=`<g class="missile-handle" data-missile="${esc(o.id)}" tabindex="0" role="button" aria-label="${esc(t('Raketenfläche verschieben: ziehen oder Pfeiltasten verwenden.'))} X ${q.x}, Y ${q.y}" transform="translate(${o.x} ${-o.y}) scale(${Math.min(1,o.w/3,o.h/3)})"><title>${esc(t('Warnsymbol ziehen, um die Raketenfläche zu verschieben.'))}</title><circle r="1.35" fill="#481c25" stroke="#ff7777" stroke-width=".09"/><path d="M0-1.05L1.08.87H-1.08Z" fill="#ffd56a"/><path d="M0-.45V.2" stroke="#482b17" stroke-width=".17" stroke-linecap="round"/><circle cy=".53" r=".1" fill="#482b17"/></g>`;continue;}
  const core=M.coreSize(o),f=M.solidFootprint(o),w=f.w,h=f.h,fill=o.type==='terrain'?(o.color??'#645157'):core?'#725039':o.type==='center'?c+'45':o.type==='marshall'?'#51432b':c+'25';
  s+=`<g data-id="${esc(o.id)}"><rect x="${f.x-w/2}" y="${-f.y-h/2}" width="${w}" height="${h}" fill="${fill}" stroke="${o.type==='terrain'?(o.color??'#a8787d'):c}" stroke-width=".07"/>`;
  if(o.type==='terrain')s+=text(o.x,-o.y,name,Math.min(.7,w/Math.max(1,name.length*.6)),terrainInk(o));
  else if(o.type==='base'||o.type==='marshall'){s+=label(o,name,2.65,o.beacon?-.05:-.35,.48);s+=text(o.x,-o.y+.85,'X '+q.x,.36,'#bed1dd')+text(o.x,-o.y+1.27,'Y '+q.y,.36,'#bed1dd');if(o.beacon)s+=text(o.x,-o.y-1.05,o.beacon+' · +'+o.electricians,.36,'#ffda71',700);}
  else{const scale=Math.min(1,w/5,h/5);s+=label(f,name,w-.2,-.7*scale,.7*scale)+text(f.x,-f.y+.6*scale,'X '+q.x+' / Y '+q.y,.46*scale)+text(f.x,-f.y+1.6*scale,w+' × '+h,.45*scale,'#bed1dd');}
  s+='</g>';
 }
 if(chosen){const o=plan.objects.find(o=>o.id===chosen);if(o)s+=`<rect x="${o.x-o.w/2-.3}" y="${-o.y-o.h/2-.3}" width="${o.w+.6}" height="${o.h+.6}" fill="none" stroke="#ffffff" stroke-width=".22"/><path d="M${o.x} ${-o.y-o.h/2-1.7}v1" stroke="#ffdc62" stroke-width=".35"/>`;}
 svg.innerHTML=s;update();updateMissileControls();}
function updateMissileControls(){
 const missiles=plan?.objects.filter(o=>o.type==='missile')??[];$('missile-tools').hidden=!missiles.length;
 $('reset-missiles').disabled=!missiles.some(o=>{const original=record?.plan.objects.find(q=>q.id===o.id);return original&&(o.x!==original.x||o.y!==original.y);});
}
function positionMissile(id,x,y){
 const o=plan?.objects.find(o=>o.id===id&&o.type==='missile');if(!o)return;
 const b=M.worldBounds(plan),candidate={...o,x:Math.max(b.left+o.w/2,Math.min(b.right-o.w/2,M.snap(x,o.w))),y:Math.max(b.bottom+o.h/2,Math.min(b.top-o.h/2,M.snap(y,o.h)))};
 M.assertWorldPlacement(plan,candidate);plan={...plan,objects:plan.objects.map(q=>q.id===id?candidate:q)};render();
}
function cancelMissileDrag(){if(!missileDrag)return;const d=missileDrag;missileDrag=null;positionMissile(d.id,d.original.x,d.original.y);svg.classList.remove('missile-dragging');}
function dragMissile(e){const d=missileDrag;if(!d||d.pointerId!==e.pointerId)return;const p=point(e.clientX,e.clientY);positionMissile(d.id,d.original.x+p.x-d.start.x,d.original.y-p.y+d.start.y);}
function resetMissiles(){cancelMissileDrag();if(!plan||!record)return;plan={...plan,objects:plan.objects.map(o=>o.type==='missile'?{...o,...record.plan.objects.find(q=>q.id===o.id)}:o)};render();}
$('reset-missiles').addEventListener('click',resetMissiles);
function update(){const r=stage.getBoundingClientRect(),w=r.width/cam.scale,h=r.height/cam.scale;svg.setAttribute('viewBox',`${cam.x-w/2} ${cam.y-h/2} ${w} ${h}`);}
function fit(){if(!plan)return;const b=M.bounds(plan),r=stage.getBoundingClientRect();cam.x=(b.left+b.right)/2;cam.y=-(b.bottom+b.top)/2;cam.scale=Math.max(.3,Math.min(r.width/(b.right-b.left+8),r.height/(b.top-b.bottom+8),36));update();}
function point(x,y){const r=stage.getBoundingClientRect();return {x:cam.x+(x-r.left-r.width/2)/cam.scale,y:cam.y+(y-r.top-r.height/2)/cam.scale};}
function zoom(f,x,y){const r=stage.getBoundingClientRect();x??=r.left+r.width/2;y??=r.top+r.height/2;const p=point(x,y);cam.scale=Math.max(.25,Math.min(100,cam.scale*f));const q=point(x,y);cam.x+=p.x-q.x;cam.y+=p.y-q.y;update();}
function focus(id){const o=plan.objects.find(o=>o.id===id);if(!o)return;chosen=id;cam.x=o.x;cam.y=-o.y;cam.scale=Math.max(cam.scale,Math.min(38,stage.clientWidth/10));render();}
function search(){if(!plan)return;const query=$('search').value.trim().normalize('NFC').toLocaleLowerCase(),players=plan.players.filter(p=>p.name.toLocaleLowerCase().includes(query));$('results').replaceChildren();for(const p of players){const o=M.objectForPlayer(plan,p.id);if(!o)continue;const q=M.coords(plan,o),b=document.createElement('button'),name=document.createElement('strong'),meta=document.createElement('small');name.textContent=p.name;meta.textContent=`X ${q.x} / Y ${q.y} · `+t('Allianz {n}',{n:M.allianceOf(o)});b.append(name,meta);b.addEventListener('click',()=>focus(o.id));$('results').append(b);}$('status').textContent=players.length?t('{n} Spieler gefunden.',{n:players.length}):t('Kein Spieler mit diesem Namen.');if(query&&players.length===1)focus(M.objectForPlayer(plan,players[0].id)?.id);}
async function load(){if(loading)return;loading=true;$('refresh').disabled=true;const id=new URLSearchParams(location.search).get('plan');try{if(!id){$('status').textContent=t('Öffne den Viewer-Link aus deiner Allianz.');return;}$('status').textContent=t('Karte wird geladen …');const r=await fetch('https://nova-hive-viewer.georgiadis-c.chatgpt.site/api/view/'+encodeURIComponent(id),{cache:'no-store',signal:AbortSignal.timeout(30000)}),v=await r.json();if(!r.ok)throw Error(t(v.error));const next=M.validate(v.plan);cancelMissileDrag();pointers.clear();gesture=null;record=v;plan=next;chosen=null;$('title').textContent=v.name;document.title=v.name+' · NOVA Hive Viewer';$('updated').textContent=t('Stand: {date}',{date:new Date(v.updatedAt).toLocaleString(I.language)});render();fit();search();}catch(e){$('status').textContent=e.message||t('Karte konnte nicht geladen werden.');}finally{loading=false;$('refresh').disabled=false;}}
$('search').addEventListener('input',search);$('refresh').addEventListener('click',load);$('fit').addEventListener('click',fit);$('plus').addEventListener('click',()=>zoom(1.3));$('minus').addEventListener('click',()=>zoom(1/1.3));
svg.addEventListener('wheel',e=>{e.preventDefault();if(missileDrag)return;zoom(Math.exp(-e.deltaY*.0015),e.clientX,e.clientY);},{passive:false});
function baseline(){const p=[...pointers.values()];gesture=p.length>1?{distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2}:p[0]?{x:p[0].x,y:p[0].y}:null;}
svg.addEventListener('pointerdown',e=>{
 if(e.button&&e.pointerType==='mouse')return;e.preventDefault();
 const handle=e.target.closest('[data-missile]'),o=plan?.objects.find(o=>o.id===handle?.dataset.missile&&o.type==='missile');
 svg.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size>1)cancelMissileDrag();else if(o){handle.focus({preventScroll:true});missileDrag={id:o.id,pointerId:e.pointerId,original:{x:o.x,y:o.y},start:point(e.clientX,e.clientY)};svg.classList.add('missile-dragging');}
 baseline();
});
svg.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId))return;const old=gesture;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});baseline();
 if(missileDrag){dragMissile(e);return;}
 if(old&&gesture){cam.x-=(gesture.x-old.x)/cam.scale;cam.y-=(gesture.y-old.y)/cam.scale;if(gesture.distance&&old.distance)zoom(gesture.distance/Math.max(1,old.distance),gesture.x,gesture.y);else update();}
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(event,e=>{
 if(missileDrag?.pointerId===e.pointerId){if(event==='pointerup'){dragMissile(e);const id=missileDrag.id;missileDrag=null;svg.classList.remove('missile-dragging');svg.querySelector(`[data-missile="${id}"]`)?.focus({preventScroll:true});}else cancelMissileDrag();}
 pointers.delete(e.pointerId);baseline();
});
svg.addEventListener('keydown',e=>{const dirs={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(e.key==='Escape'&&missileDrag){e.preventDefault();cancelMissileDrag();pointers.clear();baseline();return;}if(dirs[e.key]){e.preventDefault();const id=e.target.closest('[data-missile]')?.dataset.missile,o=plan?.objects.find(o=>o.id===id&&o.type==='missile');if(o){const step=e.shiftKey?5:1;positionMissile(id,o.x+dirs[e.key][0]*step,o.y-dirs[e.key][1]*step);svg.querySelector(`[data-missile="${id}"]`)?.focus({preventScroll:true});return;}cam.x+=dirs[e.key][0]*60/cam.scale;cam.y+=dirs[e.key][1]*60/cam.scale;update();}if(['+','=','-'].includes(e.key)){e.preventDefault();zoom(e.key==='-'?1/1.3:1.3);}});
$('lang').value=I.language;$('lang').addEventListener('change',e=>{I.setLanguage(e.target.value);I.apply(document);render();search();if(record)$('updated').textContent=t('Stand: {date}',{date:new Date(record.updatedAt).toLocaleString(I.language)});});new ResizeObserver(update).observe(stage);I.apply(document);load();
})();
