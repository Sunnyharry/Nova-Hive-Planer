(function(){
'use strict';
const T=globalThis.HiveThemes??{svg:s=>s,init(){}},I=globalThis.HiveI18n,t=(key,params)=>I.t(key,params);
const Q=globalThis.HiveQoL;
const M=globalThis.HiveModel,W=globalThis.HiveWorkspace,$=id=>document.getElementById(id),svg=$('map'),stage=$('stage');
// User-facing release: increment the final number for each later delivered update.
const APP_VERSION='1.2.0';
const editorUI={ready:false,left:'players',inspector:'position',inspectorKey:null,selectionKey:null};
const TOOL_SHORTCUTS={b:'base',m:'marshall',a:'center',t:'terrain',l:'beacon'};
const shortcutFor=type=>Object.keys(TOOL_SHORTCUTS).find(key=>TOOL_SHORTCUTS[key]===type)?.toUpperCase();
let workspace=W.createWorkspace(),state=W.activePlan(workspace),selectedId=null,pending=null,filter='all',dirty=false,undoStack=[],redoStack=[],drag=null,suppressClick=false,confirmAction=null,toastTimer=null;
let selectionCenterEntry=null;
let nameAction=null,qolInitialized=false;
let selectionScope='active',selectionFilter='all',clipboardPlan=null,pasteObjects=null,arrangement=null,checkArea=null,checkResult=null,highlightObject=null,recoveryTimer=null,recoveryInitialized=false;
let selectedObjectIds=new Set(),mapMode='pan',fillArea=null,fillPreview=null;
let organizerOpen=false,organizationTab='priority',selectedPlayers=new Set(),lastAutofillResult=null;
const allianceName=id=>t('Allianz {n}',{n:id});
const groupName=id=>t('Gruppe {n}',{n:id});
const seasonName=()=>state.season==='off'?t('Off Season'):t('Season {n}',{n:state.season});
const referenceName=()=>t(M.isSeason4(state)?'Allianzzentrum':'Marshall');
let camera={x:0,y:0,scale:12},fitScale=12,lastPoint={x:0,y:0},ghost=null;
const metrics=document.createElement('canvas').getContext('2d');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const h=(key,params)=>esc(t(key,params));
const num=n=>n==='X'?'X':Number.isInteger(n)?String(n):String(Math.round(n*10)/10);
const color=o=>M.allianceOf(o)!==1?M.ALLIANCE_COLORS[M.allianceOf(o)-1]:M.COLORS[((o.beacon?.charCodeAt(0)??65)-65)%M.COLORS.length];
const typeName=o=>t({base:o?.beacon?'Beacon':'Basis',center:'Zentrum',marshall:'Marshall',terrain:'Terrain',stronghold:'Stronghold',city:'Stadt',missile:'Missile',note:'Notiz'}[o?.type]??'');
const selected=()=>state.objects.find(o=>o.id===selectedId)??null;
const selectedObjects=()=>state.objects.filter(o=>selectedObjectIds.has(o.id));
function selectionMatches(o){return Q.visible(state,o)&&(selectionFilter==='all'||selectionFilter==='bases'&&o.type==='base'||selectionFilter==='terrain'&&o.type==='terrain'||selectionFilter==='buildings'&&['center','marshall','stronghold','city'].includes(o.type)||selectionFilter==='notes'&&o.type==='note');}
function setMapSelection(ids,primary=null){selectedObjectIds=new Set(M.expandObjectIds(state,ids).filter(id=>state.objects.some(o=>o.id===id&&(selectionScope==='all'||M.owns(state,o)))));selectedId=selectedObjectIds.has(primary)?primary:selectedObjectIds.values().next().value??null;}
function selectionSummary(){const objects=selectedObjects(),alliances=new Set(objects.map(M.allianceOf)).size;return !objects.length?'':alliances>1?t('{n} Objekte aus {alliances} Allianzen ausgewählt',{n:objects.length,alliances}):t('{n} Elemente',{n:objects.length});}
function activateSelectionAlliance(){const objects=selectedObjects(),ids=new Set(objects.map(M.allianceOf));if(ids.size===1&&!M.owns(state,objects[0]))commit(M.setAlliance(state,M.allianceOf(objects[0])));}
function resetMapTools(clearSelection=false){pasteObjects=null;arrangement=null;pending=null;ghost=null;drag=null;fillArea=null;fillPreview=null;mapMode='pan';if(clearSelection){selectedObjectIds.clear();selectedId=null;}}
function refreshFillPreview(){try{fillPreview=fillArea?M.planBaseFill(state,fillArea,Number($('fill-gap').value)):null;}catch(error){fillArea=null;fillPreview=null;throw error;}}

function toast(message,error=false){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.toggle('error',error);$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,error?6500:4200);}
function safely(action){try{return action();}catch(error){toast(error.message||t('Die Änderung konnte nicht übernommen werden.'),true);return null;}}
function commit(next,message){
 if(JSON.stringify(next)===JSON.stringify(state))return false;
 return commitWorkspace(W.updateWorkspace(workspace,next),message);
}
function commitWorkspace(next,message){
 if(next===workspace)return false;
 lastAutofillResult=null;undoStack.push(workspace);if(undoStack.length>70)undoStack.shift();redoStack=[];
 workspace=next;state=W.activePlan(workspace);dirty=true;
 setMapSelection([...selectedObjectIds],selectedId);arrangement=null;checkResult=null;scheduleRecovery();refreshFillPreview();render();if(message)toast(message);return true;
}
function restoreHistory(direction){
 lastAutofillResult=null;const source=direction==='undo'?undoStack:redoStack,target=direction==='undo'?redoStack:undoStack;if(!source.length)return;
 const previous=state.season+':'+state.layout;target.push(workspace);workspace=source.pop();state=W.activePlan(workspace);dirty=true;
 resetMapTools(true);scheduleRecovery();$('drag-ghost').hidden=true;clearOrganizationDrop();render();if(previous!==state.season+':'+state.layout)fitMap();
}
function activateAlliance(id){if(id===M.activeAlliance(state))return;resetMapTools(true);selectedPlayers.clear();lastAutofillResult=null;$('drag-ghost').hidden=true;clearOrganizationDrop();commit(M.setAlliance(state,id));}
function activateVariant(season,layout){
 const next=W.switchVariant(workspace,season,layout);if(next===workspace)return;
 resetMapTools(true);$('drag-ghost').hidden=true;clearOrganizationDrop();commitWorkspace(next);fitMap();
}
function confirm(title,message,action){confirmAction=action;$('confirm-title').textContent=title;$('confirm-message').textContent=message;$('confirm-dialog').showModal();}
function closeDialog(id){$(id).close();if(id==='confirm-dialog')confirmAction=null;}
function pointFromClient(clientX,clientY){const matrix=svg.getScreenCTM();if(!matrix)return {x:0,y:0};const p=new DOMPoint(clientX,clientY).matrixTransform(matrix.inverse());return {x:p.x,y:-p.y};}
function onStage(clientX,clientY){if(organizerOpen){const d=$('organizer').getBoundingClientRect();if(clientX>=d.left&&clientX<=d.right&&clientY>=d.top&&clientY<=d.bottom)return false;}const r=svg.getBoundingClientRect();return clientX>=r.left&&clientX<=r.right&&clientY>=r.top&&clientY<=r.bottom;}
function hitAt(point){return [...state.objects].filter(o=>Q.visible(state,o)).reverse().find(o=>{const r=M.rect(o);return point.x>=r.left&&point.x<=r.right&&point.y>=r.bottom&&point.y<=r.top;})??null;}
function viewBox(){const r=stage.getBoundingClientRect(),w=Math.max(r.width,200)/camera.scale,h=Math.max(r.height,200)/camera.scale;return {x:camera.x-w/2,y:camera.y-h/2,w,h};}
function worldFitScale(){const r=stage.getBoundingClientRect();return Math.max(.08,Math.min((Math.max(r.width,200)-32)/M.WORLD_SIZE,(Math.max(r.height,200)-32)/M.WORLD_SIZE));}
function updateView(){
 camera.scale=Math.max(worldFitScale(),Math.min(115,camera.scale));
 const view=viewBox(),world=M.worldBounds(state),margin=12/camera.scale;
 const clamp=(value,size,min,max)=>size>=max-min+2*margin?(min+max)/2:Math.max(min-margin+size/2,Math.min(max+margin-size/2,value));
 camera.x=clamp(camera.x,view.w,world.left,world.right);camera.y=clamp(camera.y,view.h,-world.top,-world.bottom);
 const b=viewBox();svg.setAttribute('viewBox',`${b.x} ${b.y} ${b.w} ${b.h}`);$('zoom-label').textContent=`${Math.round(camera.scale/fitScale*100)}%`;
}
function fitWorld(){const b=M.worldBounds(state);camera.x=(b.left+b.right)/2;camera.y=-(b.bottom+b.top)/2;camera.scale=worldFitScale();updateView();renderMap();}
function fitMap(){const r=stage.getBoundingClientRect(),b=M.bounds(state);camera.x=(b.left+b.right)/2;camera.y=-(b.bottom+b.top)/2;camera.scale=Math.max(worldFitScale(),Math.min((r.width-50)/(b.right-b.left+5),(r.height-70)/(b.top-b.bottom+5),36));fitScale=camera.scale;updateView();renderMap();}
function zoom(factor,clientX,clientY){const r=svg.getBoundingClientRect(),x=clientX??r.left+r.width/2,y=clientY??r.top+r.height/2,before=pointFromClient(x,y);camera.scale=Math.max(worldFitScale(),Math.min(115,camera.scale*factor));updateView();const after=pointFromClient(x,y);camera.x+=before.x-after.x;camera.y-=before.y-after.y;updateView();renderMap();}
function wrapName(value,width,size){
 const fontPx=size*100;metrics.font=`550 ${fontPx}px system-ui, sans-serif`;
 const fits=s=>metrics.measureText(s).width<=width*100;
 const result=[];let line='';
 for(const word of String(value).split(/\s+/)){
  const joined=line?line+' '+word:word;
  if(fits(joined)){line=joined;continue;}
  if(line){result.push(line);line='';}
  if(fits(word)){line=word;continue;}
  for(const character of Array.from(word)){if(line&&!fits(line+character)){result.push(line);line='';}line+=character;}
 }
 if(line)result.push(line);return result;
}
function nameSvg(name,width,height,y,fill='#e0edf8',initial=.56){
 let size=initial,lines=wrapName(name,width,size);
 while(lines.length*size*1.18>height&&size>.13){size-=.02;lines=wrapName(name,width,size);}
 const start=y-(lines.length-1)*size*1.18/2;
 return `<text class="map-name" fill="${fill}" font-size="${size.toFixed(3)}" font-weight="550" text-anchor="middle">${lines.map((s,i)=>`<tspan x="0" y="${(start+i*size*1.18).toFixed(3)}">${esc(s)}</tspan>`).join('')}</text>`;
}
function definitions(){const b=M.worldBounds(state);return `<defs><clipPath id="world-clip"><rect x="${b.left}" y="${-b.top}" width="1000" height="1000"/></clipPath><pattern id="world-grid" x="${b.left}" y="${-b.top}" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#3c5a70" stroke-width=".6"/></pattern><pattern id="medium-grid" x="${b.left}" y="${-b.top}" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#345169" stroke-width=".08"/></pattern><pattern id="small-grid" x="-.5" y="-.5" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0H0V1" fill="none" stroke="#263b50" stroke-width=".025"/></pattern><pattern id="big-grid" x="-.5" y="-.5" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="url(#small-grid)"/><path d="M5 0H0V5" fill="none" stroke="#345169" stroke-width=".04"/></pattern><pattern id="terrain-hatch" width=".55" height=".55" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width=".55" height=".55" fill="#342d36"/><path d="M0 0V.55" stroke="#714e54" stroke-width=".1"/></pattern></defs>`;}
function objectSvg(o,exporting=false){
 const q=M.displayCoords(state,o),name=M.objectLabel(state,o)+(o.type==='base'&&o.customName&&M.playerFor(state,o)&&M.playerFor(state,o).name!==o.name?' · '+M.playerFor(state,o).name:''),alliance=M.allianceOf(o),tint=M.ALLIANCE_COLORS[alliance-1],active=!exporting&&selectedObjectIds.has(o.id),classes=`object-${o.type}${active?' map-object-selected':''}`;
 const attr=`${['terrain','stronghold','city','missile'].includes(o.type)?'data-theme-preserve="true" ':''}data-object="${esc(o.id)}" class="${classes}" transform="translate(${o.x} ${-o.y})" role="button" aria-label="${esc(name)}, X ${q.x}, Y ${q.y}"`;
 let content='';
 if(o.type==='center'){
  content=`<rect x="-4.5" y="-4.5" width="9" height="9" fill="${alliance===1?'#27374b':tint+'30'}" stroke="${alliance===1?'#b1c5d7':tint}" stroke-width=".12"/><text y="-1.05" text-anchor="middle" fill="#edf5fc" font-size="1.55" font-weight="750">AC</text>${nameSvg(name,8,1,.55,'#d7e5f1',.65)}<text x="0" y="1.8" text-anchor="middle" fill="#afc7d7" font-size=".53">X ${num(q.x)}   Y ${num(q.y)}</text><text y="3.2" text-anchor="middle" fill="#8ca7bd" font-size=".48">${h('9 × 9 Felder')}</text>`;
 }else if(M.coreSize(o)){
  const f=M.solidFootprint(o),dx=f.x-o.x,dy=o.y-f.y,scale=Math.min(1,f.w/5,f.h/5);content=`<rect x="${dx-f.w/2}" y="${dy-f.h/2}" width="${f.w}" height="${f.h}" fill="#725039" stroke="#edc096" stroke-width=".15"/><g transform="translate(${dx} ${dy}) scale(${scale})">${nameSvg(name,f.w/scale-.3,1,-.6,'#fff2d7',.7)}<text y=".6" text-anchor="middle" fill="#fff2d7" font-size=".42">${f.w} × ${f.h}</text><text y="1.4" text-anchor="middle" fill="#fff2d7" font-size=".38">X ${num(q.x)} / Y ${num(q.y)}</text></g>`;
 }else if(o.type==='missile'){
  const scale=Math.min(1,o.w/10,o.h/5);content=`<rect x="${-o.w/2}" y="${-o.h/2}" width="${o.w}" height="${o.h}" fill="#ef4444" fill-opacity=".13" stroke="#ff6565" stroke-width=".18" stroke-dasharray=".65 .3" pointer-events="stroke"/><g transform="translate(0 ${-o.h/2+Math.min(1,o.h*.25)}) scale(${scale})" pointer-events="all"><rect x="-4.8" y="-.8" width="9.6" height="1.8" rx=".15" fill="#561f28"/>${nameSvg(name,9,.7,-.1,'#ffc9c9',.6)}<text y=".65" text-anchor="middle" fill="#ffc9c9" font-size=".4">${o.w} × ${o.h} · X ${num(q.x)} / Y ${num(q.y)}</text></g>`;
  content+=`<g class="missile-handle" transform="scale(${Math.min(1,o.w/3,o.h/3)})" pointer-events="all"><title>${h('Warnsymbol ziehen, um die Raketenfläche zu verschieben.')}</title><circle r="1.35" fill="#481c25" stroke="#ff7777" stroke-width=".09"/><path d="M0-1.05L1.08.87H-1.08Z" fill="#ffd56a"/><path d="M0-.45V.2" stroke="#482b17" stroke-width=".17" stroke-linecap="round"/><circle cy=".53" r=".1" fill="#482b17"/></g>`;
 }else if(o.type==='note'){
  content=`<circle r=".5" fill="#ffd56a" stroke="#745513" stroke-width=".07"/>${nameSvg(name,12,3,-1.1,'#ffd56a',.65)}<text y="1.2" text-anchor="middle" font-size=".4" fill="#ffd56a">X ${num(q.x)} / Y ${num(q.y)}</text>`;
 }else if(o.type==='terrain'){
  content=`<rect x="${-o.w/2}" y="${-o.h/2}" width="${o.w}" height="${o.h}" fill="${o.color??'url(#terrain-hatch)'}" stroke="${o.color??'#a8787d'}" stroke-width=".09"/>${nameSvg(name,o.w-.25,Math.max(.3,o.h-1.1),-.25,terrainInk(o),.6)}<text y="${o.h/2-.2}" text-anchor="middle" fill="${terrainInk(o)}" font-size=".35">${o.w} × ${o.h} · X ${num(q.x)} / Y ${num(q.y)}</text>`;
 }else{
  const beacon=o.type==='base'&&o.beacon,guard=o.type==='marshall',stroke=alliance!==1?tint:guard?'#f3cd6a':beacon?color(o):'#5b829f',fill=alliance!==1?tint+'28':guard?'#51432b':beacon?'#173540':o.playerId?'#223f57':'#152c40';
  content=`<rect x="-1.5" y="-1.5" width="3" height="3" fill="${fill}" stroke="${stroke}" stroke-width="${(beacon||guard) ? .09 : .055}"/>`;
  if(beacon)content+=`<circle cx="-1.06" cy="-1.07" r=".28" fill="${color(o)}"/><text x="-1.06" y="-.95" text-anchor="middle" font-size=".35" font-weight="800" fill="#0a1824">${o.beacon}</text><circle cx="1.14" cy="-1.19" r=".4" fill="#f7ce66" stroke="#0b1926" stroke-width=".065"/><text x="1.14" y="-1.09" text-anchor="middle" font-size=".29" font-weight="750" fill="#252618">+${o.electricians}</text>`;
  content+=nameSvg(name,2.63,beacon?1.12:1.55,beacon?-.12:-.25,guard?'#ffe3a0':o.playerId?'#ecf7ff':beacon?'#bcf4f0':'#80a1bc',beacon?.49:.55);
  content+=`<text text-anchor="middle" fill="${guard?'#e0c282':'#8fb4ca'}" font-size=".36" font-weight="450"><tspan x="0" y=".89">X ${num(q.x)}</tspan><tspan x="0" y="1.29">Y ${num(q.y)}</tspan></text>`;
 }
 if(!exporting&&o.locked)content+=`<text x="${o.w/2-.3}" y="${-o.h/2+.5}" font-size=".55" text-anchor="end" fill="#ffd56a">🔒</text>`;
 const key=shortcutFor(o.beacon?'beacon':o.type),shortcut=!exporting&&key?' · '+h('Tastenkürzel: {key}',{key}):'';
 if(alliance!==1&&!o.beacon)content+=`<text x="${-o.w/2+.2}" y="${-o.h/2+.48}" fill="${tint}" font-size=".34" pointer-events="none">${alliance}</text>`;
 content=filterMapLabels(content);
 return `<g ${attr}><title>${esc(allianceName(alliance))} · ${esc(name)} — X ${num(q.x)}, Y ${num(q.y)}${shortcut}</title>${content}</g>`;
}
function terrainHandles(o){
 const r=M.rect(o),offset=11/camera.scale,size=20/camera.scale,stroke=1.4/camera.scale;
 return ['nw','ne','sw','se'].map(c=>{const east=c.endsWith('e'),north=c.startsWith('n'),x=east?r.right:r.left,y=north?r.top:r.bottom,hx=x+(east?offset:-offset),hy=y+(north?offset:-offset),label={nw:'Oben links ziehen',ne:'Oben rechts ziehen',sw:'Unten links ziehen',se:'Unten rechts ziehen'}[c];
  return `<g class="terrain-handle" data-resize="${c}" data-object="${esc(o.id)}" role="button" tabindex="0" aria-label="${h(label)}"><title>${h(label)}</title><path d="M${x} ${-y}L${hx} ${-hy}" stroke="#9de8d3" stroke-width="${stroke}"/><rect x="${hx-size/2}" y="${-hy-size/2}" width="${size}" height="${size}" rx="${3/camera.scale}" fill="#d4fff0" stroke="#238269" stroke-width="${stroke}"/><text x="${hx}" y="${-hy+5/camera.scale}" text-anchor="middle" font-size="${16/camera.scale}" font-weight="800" fill="#124437">${{nw:'↖',ne:'↗',sw:'↙',se:'↘'}[c]}</text></g>`;
 }).join('');
}
function fillAreaHandles(area){
 const size=20/camera.scale,offset=Math.min(12/camera.scale,(area.right-area.left)/4,(area.top-area.bottom)/4),stroke=1.5/camera.scale;
 return ['nw','ne','sw','se'].map(c=>{const east=c.endsWith('e'),north=c.startsWith('n'),x=(east?area.right:area.left)+(east?-offset:offset),y=(north?area.top:area.bottom)+(north?-offset:offset),label={nw:'Oben links ziehen',ne:'Oben rechts ziehen',sw:'Unten links ziehen',se:'Unten rechts ziehen'}[c];
  return `<g class="fill-area-handle" data-fill-resize="${c}" role="button" tabindex="0" aria-label="${h('Füllbereich: {corner}',{corner:t(label)})}"><title>${h('Füllbereich: {corner}',{corner:t(label)})}</title><rect x="${x-size/2}" y="${-y-size/2}" width="${size}" height="${size}" rx="${3/camera.scale}" fill="#ffe1a0" stroke="#9e7631" stroke-width="${stroke}"/><text x="${x}" y="${-y+5/camera.scale}" text-anchor="middle" font-size="${16/camera.scale}" font-weight="800" fill="#50390e">${{nw:'↖',ne:'↗',sw:'↙',se:'↘'}[c]}</text></g>`;
 }).join('');
}
function terrainInk(o){const c=o.color;if(!c)return '#f0c4c4';const v=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));return v[0]*.299+v[1]*.587+v[2]*.114>145?'#14232c':'#ffffff';}
function terrainColorField(o){return `<label>${h('Terrainfarbe')}<input id="terrain-color" type="color" value="${o.color??'#a8787d'}"></label>`;}
function compoundTerrainSvg(parts,exporting=false){
 const primary=parts[0],geometry=M.terrainUnionGeometry(parts),active=!exporting&&parts.some(o=>selectedObjectIds.has(o.id)),stroke=active?(ghost?.invalid?'#ff9691':'#b4ffec'):primary.color??'#a8787d';
 const fill=geometry.slices.map(r=>`M${r.left} ${-r.top}H${r.right}V${-r.bottom}H${r.left}Z`).join(' '),outline=geometry.edges.map(([x1,y1,x2,y2])=>`M${x1} ${-y1}L${x2} ${-y2}`).join(' '),label=parts.reduce((best,o)=>o.w*o.h>best.w*best.h?o:best),name=M.objectLabel(state,primary),r=M.objectBounds(parts),{x,y}=M.displayCoords({...state,objects:state.objects.map(o=>parts.find(p=>p.id===o.id)||o)},primary);
 return `<g data-theme-preserve="true" data-object="${esc(primary.id)}" class="object-terrain terrain-compound" role="button" aria-label="${esc(name)}, ${h('Objektzentrum')}, X ${num(x)}, Y ${num(y)}"><title>${esc(name)} · ${h('Verbundene Terrainfläche')} · X ${num(x)} / Y ${num(y)}</title><path d="${fill}" fill="${primary.color??'url(#terrain-hatch)'}"/><path d="${outline}" fill="none" stroke="${stroke}" stroke-width="${active?.16:.09}" pointer-events="none"/><g transform="translate(${label.x} ${-label.y})" pointer-events="none">${nameSvg(name,label.w-.25,Math.max(.3,label.h-1.1),-.2,terrainInk(primary),.6)}<text y="${label.h/2-.25}" text-anchor="middle" fill="${terrainInk(primary)}" font-size=".35">X ${num(x)} / Y ${num(y)}</text></g></g>`;
}
function scene(exporting=false){
 let s='';
 const displayObjects=state.objects.filter(o=>Q.visible(state,o,exporting)).map(o=>!exporting&&ghost?.objects?.find(g=>g.id===o.id)||(!exporting&&drag?.kind==='resize'&&ghost?.o?.id===o.id?ghost.o:o));
 for(const o of displayObjects)if(M.coreSize(o))s+=`<rect data-theme-preserve="true" data-object="${esc(o.id)}" x="${o.x-o.w/2}" y="${-o.y-o.h/2}" width="${o.w}" height="${o.h}" fill="#765638" fill-opacity=".5" stroke="#ad865f" stroke-width=".06"/>`;
 if(M.isSeason4(state)&&state.showLight)for(const o of displayObjects)if(o.type==='base'&&o.beacon)s+=`<rect x="${o.x-o.lightSize/2}" y="${-o.y-o.lightSize/2}" width="${o.lightSize}" height="${o.lightSize}" fill="${color(o)}" fill-opacity=".045" stroke="${color(o)}" stroke-opacity=".8" stroke-width=".09" pointer-events="none"/>`;
 const drawn=new Set();for(const o of displayObjects.filter(o=>o.type!=='missile')){if(o.terrainGroup){if(drawn.has(o.terrainGroup))continue;drawn.add(o.terrainGroup);s+=filterMapLabels(compoundTerrainSvg(displayObjects.filter(q=>q.terrainGroup===o.terrainGroup),exporting));}else s+=objectSvg(o,exporting);}
 for(const o of displayObjects)if(o.type==='missile')s+=objectSvg(o,exporting);
 const terrainSelection=!exporting&&selectedObjectIds.size===1&&(drag?.kind==='resize'&&ghost?ghost.o:selected());
 if(!M.allianceObjects(state).some(o=>o.type===M.anchorType(state)))s+=`<g transform="translate(${state.origin.mapX} ${-state.origin.mapY})" pointer-events="none"><path d="M-1 0H1M0-1V1" stroke="#c6d9e7" stroke-width=".07" stroke-dasharray=".2 .15"/><text x="1.3" y=".15" font-size=".55" fill="#91adbf">${h('Ursprung X {x} / Y {y}',M.referenceCoords(state))}</text></g>`;
 if(!exporting&&ghost?.o){const g=ghost.o,stroke=ghost.invalid?'#ff9691':'#adffe8';s+=`<rect x="${g.x-g.w/2}" y="${-g.y-g.h/2}" width="${g.w}" height="${g.h}" fill="${stroke}" fill-opacity=".15" stroke="${stroke}" stroke-width=".12" stroke-dasharray=".25 .12" pointer-events="none"/>`;const q=M.displayCoords({...state,objects:state.objects.map(o=>o.id===g.id?g:o)},g);s+=`<text x="${g.x}" y="${-g.y-g.h/2-.45}" text-anchor="middle" font-size=".6" fill="${stroke}" pointer-events="none">${drag?.kind==='resize'?`${g.w} × ${g.h} · `:''}X ${num(q.x)} / Y ${num(q.y)}</text>`;}
 if(!exporting&&ghost?.objects){const stroke=ghost.invalid?'#ff9691':'#adffe8';for(const o of ghost.objects)if(!o.terrainGroup)s+=`<rect x="${o.x-o.w/2}" y="${-o.y-o.h/2}" width="${o.w}" height="${o.h}" fill="none" stroke="${stroke}" stroke-width=".15" stroke-dasharray=".3 .15" pointer-events="none"/>`;}
 if(!exporting){
  const box=drag?.kind==='selectbox'&&!drag.fill?selectionBox(drag.start,drag.current):fillArea;
  if(box){const stroke=mapMode==='fill'?'#f5ce72':'#7ce7d2';s+=`<rect x="${box.left}" y="${-box.top}" width="${box.right-box.left}" height="${box.top-box.bottom}" fill="${stroke}" fill-opacity=".08" stroke="${stroke}" stroke-width=".12" stroke-dasharray=".4 .18" pointer-events="none"/>`;}
  if(fillPreview)for(const o of fillPreview.positions)s+=`<rect x="${o.x-1.5}" y="${-o.y-1.5}" width="3" height="3" fill="#78d7bf" fill-opacity=".20" stroke="#9ee6cb" stroke-width=".08" pointer-events="none"/>`;
  if(fillArea&&mapMode==='fill'&&drag?.kind!=='selectbox')s+=fillAreaHandles(fillArea);
 }
 if(M.resizable(terrainSelection)&&!terrainSelection.locked&&!pending&&mapMode!=='fill')s+=terrainHandles(terrainSelection);
 return s+qolOverlay(exporting);
}
function renderMap(){
 updateView();const b=M.worldBounds(state),grid=camera.scale>=5?'big-grid':camera.scale>=1.5?'medium-grid':'world-grid',labelSize=13/camera.scale,pad=8/camera.scale;
 svg.innerHTML=T.svg(definitions()+`<rect x="${b.left}" y="${-b.top}" width="1000" height="1000" fill="#0b1726" pointer-events="none"/><rect x="${b.left}" y="${-b.top}" width="1000" height="1000" fill="url(#${grid})" stroke="#5a819d" stroke-width="1.5" vector-effect="non-scaling-stroke" pointer-events="none"/><g clip-path="url(#world-clip)">${scene()}</g><g fill="#b9d0df" font-size="${labelSize}" pointer-events="none"><text x="${b.left+pad}" y="${-b.bottom-pad}">X 0 · Y 0</text><text x="${b.right-pad}" y="${-b.top+pad+labelSize}" text-anchor="end">X 999 · Y 999</text></g>`);
 svg.classList.toggle('adding',!!pending||mapMode==='fill'||mapMode==='select');svg.classList.toggle('moving',!!drag&&drag.kind!=='roster');
}
function priorityText(level){return `P${level} · ${M.priorityLabel(state,level)}`;}
function playerBadges(p){const g=M.groupForPlayer(state,p.id),level=M.priorityOf(p);return `<span class="player-badges"><span class="priority-pill priority-${level}" title="${esc(priorityText(level))}">P${level}</span>${g?`<span class="group-pill">${esc(groupName(g.id))}</span>`:''}</span>`;}
function visiblePlayers(){const search=$('player-search').value.trim().toLocaleLowerCase();return M.alliancePlayers(state).filter(p=>(filter==='all'||!M.objectForPlayer(state,p.id))&&p.name.toLocaleLowerCase().includes(search));}
function selectionCheckbox(p){return `<input type="checkbox" class="player-check" data-select-player="${esc(p.id)}" aria-label="${h('{name} auswählen',{name:p.name})}" ${selectedPlayers.has(p.id)?'checked':''}>`;}
function renderRoster(){
 const assigned=new Map(M.allianceObjects(state).filter(o=>o.playerId).map(o=>[o.playerId,o])),players=visiblePlayers();
 $('roster-count').textContent=M.alliancePlayers(state).length;$('unplaced-count').textContent=M.alliancePlayers(state).length-assigned.size;
 $('filter-all').classList.toggle('active',filter==='all');$('filter-free').classList.toggle('active',filter==='free');$('filter-all').setAttribute('aria-pressed',String(filter==='all'));$('filter-free').setAttribute('aria-pressed',String(filter==='free'));
 if(!M.alliancePlayers(state).length)$('player-list').innerHTML=`<div class="empty-roster"><span class="empty-mark" aria-hidden="true">⠿</span><strong>${h('Wer sitzt wo?')}</strong>${h(M.isSeason4(state)?'Füge deine Spielerliste ein und verteile die Namen auf der Karte. A–D sind als Beacon-Plätze markiert.':'Füge Spieler hinzu und verteile sie rund um den Marshall.')}</div>`;
 else if(!players.length)$('player-list').innerHTML=`<div class="empty-roster">${h($('player-search').value.trim()?'Kein Spieler mit diesem Namen.':'Alle Spieler haben einen Platz.')}</div>`;
 else $('player-list').innerHTML=players.map(p=>{const o=assigned.get(p.id),q=o?M.displayCoords(state,o):null;return `<div class="player-row ${o?'assigned ':''}${pending?.playerId===p.id?'active':''}" data-player="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(p.name)}, ${esc(priorityText(M.priorityOf(p)))}, ${o?h('platziert auf X {x}, Y {y}',q):h('noch ohne Platz')}">${organizerOpen?selectionCheckbox(p):'<span class="grip" aria-hidden="true">'+(o?'✓':'⠿')+'</span>'}<span class="player-info"><span class="player-name">${esc(p.name)}</span><span class="player-position">${o?`X ${num(q.x)} · Y ${num(q.y)}${o.beacon?' · '+h('Beacon {letter}',{letter:o.beacon}):''}`:h('Auf einen Platz ziehen')}</span>${playerBadges(p)}</span><button class="remove-player" data-remove-player="${esc(p.id)}" aria-label="${h('{name} aus der Liste entfernen',{name:p.name})}" title="${h('Aus der Liste entfernen')}">×</button></div>`;}).join('');
 renderSelection();
}
function organizationMember(p,group=false){return `<div class="org-member" data-player="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(p.name)}, ${esc(priorityText(M.priorityOf(p)))}">${selectionCheckbox(p)}<span class="org-member-name">${esc(p.name)}${playerBadges(p)}</span>${group?`<button data-ungroup="${esc(p.id)}" title="${h('Aus der Gruppe entfernen')}" aria-label="${h('{name} aus der Gruppe entfernen',{name:p.name})}">×</button>`:''}</div>`;}
function renderSelection(){
 const valid=new Set(M.alliancePlayers(state).map(p=>p.id));selectedPlayers=new Set([...selectedPlayers].filter(id=>valid.has(id)));
 document.querySelectorAll('[data-player]').forEach(row=>{const checked=organizerOpen&&selectedPlayers.has(row.dataset.player);row.classList.toggle('is-selected',checked);if(organizerOpen)row.setAttribute('aria-pressed',String(checked));else row.removeAttribute('aria-pressed');});
 document.querySelectorAll('[data-select-player]').forEach(input=>input.checked=selectedPlayers.has(input.dataset.selectPlayer));
 $('selection-count').textContent=t('{n} Spieler ausgewählt',{n:selectedPlayers.size});$('apply-organization').disabled=!selectedPlayers.size;$('clear-selection').disabled=!selectedPlayers.size;$('select-visible').disabled=!visiblePlayers().length;
}
function renderOrganizer(){
 $('organizer').hidden=!organizerOpen;$('selection-tools').hidden=!organizerOpen;$('toggle-organizer').setAttribute('aria-expanded',String(organizerOpen));document.body.classList.toggle('organizer-open',organizerOpen);
 if(!organizerOpen)return;
 const scrolls=new Map([...$('organizer').querySelectorAll('[data-org-list]')].map(el=>[el.dataset.orgList,el.scrollTop])),friendScroll=$('friends-panel').scrollTop,priorityScroll=$('priority-panel').scrollTop;
 const priority=organizationTab==='priority';
 for(const tab of $('organizer').querySelectorAll('[data-tab]')){const active=tab.dataset.tab===organizationTab;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}
 $('priority-panel').hidden=!priority;$('friends-panel').hidden=priority;
 $('organizer-help').textContent=priority?t('P1 nach innen, P3 nach außen. Neue Spieler: P2. Eigene Namen ändern die Reihenfolge nicht.'):t('Der Prioritätsdurchschnitt bestimmt die Reihenfolge der Gruppen. Feste Plätze dienen als Anker. Jede Person gehört höchstens einer Gruppe an.');
 const destination=$('organizer-target').value;
 $('organizer-target').innerHTML=priority?[1,2,3].map(level=>`<option value="priority:${level}">${esc(priorityText(level))}</option>`).join(''):`<option value="group:0">${h('Keine Gruppe')}</option>`+Array.from({length:10},(_,i)=>`<option value="group:${i+1}">${esc(groupName(i+1))}</option>`).join('');
 if([...$('organizer-target').options].some(o=>o.value===destination))$('organizer-target').value=destination;
 $('priority-panel').innerHTML=[1,2,3].map(level=>{const players=M.alliancePlayers(state).filter(p=>M.priorityOf(p)===level);return `<section class="org-card" data-org-drop="priority" data-level="${level}" aria-label="${esc(priorityText(level))}"><div class="org-card-head"><div class="org-card-title"><h3><span class="priority-pill priority-${level}">P${level}</span></h3><span class="count">${players.length}</span></div><label class="sr-only" for="priority-label-${level}">${h('Bezeichnung für P{n}',{n:level})}</label><input id="priority-label-${level}" data-priority-label="${level}" value="${esc(M.priorityLabelsFor(state)[level-1])}" placeholder="${h(M.PRIORITY_DEFAULTS[level-1])}" maxlength="40" title="${h('Bezeichnung bearbeiten')}"></div><div class="org-members" data-org-list="priority-${level}">${players.length?players.map(p=>organizationMember(p)).join(''):`<p class="org-empty">${h('Spieler hier hineinziehen')}</p>`}</div></section>`;}).join('');
 $('friends-panel').innerHTML=Array.from({length:10},(_,i)=>{const id=i+1,group=M.allianceGroups(state).find(g=>g.id===id)??{id,playerIds:[]},members=group.playerIds.map(id=>M.alliancePlayers(state).find(p=>p.id===id)).filter(Boolean),placed=state.objects.filter(o=>group.playerIds.includes(o.playerId)),split=placed.length>1&&M.groupComponents(placed,state.layout==='compact'?0:1)>1;return `<section class="org-card" data-org-drop="group" data-group="${id}" aria-label="${esc(groupName(id))}"><div class="org-card-head"><div class="org-card-title"><h3>${esc(groupName(id))}</h3><span class="count">${members.length}</span></div><p class="group-score">${members.length?h('Durchschnitt: {value}',{value:M.groupPriority(state,group).toLocaleString(I.language,{minimumFractionDigits:2,maximumFractionDigits:2})}):h('Noch keine Gruppenmitglieder.')}</p><p class="org-card-status ${split?'group-warning':''}">${h('{placed} / {total} Gruppenmitglieder platziert.',{placed:placed.length,total:members.length})}${split?' '+h('Die Gruppe steht noch nicht zusammenhängend.'):''}</p></div><div class="org-members" data-org-list="group-${id}">${members.length?members.map(p=>organizationMember(p,true)).join(''):`<p class="org-empty">${h('Spieler hier hineinziehen')}</p>`}</div></section>`;}).join('');
 for(const el of $('organizer').querySelectorAll('[data-org-list]'))el.scrollTop=scrolls.get(el.dataset.orgList)??0;
 $('friends-panel').scrollTop=friendScroll;$('priority-panel').scrollTop=priorityScroll;renderSelection();
}
function setOrganizer(open){organizerOpen=open;resetMapTools();$('drag-ghost').hidden=true;clearOrganizationDrop();render();(open?$(organizationTab==='priority'?'priority-tab':'friends-tab'):$('toggle-organizer')).focus({preventScroll:true});}
function togglePlayerSelection(id){if(selectedPlayers.has(id))selectedPlayers.delete(id);else selectedPlayers.add(id);renderSelection();}
function clearOrganizationDrop(){document.querySelectorAll('[data-org-drop].drop-active').forEach(el=>el.classList.remove('drop-active'));}
function organizationDropAt(x,y){if(!organizerOpen)return null;const target=document.elementFromPoint(x,y)?.closest('[data-org-drop]');return target&&$('organizer').contains(target)?target:null;}
function organizePlayers(ids,type,value){const next=type==='priority'?M.setPlayerPriorities(state,ids,value):M.setPlayerGroups(state,ids,value||null);commit(next,t('{n} Spieler zugewiesen.',{n:ids.length}));renderSelection();}
function objectPositionForm(o){
 const q=M.displayCoords(state,o),limits=M.centerLimits(state,o);
 return `<form id="position-form" class="terrain-position-form"><h3>${h('Objektzentrum')}</h3><div class="inline-fields"><label>X<input id="object-x" type="number" step="1" min="${limits.minX}" max="${limits.maxX}" value="${q.x==='X'?'':q.x}" placeholder="X" required></label><label>Y<input id="object-y" type="number" step="1" min="${limits.minY}" max="${limits.maxY}" value="${q.y==='X'?'':q.y}" placeholder="X" required></label></div><button type="submit" class="full">${h('Position übernehmen')}</button><p class="field-help">${h('X/Y beziehen sich auf das Zentrum. Das gesamte Objekt bleibt innerhalb der Karte.')}</p>${q.x==='X'||q.y==='X'?`<p class="field-help">${h('Kein eindeutiges mittleres Feld: Bitte X/Y manuell eintragen. Bei gerader Größe verwenden wir das mittlere Feld links bzw. unten.')}</p>`:''}</form>`;
}
function selectionCenterKey(info){return JSON.stringify([info.ids.slice().sort(),info.coordinates]);}
function selectionPositionForm(){
 const info=M.selectionCenter(state,[...selectedObjectIds]),q=info.coordinates,limits=info.limits,confirmed=selectionCenterEntry?.key===selectionCenterKey(info);
 const value=axis=>Number.isInteger(q[axis])?q[axis]:confirmed?selectionCenterEntry[axis]:'';
 return `<form id="selection-position-form" class="terrain-position-form"><h3>${h('Mittelpunkt der Auswahl')}</h3><div class="inline-fields"><label>X<input id="selection-x" type="number" step="1" min="${limits.minX}" max="${limits.maxX}" value="${value('x')}" placeholder="X" required></label><label>Y<input id="selection-y" type="number" step="1" min="${limits.minY}" max="${limits.maxY}" value="${value('y')}" placeholder="X" required></label></div><button type="submit" class="full">${h('Auswahl positionieren')}</button><p class="field-help">${h('Der Mittelpunkt des äußeren Rahmens wird positioniert. Alle markierten Objekte behalten ihre Abstände zueinander.')}</p>${!Number.isInteger(q.x)||!Number.isInteger(q.y)?`<p class="field-help">${h('Kein eindeutiges mittleres Feld: Bitte X/Y manuell eintragen. Bei gerader Größe verwenden wir das mittlere Feld links bzw. unten.')}</p>`:''}</form>`;
}
function bulkMoveForm(){return `<form id="bulk-move-form"><div class="inline-fields"><label>${h('Verschiebung X')}<input id="selection-dx" type="number" step="1" value="0" required></label><label>${h('Verschiebung Y')}<input id="selection-dy" type="number" step="1" value="0" required></label></div><button type="submit" class="full">${h('Auswahl verschieben')}</button></form>`;}
function renderInspectorContent(){
 const objects=selectedObjects(),o=selected();$('selection-type').hidden=!o;
 $('anchor-section').hidden=!(objects.length===1&&o?.type===M.anchorType(state));
 if(objects.length>1){
  const allTerrain=objects.every(q=>q.type==='terrain'),compound=allTerrain&&o?.terrainGroup&&objects.every(q=>q.terrainGroup===o.terrainGroup),bounds=M.objectBounds(objects);
  $('selection-type').textContent=compound?t('Verbundene Terrainfläche'):selectionSummary();
  $('inspector').innerHTML=`<div class="selection-form multi-inspector"><p class="field-help">${h('Ziehe ein markiertes Element, um die gesamte Auswahl zu verschieben.')}</p>${compound?`<label>${h('Bezeichnung')}<input id="terrain-group-name" value="${esc(M.objectLabel(state,o))}" maxlength="80"></label><p class="field-help">${h('{n} Teile · Außenmaß {w} × {h}',{n:objects.length,w:bounds.right-bounds.left,h:bounds.top-bounds.bottom})}</p>${terrainColorField(o)}${objectPositionForm(o)}<p class="field-help">${h('Bei verbundenem Terrain beziehen sich die Koordinaten auf das Zentrum des äußeren Rahmens.')}</p>`:selectionPositionForm()+bulkMoveForm()}${allTerrain&&objects.every(q=>M.owns(state,q))?`${!compound?`<button id="connect-terrains" class="full">${h('Terrain verbinden')}</button>`:''}${objects.some(q=>q.terrainGroup)?`<button id="disconnect-terrains" class="full">${h('Terrain trennen')}</button>`:''}`:''}<button id="delete-selected" class="danger full">${h('Auswahl entfernen')}</button><button id="clear-map-selection" class="full">${h('Auswahl aufheben')}</button></div>`;return;
 }
 if(!o){$('inspector').innerHTML=`<div class="selection-empty"><span aria-hidden="true">⌖</span><p>${h('Wähle eine Basis, den Marshall oder ein anderes Element auf der Karte.')}</p></div>`;return;}
 $('selection-type').textContent=allianceName(M.allianceOf(o))+' · '+typeName(o);
 const q=M.displayCoords(state,o),player=M.playerFor(state,o);let s='<div class="selection-form">';
 if(o.type==='base'){
  s+=`<label>${h('Spieler')}<select id="assign-select"><option value="">${h('Platz freihalten')}</option>${M.alliancePlayers(state).map(p=>`<option value="${esc(p.id)}" ${p.id===o.playerId?'selected':''}>${esc(p.name)}${M.objectForPlayer(state,p.id)&&p.id!==o.playerId?' ('+h('bereits platziert')+')':''}</option>`).join('')}</select></label>`;
  if(player){s+=`<label>${h('Priority')}<select id="inspector-priority">${[1,2,3].map(level=>`<option value="${level}" ${M.priorityOf(player)===level?'selected':''}>${esc(priorityText(level))}</option>`).join('')}</select></label><label>${h('Name bearbeiten')}<input id="player-name-edit" value="${esc(player.name)}" maxlength="80"></label><label>${h('Gruppe')}<select id="inspector-group"><option value="">${h('Keine Gruppe')}</option>${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${M.groupForPlayer(state,player.id)?.id===i+1?'selected':''}>${esc(groupName(i+1))}</option>`).join('')}</select></label>`;}
 }
 s+=`<label>${h('Bezeichnung')}<input id="object-name-edit" value="${esc(o.type==='base'?(o.customName?o.name:''):M.objectLabel(state,o))}" placeholder="${esc(M.objectLabel(state,o))}" maxlength="80"></label>${o.type==='base'?`<p class="field-help">${h('Eigener Basisname. Leer lassen, um Spielername oder Platznummer anzuzeigen.')}</p>`:''}`;
 if(o.type==='terrain'){
  s+=terrainColorField(o);
  s+=`<p class="field-help resize-hint">${h('Zum Ändern der Größe an den Eckpfeilen auf der Karte ziehen.')}</p>`;
  const terrains=[...new Map(M.allianceObjects(state).filter(q=>q.type==='terrain').map(q=>[q.terrainGroup??q.id,q])).values()];
  if(terrains.length>1)s+=`<label>${h('Terrainfläche auswählen')}<select id="terrain-select">${terrains.map((t,i)=>`<option value="${esc(t.id)}" ${t.id===o.id?'selected':''}>${i+1}. ${esc(M.objectLabel(state,t))} · ${t.w} × ${t.h}</option>`).join('')}</select></label>`;
  s+=`<form id="terrain-size-form" class="terrain-size-form"><h3>${h('Größe ändern')}</h3><div class="inline-fields"><label>${h('Breite (Felder)')}<input id="terrain-width" type="number" min="1" max="60" step="1" value="${o.w}" required></label><label>${h('Höhe (Felder)')}<input id="terrain-height" type="number" min="1" max="60" step="1" value="${o.h}" required></label></div><button class="full" type="submit">${h('Größe übernehmen')}</button><p class="field-help">${h('Je 1–60 Felder. Die linke untere Ecke bleibt bei Größenänderungen fest. Terrain darf anderes Terrain überlappen. Gebäude bleiben frei.')}</p></form>`;
 }
 if(M.coreSize(o)||o.type==='missile'){
  const fields=(prefix,w,h)=>`<div class="inline-fields"><label>${hLabel('Breite (Felder)')}<input id="${prefix}-width" type="number" min="1" max="1000" step="1" value="${w}" required></label><label>${hLabel('Höhe (Felder)')}<input id="${prefix}-height" type="number" min="1" max="1000" step="1" value="${h}" required></label></div>`,hLabel=key=>h(key);
  s+=`<form id="object-size-form" class="terrain-size-form"><h3>${h(M.coreSize(o)?'Äußere Schlammfläche':'Missile-Bereich')}</h3>${fields('object',o.w,o.h)}${M.coreSize(o)?`<h3>${h('Fester Kern')}</h3>${fields('core',M.coreSize(o),M.coreHeight(o))}`:''}<button class="full" type="submit">${h('Größe übernehmen')}</button><p class="field-help">${h('Die linke untere Ecke bleibt bei Größenänderungen über diese Felder fest.')}</p><p class="field-help">${h(M.coreSize(o)?'Der Kern liegt auf ganzen Feldern möglichst mittig. Nur der Kern blockiert Gebäude.':'Rote Markierung ohne Kollisionen. Andere Objekte bleiben frei platzierbar.')}</p><p class="field-help">${h('Zum Ändern der Größe an den Eckpfeilen auf der Karte ziehen.')}</p></form>`;
 }
 s+=objectPositionForm(o);
 if(o.type==='base'&&M.isSeason4(state)){
  s+=`<label class="check-label"><input id="beacon-enabled" type="checkbox" ${o.beacon?'checked':''}> ${h('Dieser Spieler ist ein Beacon')}</label>`;
  if(o.beacon)s+=`<div class="inline-fields"><label>${h('Markierung')}<select id="beacon-letter">${Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(c=>`<option ${c===o.beacon?'selected':''} ${M.allianceObjects(state).some(a=>a.id!==o.id&&a.beacon===c)?'disabled':''}>${c}</option>`).join('')}</select></label><label>${h('Elektriker')}<input id="electricians" type="number" min="0" max="100" step="1" value="${o.electricians}"></label></div><label>${h('L4-Lichtbreite in Feldern')}<input id="light-size" type="number" min="1" max="101" step="1" value="${o.lightSize}"></label>`;
 }
 if(M.isSeason4(state)&&(o.type==='base'||o.type==='marshall')){const c=M.coverage(state,o);s+=`<p class="coverage-note ${c.singleFull?'':'edge'}">${h(c.singleFull?'Vollständige Fläche in einem L4-Lichtbereich.':c.unionFull?'Die Fläche verteilt sich auf benachbarte Lichtbereiche. Buff-Symbol im Spiel prüfen.':c.center?'Mittelpunkt im Licht, Teile der Fläche außerhalb.':'Außerhalb der L4-Lichtbereiche.')}</p>`;}
 s+=`<div class="actions">${o.type==='base'&&o.playerId?`<button id="unassign-player">${h('Name lösen')}</button>`:''}<button id="delete-object" class="danger">${h('Element entfernen')}</button></div></div>`;
 $('inspector').innerHTML=s;
}
function renderControls(){
 const alliance=M.activeAlliance(state);$('alliance-select').value=String(alliance);for(const option of $('alliance-select').options)option.textContent=allianceName(Number(option.value));$('alliance-swatch').style.background=M.ALLIANCE_COLORS[alliance-1];$('alliance-status').textContent=t('Aktiv: {alliance}. Import, Gruppen, Autofill und neue Objekte gehören zu dieser Allianz.',{alliance:allianceName(alliance)});
 const s4=M.isSeason4(state),ref=referenceName();
 $('season-select').value=state.season;$('season-badge').textContent=state.season==='off'?'OFF':`S0${state.season}`;
 for(const option of $('season-select').options)option.textContent=option.value==='off'?t('Off Season'):t('Season {n}',{n:option.value});
 $('season-warning').hidden=!M.isDeveloping(state);
 $('season-help').textContent=t('Jede Season und jedes Layout behält seinen eigenen Kartenstand. Spieler, Gruppen und Prioritäten gelten für alle Varianten.');
 $('anchor-title').textContent=ref;$('anchor-size-key').textContent=t(s4?'Zentrum 9 × 9':'Marshall 3 × 3');
 $('autofill-direction').textContent=t('Autofill: Prioritäten und Gruppendurchschnitt, von innen nach außen.');
 $('mode-help-note').textContent=s4?t('Alle Koordinaten bezeichnen den Mittelpunkt des Objekts. Verschieben verändert nur die gewählten Objekte. L4 zeigt 25 × 25 Felder je Beacon.'):t('Alle Koordinaten bezeichnen den Mittelpunkt des Objekts. Der Marshall bleibt der Bezugspunkt für Autofill.');
 document.querySelectorAll('[data-s4-only]').forEach(el=>el.hidden=!s4);
 $('clear-players').disabled=!M.alliancePlayers(state).length;
 $('plan-title').value=state.title;$('anchor-x').value=M.referenceCoords(state).x;$('anchor-y').value=M.referenceCoords(state).y;$('anchor-x').min=$('anchor-y').min=M.isSeason4(state)?4:1;$('anchor-x').max=$('anchor-y').max=M.isSeason4(state)?995:998;$('show-light').checked=state.showLight;$('layout-select').value=state.layout;
 const bases=M.allianceObjects(state).filter(o=>o.type==='base'),assigned=bases.filter(o=>o.playerId).length,beacons=bases.filter(o=>o.beacon).length;
 $('unassign-all').disabled=!assigned;
 $('app-version').textContent=t('Version {version}',{version:APP_VERSION});
 $('map-summary').textContent=t(s4?'{assigned} / {total} Plätze vergeben · {beacons} Beacons':'{assigned} / {total} Plätze vergeben',{assigned,total:bases.length,beacons});
 const sizes=[...new Set(bases.filter(o=>o.beacon).map(o=>o.lightSize))];$('light-legend').textContent=sizes.length>1?t('L4 individuell'):`L4 ${sizes[0]??25} × ${sizes[0]??25}`;
 $('save-status').textContent=t(dirty?'Ungespeicherte Änderungen':'Plan bereit');$('save-status').style.color=dirty?'#e6c97d':'';
 $('undo').disabled=!undoStack.length;$('redo').disabled=!redoStack.length;
 renderAutofill();
 $('anchor-help').textContent=t('Verschiebt nur die ausgewählte Allianz. Andere Allianzen behalten ihre Kartenkoordinaten.');
 document.querySelectorAll('[data-tool]').forEach(b=>{
  b.classList.toggle('active',pending?.kind==='object'&&pending.tool===b.dataset.tool);
  const key=shortcutFor(b.dataset.tool),name=t({base:'Basis',marshall:'Marshall',center:'Allianzzentrum',terrain:'Terrain',beacon:'Beacon',note:'Notiz',city:'Stadt',stronghold:'Stronghold',missile:'Missile'}[b.dataset.tool]);
  b.title=key?t('{name} hinzufügen ({key})',{name,key}):name;b.setAttribute('aria-keyshortcuts',key);
 });
 document.querySelectorAll('[data-map-mode]').forEach(button=>{const active=mapMode===button.dataset.mapMode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 renderFillControls();
 $('map-selection-count').textContent=selectionSummary();$('selection-scope').value=selectionScope;
 const ph=$('placement-hint');ph.hidden=!pending;
 if(pending)ph.querySelector('span').textContent=pending.kind==='player'?t('{name}: gewünschten Platz anklicken',{name:M.alliancePlayers(state).find(p=>p.id===pending.playerId)?.name??t('Spieler')}):t('{name}: auf die Karte klicken',{name:typeName(pending.o)});
}
function renderFillControls(){
 $('area-fill-gap-note').hidden=Number($('fill-gap').value)!==2||!M.allianceObjects(state).some(o=>o.type==='center');
 $('area-fill-options').hidden=mapMode!=='fill';$('apply-area-fill').disabled=!fillPreview?.positions.length||!!drag;
 $('area-fill-summary').textContent=fillPreview?t('{w} × {h} Felder · {n} neue Basen · {blocked} blockierte Plätze',{w:fillArea.right-fillArea.left,h:fillArea.top-fillArea.bottom,n:fillPreview.positions.length,blocked:fillPreview.skipped})+(fillPreview.limited?' '+t('Limit: 800 Kartenelemente.'):''):t('Ziehe auf der Karte den Bereich auf, der mit Basen gefüllt werden soll.');
 $('area-fill-anchor').textContent=M.allianceObjects(state).some(o=>o.type===M.anchorType(state))?t(M.isSeason4(state)?'Raster am Allianzzentrum: von innen nach außen, am Zentrum höchstens 1 Feld Abstand.':'Raster am Marshall: von innen nach außen.'):t('Ohne Zentrum bleibt das Raster am Kartenursprung ausgerichtet.');
}
function renderAutofill(){
 $('autofill-result').hidden=!lastAutofillResult?.splitGroups?.length;
 $('autofill-result').textContent=lastAutofillResult?.splitGroups?.length?t('Nicht vollständig zusammenhängend: {groups}. Freie Nachbarplätze oder feste Zuweisungen prüfen.',{groups:lastAutofillResult.splitGroups.map(groupName).join(', ')}):'';
 const {players,seats,reserved}=M.autofillOptions(state,$('autofill-beacons').checked);
 $('autofill').disabled=!players.length||!seats.length;
 $('autofill-summary').textContent=!M.alliancePlayers(state).length?t('Füge zuerst Spieler hinzu.'):!players.length?t('Alle Spieler haben bereits einen Platz.'):t('{players} ohne Platz · {seats} freie Plätze.',{players:players.length,seats:seats.length})+(reserved?' '+t('{n} Beacon-Plätze bleiben frei.',{n:reserved}):'');
}
function render(){renderControls();renderRoster();renderOrganizer();renderInspector();renderMap();renderQoL();}
function clearPending(){resetMapTools();render();}
function selectObject(id,focus=false,add=false){
 const o=state.objects.find(q=>q.id===id);if(!o)return;if(!M.owns(state,o)&&!(selectionScope==='all'&&add))activateAlliance(M.allianceOf(o));
 const unit=M.expandObjectIds(state,[id]);
 if(add&&!selectionMatches(o))return;
 if(add){const ids=new Set(selectedObjectIds),remove=unit.every(key=>ids.has(key));for(const key of unit)if(remove)ids.delete(key);else ids.add(key);setMapSelection([...ids],id);}
 else setMapSelection(unit,id);
 highlightObject=id;
 activateSelectionAlliance();renderControls();renderInspector();renderMap();renderQoL();if(focus)svg.focus({preventScroll:true});
}
function armPlayer(id){resetMapTools(true);pending={kind:'player',playerId:id};render();}
function focusPlayer(id){const o=M.objectForPlayer(state,id);if(o){resetMapTools();setMapSelection([o.id],o.id);camera.x=o.x;camera.y=-o.y;camera.scale=Math.max(camera.scale,fitScale*1.8);render();}else armPlayer(id);}
function armObject(type){
 resetMapTools(true);
 const existing=['center','marshall'].includes(type)?M.allianceObjects(state).find(o=>o.type===type):null;
 if(existing){setMapSelection([existing.id],existing.id);camera.x=existing.x;camera.y=-existing.y;render();toast(t('{name} ist bereits vorhanden. Du kannst das Element jetzt verschieben.',{name:typeName(existing)}));return;}
 safely(()=>{pending={kind:'object',tool:type,o:M.makeObject(state,type)};});render();
}
function placePlayer(id,point){
 const target=hitAt(point);
 if(target){const from=M.objectForPlayer(state,id);if(target.type==='base'&&target.playerId&&target.playerId!==id&&from&&M.allianceOf(from)===M.allianceOf(target)){confirm(t('Spielerplätze tauschen'),t('Spielerzuweisungen beider Basen tauschen?'),()=>commit(Q.swap(state,[from.id,target.id])));return;}const next=M.assign(state,id,target.id);selectedId=target.id;selectedObjectIds=new Set([target.id]);pending=null;ghost=null;commit(next,t('Spieler zugeordnet.'));render();return;}
 const o=M.makeObject(state,'base',point.x,point.y),next=M.assign(M.addObject(state,o),id,o.id);selectedId=o.id;selectedObjectIds=new Set([o.id]);pending=null;ghost=null;commit(next,t('Neue Basis platziert und Spieler zugeordnet.'));
}
function placePending(point){
 if(!pending)return;
 if(pending.kind==='player')return placePlayer(pending.playerId,point);
 const o={...pending.o,x:M.snap(point.x,pending.o.w),y:M.snap(point.y,pending.o.h)},next=M.addObject(state,o);selectedId=o.id;selectedObjectIds=new Set([o.id]);pending=null;ghost=null;commit(next,o.type==='terrain'?t('Terrain platziert. Größe und Zentrum kannst du rechts einstellen.'):t('{name} platziert.',{name:typeName(o)}));
}
function selectionBox(a,b){return {left:Math.min(a.x,b.x),right:Math.max(a.x,b.x),bottom:Math.min(a.y,b.y),top:Math.max(a.y,b.y)};}
function fillGridPoint(point){const w=M.worldBounds(state),snap=value=>Math.round(value+.5)-.5;return {x:Math.max(w.left,Math.min(w.right,snap(point.x))),y:Math.max(w.bottom,Math.min(w.top,snap(point.y)))};}
function newFillArea(start,end){
 const area=selectionBox(fillGridPoint(start),fillGridPoint(end)),world=M.worldBounds(state);
 if(area.left===area.right){if(area.right<world.right)area.right++;else area.left--;}
 if(area.bottom===area.top){if(area.top<world.top)area.top++;else area.bottom--;}
 return area;
}
function resizeFillArea(area,corner,point){
 const next={...area},p=fillGridPoint(point);
 if(corner.endsWith('e'))next.right=Math.max(area.left+1,p.x);else next.left=Math.min(area.right-1,p.x);
 if(corner.startsWith('n'))next.top=Math.max(area.bottom+1,p.y);else next.bottom=Math.min(area.top-1,p.y);
 return next;
}
function updateFillDrag(point){
 if(drag.kind==='fill-resize'){
  const a=drag.original,x=(drag.corner.endsWith('e')?a.right:a.left)+point.x-drag.point.x,y=(drag.corner.startsWith('n')?a.top:a.bottom)+point.y-drag.point.y;
  fillArea=resizeFillArea(a,drag.corner,{x,y});
 }else {drag.current=point;fillArea=newFillArea(drag.start,point);}
 refreshFillPreview();renderFillControls();renderMap();
}
function moveSelection(dx,dy){if(!Number.isInteger(dx)||!Number.isInteger(dy))throw new Error(t('Die Verschiebung muss in ganzen Feldern erfolgen.'));const entries=selectedObjects().map(o=>({id:o.id,x:o.x+dx,y:o.y+dy}));if(entries.length)commit(M.moveObjects(state,entries,selectionScope));}
function previewAt(point){
 if(pasteObjects){previewCopies(point);renderMap();return;}
 if(drag?.kind==='resize'){
  const o=drag.original,r=M.rect(o),x=(drag.corner.endsWith('e')?r.right:r.left)+point.x-drag.point.x,y=(drag.corner.startsWith('n')?r.top:r.bottom)+point.y-drag.point.y;
  const candidate=M.terrainResizeCandidate(o,drag.corner,x,y);let invalid=false;try{M.assertPlacement(state,candidate);}catch{invalid=true;}
  ghost={o:candidate,invalid,point:{x,y}};renderMap();return;
 }
 if(drag?.kind==='object'){
  const dx=Math.round(point.x-drag.point.x),dy=Math.round(point.y-drag.point.y),ignored=new Set(drag.ids),objects=state.objects.filter(o=>ignored.has(o.id)).map(o=>({...o,x:o.x+dx,y:o.y+dy}));let invalid=false;
  try{for(const o of objects)M.assertPlacement(state,o,ignored);}catch{invalid=true;}
  ghost={objects,invalid};renderMap();return;
 }
 if(pending?.kind==='object'){const o={...pending.o,x:M.snap(point.x,pending.o.w),y:M.snap(point.y,pending.o.h)};let invalid=false;try{M.assertPlacement(state,o);}catch{invalid=true;}ghost={o,invalid};renderMap();}
}
svg.addEventListener('pointerdown',e=>{
 if(e.button!==0||drag)return;e.preventDefault();svg.focus({preventScroll:true});lastPoint=pointFromClient(e.clientX,e.clientY);
 const id=e.target.closest('[data-object]')?.dataset.object,handle=e.target.closest('[data-resize]'),fillHandle=e.target.closest('[data-fill-resize]');
 if(pasteObjects){safely(()=>placeCopies(lastPoint));return;}
 if(pending){safely(()=>placePending(lastPoint));return;}
 if(id&&!['fill','check'].includes(mapMode)&&!e.shiftKey){const object=state.objects.find(o=>o.id===id);if(object&&!M.owns(state,object)&&!(selectionScope==='all'&&(e.ctrlKey||e.metaKey||selectedObjectIds.has(id))))activateAlliance(M.allianceOf(object));}
 const box=['fill','check'].includes(mapMode)||e.shiftKey||(!id&&(mapMode==='select'||e.ctrlKey||e.metaKey));
 if(fillHandle&&fillArea&&mapMode==='fill'){drag={kind:'fill-resize',original:{...fillArea},corner:fillHandle.dataset.fillResize,point:lastPoint,clientX:e.clientX,clientY:e.clientY,moved:false};renderFillControls();}
 else if(box){const previousArea=fillArea;fillArea=null;fillPreview=null;ghost=null;drag={kind:'selectbox',fill:mapMode==='fill',check:mapMode==='check',previousArea,start:lastPoint,current:lastPoint,clientX:e.clientX,clientY:e.clientY,moved:false,additive:e.ctrlKey||e.metaKey};renderControls();}
 else if(handle&&M.resizable(selected())&&selectedObjectIds.size===1){drag={kind:'resize',id:selectedId,original:M.clone(selected()),corner:handle.dataset.resize,point:lastPoint,clientX:e.clientX,clientY:e.clientY,moved:false};}
 else if(id){
  if(e.ctrlKey||e.metaKey){selectObject(id,false,true);return;}
  if(!selectedObjectIds.has(id))setMapSelection([id],id);else selectedId=id;
  if(selectedObjects().some(o=>o.locked)){render();return;}
  drag={kind:'object',ids:[...selectedObjectIds],point:lastPoint,clientX:e.clientX,clientY:e.clientY,moved:false};renderControls();renderInspector();
 }else{setMapSelection([]);drag={kind:'pan',clientX:e.clientX,clientY:e.clientY,cameraX:camera.x,cameraY:camera.y,moved:false};renderControls();renderInspector();}
 svg.setPointerCapture(e.pointerId);renderMap();
});
svg.addEventListener('pointermove',e=>{
 lastPoint=pointFromClient(e.clientX,e.clientY);
 if(!drag){previewAt(lastPoint);return;}if(drag.kind==='roster')return;
 if(Math.hypot(e.clientX-drag.clientX,e.clientY-drag.clientY)>4)drag.moved=true;
 if(drag.kind==='fill-resize'||drag.kind==='selectbox'&&drag.fill){if(drag.moved)safely(()=>updateFillDrag(lastPoint));return;}
 if(drag.kind==='selectbox'){drag.current=lastPoint;renderMap();return;}
 if(!drag.moved)return;
 if(drag.kind==='pan'){camera.x=drag.cameraX-(e.clientX-drag.clientX)/camera.scale;camera.y=drag.cameraY-(e.clientY-drag.clientY)/camera.scale;renderMap();}else previewAt(lastPoint);
});
svg.addEventListener('pointerup',e=>{
 if(!drag||drag.kind==='roster')return;
 if(drag.moved&&(drag.kind==='fill-resize'||drag.kind==='selectbox'&&drag.fill))safely(()=>updateFillDrag(pointFromClient(e.clientX,e.clientY)));
 if(drag.moved&&['resize','object'].includes(drag.kind))previewAt(pointFromClient(e.clientX,e.clientY));
 const d=drag,g=ghost;drag=null;ghost=null;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);
 if(d.kind==='resize'&&d.moved&&g)safely(()=>commit(M.resizeTerrain(state,d.id,d.corner,g.point.x,g.point.y),t('Größe angepasst.')));
 if(d.kind==='object'&&d.moved&&g?.objects)safely(()=>commit(M.moveObjects(state,g.objects.map(o=>({id:o.id,x:o.x,y:o.y})),selectionScope)));
 if(d.kind==='selectbox'){
  const area=selectionBox(d.start,pointFromClient(e.clientX,e.clientY));
  if(d.check){checkArea=area;mapMode='pan';runHiveCheck();}
  else if(d.fill&&!d.moved){fillArea=d.previousArea;safely(refreshFillPreview);}
  else if(!d.fill){const picked=d.moved?(selectionScope==='all'?state.objects:M.allianceObjects(state)).filter(o=>{const r=M.rect(o);return selectionMatches(o)&&!o.locked&&r.left>=area.left&&r.right<=area.right&&r.bottom>=area.bottom&&r.top<=area.top;}).map(o=>o.id):[];setMapSelection(d.additive?[...selectedObjectIds,...picked]:picked);activateSelectionAlliance();}
 }
 render();
});
svg.addEventListener('pointercancel',()=>{if(drag?.kind==='fill-resize')fillArea=drag.original;else if(drag?.kind==='selectbox'&&drag.fill)fillArea=drag.previousArea;drag=null;ghost=null;safely(refreshFillPreview);render();});
svg.addEventListener('pointerleave',()=>{if(!drag){ghost=null;renderMap();}});
svg.addEventListener('wheel',e=>{e.preventDefault();if(drag)return;zoom(Math.exp(-e.deltaY*.0014),e.clientX,e.clientY);},{passive:false});
function startPlayerDrag(e){
 if(e.button!==0||e.pointerType==='touch'||e.target.closest('button,input,select'))return;const row=e.target.closest('[data-player]');if(!row)return;
 const id=row.dataset.player,ids=organizerOpen&&selectedPlayers.has(id)?[...selectedPlayers]:[id];
 resetMapTools();renderControls();drag={kind:'roster',playerId:id,playerIds:ids,clientX:e.clientX,clientY:e.clientY,moved:false,pointerId:e.pointerId};row.setPointerCapture(e.pointerId);
}
$('player-list').addEventListener('pointerdown',startPlayerDrag);$('organizer').addEventListener('pointerdown',startPlayerDrag);
document.addEventListener('pointermove',e=>{
 if(drag?.kind!=='roster')return;
 if(Math.hypot(e.clientX-drag.clientX,e.clientY-drag.clientY)>5){if(!drag.moved&&organizerOpen){selectedPlayers=new Set(drag.playerIds);renderSelection();}drag.moved=true;}
 if(!drag.moved)return;
 const el=$('drag-ghost');el.hidden=false;el.textContent=drag.playerIds.length>1?t('{n} Spieler ausgewählt',{n:drag.playerIds.length}):M.alliancePlayers(state).find(p=>p.id===drag.playerId)?.name??'';el.style.left=e.clientX+14+'px';el.style.top=e.clientY+12+'px';
 const target=organizationDropAt(e.clientX,e.clientY);clearOrganizationDrop();target?.classList.add('drop-active');
 if(target){if(ghost){ghost=null;renderMap();}return;}
 if(onStage(e.clientX,e.clientY)&&drag.playerIds.length===1){const point=pointFromClient(e.clientX,e.clientY),hit=hitAt(point),o=hit??M.makeObject(state,'base',point.x,point.y);ghost={o,invalid:hit?(hit.type!=='base'||!M.owns(state,hit)||!!hit.playerId&&hit.playerId!==drag.playerId):!!M.collision(state,o)};renderMap();}else if(ghost){ghost=null;renderMap();}
});
document.addEventListener('pointerup',e=>{
 if(drag?.kind!=='roster')return;const d=drag;drag=null;$('drag-ghost').hidden=true;clearOrganizationDrop();ghost=null;
 if(d.moved){suppressClick=true;const target=organizationDropAt(e.clientX,e.clientY);if(target)safely(()=>organizePlayers(d.playerIds,target.dataset.orgDrop,Number(target.dataset.level??target.dataset.group)));else if(onStage(e.clientX,e.clientY)){if(d.playerIds.length===1)safely(()=>placePlayer(d.playerId,pointFromClient(e.clientX,e.clientY)));else toast(t('Mehrere Spieler bitte einer Priorität oder Gruppe zuordnen.'),true);}setTimeout(()=>suppressClick=false,0);}
 renderMap();
});
document.addEventListener('pointercancel',()=>{clearOrganizationDrop();if(drag?.kind==='roster'){drag=null;ghost=null;$('drag-ghost').hidden=true;renderMap();}});
function playerListClick(e){
 if(suppressClick||e.target.closest('input'))return;
 const remove=e.target.closest('[data-remove-player]');if(remove){const p=M.alliancePlayers(state).find(p=>p.id===remove.dataset.removePlayer);confirm(t('Spieler entfernen?'),t('{name} wird aus der Liste entfernt. Sein Platz wird wieder frei.',{name:p.name}),()=>commit(M.removePlayer(state,p.id),t('Spieler entfernt.')));return;}
 const ungroup=e.target.closest('[data-ungroup]');if(ungroup){safely(()=>commit(M.setPlayerGroup(state,ungroup.dataset.ungroup,null),t('Spieler aus der Gruppe entfernt.')));return;}
 const row=e.target.closest('[data-player]');if(row){if(organizerOpen)togglePlayerSelection(row.dataset.player);else focusPlayer(row.dataset.player);}
}
for(const container of [$('player-list'),$('organizer')]){
 container.addEventListener('click',playerListClick);
 container.addEventListener('change',e=>{const id=e.target.dataset.selectPlayer;if(id){if(e.target.checked)selectedPlayers.add(id);else selectedPlayers.delete(id);renderSelection();}});
 container.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button,input,select')){const row=e.target.closest('[data-player]');if(row){e.preventDefault();if(organizerOpen)togglePlayerSelection(row.dataset.player);else focusPlayer(row.dataset.player);}}});
}
$('toggle-organizer').addEventListener('click',()=>setOrganizer(!organizerOpen));$('close-organizer').addEventListener('click',()=>setOrganizer(false));
$('select-visible').addEventListener('click',()=>{for(const p of visiblePlayers())selectedPlayers.add(p.id);renderSelection();});$('clear-selection').addEventListener('click',()=>{selectedPlayers.clear();renderSelection();});
$('apply-organization').addEventListener('click',()=>{if(!selectedPlayers.size)return;const [type,value]=$('organizer-target').value.split(':');safely(()=>organizePlayers([...selectedPlayers],type,Number(value)));});
$('organizer').addEventListener('change',e=>{if(e.target.dataset.priorityLabel){const result=safely(()=>commit(M.setPriorityLabel(state,Number(e.target.dataset.priorityLabel),e.target.value)));if(result===null)renderOrganizer();}});
for(const tab of $('organizer').querySelectorAll('[data-tab]')){
 tab.addEventListener('click',()=>{organizationTab=tab.dataset.tab;renderOrganizer();});
 tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();organizationTab=e.key==='Home'?'priority':e.key==='End'?'friends':organizationTab==='priority'?'friends':'priority';renderOrganizer();$(organizationTab==='priority'?'priority-tab':'friends-tab').focus();});
}
$('clear-players').addEventListener('click',()=>{pending=null;ghost=null;drag=null;$('drag-ghost').hidden=true;commit(M.clearPlayers(state),t('Alle Spieler entfernt. Strg+Z stellt Spieler, Gruppen und Zuweisungen wieder her.'));});
$('unassign-all').addEventListener('click',()=>{pending=null;ghost=null;drag=null;$('drag-ghost').hidden=true;clearOrganizationDrop();commit(M.unassignAll(state),t('Alle Plätze freigegeben. Spielerliste und Gruppen bleiben erhalten. Strg+Z macht die Änderung rückgängig.'));});
$('selection-scope').addEventListener('change',e=>{if(!['active','all'].includes(e.target.value))return;selectionScope=e.target.value;pending=null;ghost=null;drag=null;setMapSelection([...selectedObjectIds],selectedId);render();});
$('alliance-select').addEventListener('change',e=>safely(()=>activateAlliance(Number(e.target.value))));
$('season-select').addEventListener('change',e=>{const value=e.target.value;e.target.value=state.season;safely(()=>activateVariant(value,state.layout));});
$('layout-select').addEventListener('change',e=>{const value=e.target.value;e.target.value=state.layout;safely(()=>activateVariant(state.season,value));});
$('inspector').addEventListener('submit',e=>{
 if(shellEnabled())e.target.querySelectorAll('[data-draft]').forEach(input=>delete input.dataset.draft);
 if(!['position-form','terrain-size-form','object-size-form','bulk-move-form','selection-position-form'].includes(e.target.id))return;e.preventDefault();const o=selected();if(!o)return;
 safely(()=>{
  if(e.target.id==='selection-position-form'){
   const x=Number($('selection-x').value),y=Number($('selection-y').value);
   if(!$('selection-x').value.trim()||!$('selection-y').value.trim())throw new Error(t('Bitte gültige Koordinaten eingeben.'));
   const next=M.setSelectionCenter(state,[...selectedObjectIds],x,y,selectionScope);
   selectionCenterEntry={key:selectionCenterKey(M.selectionCenter(next,[...selectedObjectIds])),x,y};
   commit(next,t('Koordinaten aktualisiert.'));renderInspector();return;
  }
  if(e.target.id==='bulk-move-form')return moveSelection(Number($('selection-dx').value),Number($('selection-dy').value));
  if(e.target.id==='object-size-form')return commit(M.updateObject(state,o.id,{w:Number($('object-width').value),h:Number($('object-height').value),...(M.coreSize(o)?{coreW:Number($('core-width').value),coreH:Number($('core-height').value)}:{})}),t('Größe angepasst.'));
  if(e.target.id==='terrain-size-form')return commit(M.updateObject(state,o.id,{w:Number($('terrain-width').value),h:Number($('terrain-height').value)}),t('Größe angepasst.'));
  const x=Number($('object-x').value),y=Number($('object-y').value);if(!$('object-x').value.trim()||!$('object-y').value.trim()||!Number.isFinite(x)||!Number.isFinite(y))throw new Error(t('Bitte gültige Koordinaten eingeben.'));
  commit(M.setObjectCenter(state,o.id,x,y));
 });
});
$('inspector').addEventListener('change',e=>{
 const o=selected();if(!o)return;const id=e.target.id;if(shellEnabled())delete e.target.dataset.draft;
 const result=safely(()=>{
  if(id==='assign-select')return commit(e.target.value?M.assign(state,e.target.value,o.id,true):M.unassign(state,o.id));
  if(id==='player-name-edit'){
   const name=M.normalizeName(e.target.value),p=M.playerFor(state,o);if(!name)throw new Error(t('Der Name darf nicht leer sein.'));if(M.alliancePlayers(state).some(q=>q.id!==p.id&&q.name.toLocaleLowerCase()===name.toLocaleLowerCase()))throw new Error(t('Dieser Name steht bereits in der Liste.'));const next=M.clone(state);next.players.find(q=>q.id===p.id).name=name;return commit(next);
  }
  if(id==='inspector-priority'&&o.playerId)return commit(M.setPlayerPriorities(state,[o.playerId],Number(e.target.value)));
  if(id==='inspector-group'&&o.playerId)return commit(M.setPlayerGroup(state,o.playerId,e.target.value?Number(e.target.value):null));
  if(id==='terrain-color')return commit(M.updateObject(state,o.id,{color:e.target.value}));
  if(id==='terrain-group-name'){let next=state;for(const part of M.terrainParts(state,o))next=M.updateObject(next,part.id,{name:e.target.value});return commit(next);}
  if(id==='object-name-edit')return commit(M.updateObject(state,o.id,{name:e.target.value}));
  if(id==='beacon-enabled')return commit(M.updateObject(state,o.id,{beacon:e.target.checked?M.nextBeacon(state):null}));
  if(id==='beacon-letter')return commit(M.updateObject(state,o.id,{beacon:e.target.value}));
  if(id==='electricians')return commit(M.updateObject(state,o.id,{electricians:Number(e.target.value)}));
  if(id==='light-size')return commit(M.updateObject(state,o.id,{lightSize:Number(e.target.value)}));
  if(id==='terrain-select')return selectObject(e.target.value);
 });
 if(result===null)renderInspector();
});
$('inspector').addEventListener('click',e=>safely(()=>{
 if(e.target.id==='connect-terrains')return commit(M.connectTerrains(state,[...selectedObjectIds]),t('Terrainflächen verbunden.'));
 if(e.target.id==='disconnect-terrains'){const primary=selectedId,next=M.disconnectTerrains(state,[...selectedObjectIds]);selectedObjectIds=new Set([primary]);return commit(next,t('Terrainverbindung gelöst.'));}
 if(['delete-selected','delete-object'].includes(e.target.id)&&selectedObjectIds.size)return commit(M.removeObjects(state,[...selectedObjectIds],selectionScope),t('Element entfernt. Strg+Z macht die Änderung rückgängig.'));
 if(e.target.id==='clear-map-selection'){setMapSelection([]);render();return;}
 if(e.target.id==='unassign-player'&&selected())return commit(M.unassign(state,selectedId),t('Der Spieler ist wieder ohne Platz.'));
}));
$('anchor-form').addEventListener('submit',e=>{e.preventDefault();if(selectedObjects().length!==1||selected()?.type!==M.anchorType(state))return;safely(()=>commit(M.setOrigin(state,Number($('anchor-x').value),Number($('anchor-y').value)),t('Koordinaten aktualisiert.')));});
$('plan-title').addEventListener('change',e=>{const name=e.target.value.trim()||t('Mein Hive');commit({...M.clone(state),title:name});});
$('show-light').addEventListener('change',e=>commit({...M.clone(state),showLight:e.target.checked}));
$('player-search').addEventListener('input',renderRoster);
$('filter-all').addEventListener('click',()=>{filter='all';renderRoster();});$('filter-free').addEventListener('click',()=>{filter='free';renderRoster();});
$('import-names').addEventListener('click',()=>{$('names-dialog').showModal();$('names-input').focus();});
$('import-player-file').addEventListener('click',()=>$('player-file').click());
$('player-file').addEventListener('change',async e=>{
 const file=e.target.files[0];e.target.value='';if(!file)return;
 $('import-player-file').disabled=true;
 try{
  const format=file.name.split('.').pop().toLowerCase();
  if(!['txt','csv'].includes(format))throw new Error(t('Bitte eine TXT- oder CSV-Datei auswählen.'));
  if(file.size>1_000_000)throw new Error(t('Die Spielerliste ist zu groß (maximal 1 MB).'));
  const text=M.decodePlayerFile(await file.arrayBuffer());
  const result=M.importPlayers(state,text,format);
  if(!result.added&&!result.skipped)throw new Error(t('Die Datei enthält keine Spielernamen.'));
  $('player-search').value='';filter='all';commit(result.state);renderRoster();
  toast(t('{added} Spieler hinzugefügt. {skipped} doppelte Einträge übersprungen.',result));
 }catch(error){toast(error.message||t('Die Spielerliste konnte nicht gelesen werden.'),true);}
 finally{$('import-player-file').disabled=false;}
});
$('autofill-beacons').addEventListener('change',renderAutofill);
$('autofill').addEventListener('click',()=>safely(()=>{
 const result=M.autofill(state,$('autofill-beacons').checked);
 if(!result.assigned)return;
 pending=null;ghost=null;commit(result.state,t('{assigned} Spieler von innen nach außen zugeordnet. {remaining} bleiben ohne Platz. Bestehende Zuweisungen bleiben erhalten.',result));lastAutofillResult=result;renderAutofill();
}));
function renderNamesPreview(){const n=$('names-input').value.split(/\r\n?|\n/).filter(x=>x.trim()).length;$('names-preview').textContent=n?t('Erkannte Namen: {n}',{n}):t('Noch keine Namen');}
$('names-input').addEventListener('input',renderNamesPreview);
$('names-form').addEventListener('submit',e=>{e.preventDefault();safely(()=>{const {state:next,added,skipped}=M.addPlayers(state,$('names-input').value);commit(next);$('names-input').value='';$('names-preview').textContent=t('Noch keine Namen');closeDialog('names-dialog');toast(t('{added} Spieler hinzugefügt. {skipped} doppelte Einträge übersprungen.',{added,skipped}));});});
$('apply-layout').addEventListener('click',()=>confirm(t('Ausgewählte Allianz zurücksetzen?'),t('Nur {alliance} wird in dieser Variante zurückgesetzt. Andere Allianzen, Varianten und Spielerlisten bleiben erhalten.',{alliance:allianceName(M.activeAlliance(state))}),()=>{resetMapTools(true);commit(M.resetAllianceLayout(state));fitMap();}));
$('confirm-yes').addEventListener('click',()=>{const action=confirmAction;closeDialog('confirm-dialog');if(action)safely(action);});
$('confirm-dialog').addEventListener('cancel',()=>confirmAction=null);
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.dataset.close)));
document.querySelectorAll('[data-map-mode]').forEach(button=>button.addEventListener('click',()=>{resetMapTools();mapMode=button.dataset.mapMode;render();svg.focus({preventScroll:true});}));
$('fill-gap').addEventListener('change',()=>{safely(refreshFillPreview);render();});
$('cancel-area-fill').addEventListener('click',clearPending);
$('apply-area-fill').addEventListener('click',()=>safely(()=>{
 if(!fillArea)return;const result=M.fillBases(state,fillArea,Number($('fill-gap').value));if(!result.added)return;
 resetMapTools(true);selectedObjectIds=new Set(result.ids);selectedId=result.ids[0];commit(result.state,t('{added} Basen hinzugefügt. {skipped} Plätze waren blockiert.',result));
}));
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>armObject(b.dataset.tool)));
$('cancel-placement').addEventListener('click',clearPending);$('show-help').addEventListener('click',()=>$('help-dialog').showModal());
$('zoom-in').addEventListener('click',()=>zoom(1.25));$('zoom-out').addEventListener('click',()=>zoom(.8));$('fit-map').addEventListener('click',fitMap);$('fit-world').addEventListener('click',fitWorld);
$('undo').addEventListener('click',()=>restoreHistory('undo'));$('redo').addEventListener('click',()=>restoreHistory('redo'));
$('open-plan').addEventListener('click',()=>$('plan-file').click());
$('plan-file').addEventListener('change',async e=>{
 const file=e.target.files[0];e.target.value='';if(!file)return;
 try{
  if(file.size>W.MAX_FILE_BYTES)throw new Error(t('Die Plan-Datei ist zu groß (maximal 20 MB).'));
  const raw=JSON.parse(await file.text()),next=W.readFile(raw),legacy=raw.schema===M.SCHEMA;
  const apply=()=>{resetMapTools(true);commitWorkspace(next);dirty=false;render();fitMap();toast(t(legacy?'Einzelplan geladen. Weitere Varianten stehen separat bereit.':'Alle Varianten geladen. Der zuletzt aktive Kartenstand ist geöffnet.'));};
  if(dirty)confirm(t('Plan öffnen?'),t('Die Datei ersetzt alle aktuellen Varianten. Speichere deinen bisherigen Stand vorher. Mit Strg+Z kannst du das Öffnen rückgängig machen.'),apply);else apply();
 }catch(error){toast(error instanceof SyntaxError?t('Die Datei enthält kein gültiges Plan-JSON.'):error.message,true);}
});
function fileName(extension){return (state.title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]+/g,'-').replace(/^-|-$/g,'')||'hive-plan')+'.'+extension;}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function savePlan(){const valid=W.saveFile(workspace);download(new Blob([JSON.stringify(valid,null,2)],{type:'application/json'}),fileName('json'));dirty=false;renderControls();toast(t('Alle Varianten gespeichert. Beim Öffnen wird auch die aktive Season und das aktive Layout wiederhergestellt.'));}
$('save-plan').addEventListener('click',()=>safely(savePlan));
function csvExport(){
 const protect=value=>{let s=String(value??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const s4=M.isSeason4(state),rows=[[t('Allianz'),t('Spieler / Element'),t('Typ'),t('Platz'),'X','Y',t('Gruppe'),t('Priority'),t('Prioritätsbezeichnung'),...(s4?[t('Beacon'),t('Elektriker')]:[])]];
 for(const o of state.objects.filter(o=>o.type!=='terrain').sort((a,b)=>M.allianceOf(a)-M.allianceOf(b)||(a.slot??1e6)-(b.slot??1e6))){const q=M.displayCoords(state,o);const g=M.groupForPlayer(state,o.playerId);rows.push([allianceName(M.allianceOf(o)),M.objectLabel(state,o),typeName(o),o.slot??'',q.x,q.y,g?groupName(g.id):'',o.playerId?M.priorityOf(M.playerFor(state,o)):'',o.playerId?M.priorityLabel(state,M.priorityOf(M.playerFor(state,o)),M.allianceOf(o)):'',...(s4?[o.beacon??'',o.beacon?o.electricians:'']:[])]);}
 return '\uFEFF'+rows.map(r=>r.map(protect).join(';')).join('\r\n');
}
function exportTextSize(text,width,size){metrics.font='100px system-ui, sans-serif';return Math.min(size,width/Math.max(.01,metrics.measureText(text).width/100));}
function exportSvg(){
 const b=M.bounds({...state,objects:state.objects.filter(o=>Q.visible(state,o,true))}),w=Math.max(b.right-b.left+8,36),h=Math.max(b.top-b.bottom+15,36),left=(b.left+b.right-w)/2,top=-b.top-9,scale=Math.min(80,5800/Math.max(w,h));
 const bases=state.objects.filter(o=>o.type==='base'),assigned=bases.filter(o=>o.playerId).length;
 const summary=t('{assigned} / {total} Plätze vergeben · {name} X {x} / Y {y}',{assigned,total:bases.length,name:referenceName(),...M.referenceCoords(state)});
 const legend=t(M.isSeason4(state)?'Basis 3 × 3 · Zentrum 9 × 9 · Koordinaten: Objektzentrum · Welt 1000 × 1000':'Basis 3 × 3 · Marshall 3 × 3 · Koordinaten: Objektzentrum · Welt 1000 × 1000');
 const footnote=(M.isSeason4(state)?t(state.showLight?'Lichtflächen gemäß eingestellter Breite. L4-Standard: 25 × 25 Kartenfelder.':'Lichtflächen ausgeblendet.')+' · ':'')+t('Erstellt {date}',{date:new Date().toLocaleDateString(I.language)});
 const allianceLegend=[1,2,3,4,5].map((id,i)=>`<text x="${left+2+i*(w-4)/5}" y="${top+h-3.7}" fill="${M.ALLIANCE_COLORS[id-1]}" font-size="${exportTextSize(allianceName(id),(w-4)/5-.3,.42)}">${esc(allianceName(id))}</text>`).join('');
 const source=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(w*scale)}" height="${Math.ceil(h*scale)}" viewBox="${left} ${top} ${w} ${h}"><style>text{font-family:system-ui,-apple-system,Segoe UI,sans-serif}</style>${definitions()}<rect x="${left}" y="${top}" width="${w}" height="${h}" fill="#0b1726"/><text x="${left+2}" y="${top+2.6}" fill="#61ddcc" font-size="${exportTextSize('NOVA HIVE PLANNER · '+seasonName()+(M.isDeveloping(state)?' · '+t('Noch in Bearbeitung'):''),w-4,.65)}" font-weight="650">NOVA HIVE PLANNER · ${esc(seasonName())}${M.isDeveloping(state)?' · '+t('Noch in Bearbeitung'):''}</text><text x="${left+2}" y="${top+4.8}" fill="#eef7ff" font-size="${Math.min(1.4,(w-4)/(Math.max(1,state.title.length)*.65))}" font-weight="750">${esc(state.title)}</text><text x="${left+2}" y="${top+6.4}" fill="#9db9cc" font-size="${exportTextSize(summary,w-4,.55)}">${esc(summary)}</text><rect x="${left+1}" y="${top+8}" width="${w-2}" height="${h-12}" fill="url(#big-grid)"/><g clip-path="url(#world-clip)">${scene(true)}</g>${allianceLegend}<text x="${left+2}" y="${top+h-2.6}" font-size="${exportTextSize(legend,w-4,.52)}" fill="#b5ccda">${esc(legend)}</text><text x="${left+2}" y="${top+h-1.3}" font-size="${exportTextSize(footnote,w-4,.44)}" fill="#7896ac">${esc(footnote)}</text></svg>`;
 return {source:T.svg(source),width:Math.ceil(w*scale),height:Math.ceil(h*scale)};
}
async function exportFile(format){
 try{
  document.querySelector('.export-menu').open=false;
  if(format==='csv'){download(new Blob([csvExport()],{type:'text/csv;charset=utf-8'}),fileName('csv'));toast(t('Koordinatenliste heruntergeladen.'));return;}
  const data=exportSvg(),blob=new Blob([data.source],{type:'image/svg+xml;charset=utf-8'});
  if(format==='svg'){download(blob,fileName('svg'));toast(t('Plan als SVG heruntergeladen.'));return;}
  toast(t('PNG-Bild wird vorbereitet …'));
  const url=URL.createObjectURL(blob),img=new Image();
  try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error(t('Das Plan-Bild konnte nicht erstellt werden. Bitte SVG verwenden.')));img.src=url;});const canvas=document.createElement('canvas');canvas.width=data.width;canvas.height=data.height;const ctx=canvas.getContext('2d');if(!ctx)throw new Error(t('PNG-Export ist in diesem Browser nicht verfügbar.'));ctx.drawImage(img,0,0);const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!png)throw new Error(t('PNG konnte nicht erstellt werden. Bitte SVG verwenden.'));download(png,fileName('png'));toast(t('Plan als PNG heruntergeladen.'));}finally{URL.revokeObjectURL(url);}
 }catch(error){toast(error.message,true);}
}
document.querySelectorAll('[data-export]').forEach(b=>b.addEventListener('click',()=>exportFile(b.dataset.export)));
document.addEventListener('keydown',e=>{
 const editing=!!e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable=false])'),inDialog=!!e.target.closest('dialog[open]');
 if(e.key==='Escape'&&!inDialog){if(organizerOpen){setOrganizer(false);return;}resetMapTools(true);$('drag-ghost').hidden=true;render();return;}
 if(inDialog)return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();document.activeElement.blur();safely(savePlan);return;}
 if(editing||e.defaultPrevented)return;
 if(!organizerOpen&&!drag&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.repeat&&!e.isComposing&&!e.defaultPrevented){
  const type=TOOL_SHORTCUTS[e.key.toLowerCase()];
  if(type){e.preventDefault();armObject(type);if(pending?.kind==='object')previewAt(lastPoint);return;}
 }
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();restoreHistory(e.shiftKey?'redo':'undo');return;}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();restoreHistory('redo');return;}
 if(organizerOpen)return;
 if((e.ctrlKey||e.metaKey)&&['c','v','d'].includes(e.key.toLowerCase())){e.preventDefault();safely(()=>{if(e.key.toLowerCase()==='c')copySelection();else if(e.key.toLowerCase()==='v')beginPaste();else duplicateSelection();});return;}
 if(e.key.toLowerCase()==='f'){e.preventDefault();fitSelection();return;}
 if((e.key==='Delete'||e.key==='Backspace')&&selected()){e.preventDefault();safely(()=>commit(M.removeObjects(state,[...selectedObjectIds],selectionScope)));return;}
 const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};
 const fillHandle=e.target.closest('[data-fill-resize]');
 if(directions[e.key]&&fillHandle&&fillArea&&mapMode==='fill'&&!drag){
  e.preventDefault();const corner=fillHandle.dataset.fillResize,step=e.shiftKey?5:1,[dx,dy]=directions[e.key],x=(corner.endsWith('e')?fillArea.right:fillArea.left)+dx*step,y=(corner.startsWith('n')?fillArea.top:fillArea.bottom)+dy*step;
  fillArea=resizeFillArea(fillArea,corner,{x,y});safely(refreshFillPreview);renderFillControls();renderMap();svg.querySelector(`[data-fill-resize="${corner}"]`)?.focus({preventScroll:true});return;
 }
 if(directions[e.key]&&selected()){
  e.preventDefault();const o=selected(),step=e.shiftKey?5:1,[dx,dy]=directions[e.key],handle=e.target.closest('[data-resize]');
  if(handle&&M.resizable(o)&&selectedObjectIds.size===1){const corner=handle.dataset.resize,r=M.rect(o),x=(corner.endsWith('e')?r.right:r.left)+dx*step,y=(corner.startsWith('n')?r.top:r.bottom)+dy*step;safely(()=>commit(M.resizeTerrain(state,o.id,corner,x,y)));svg.querySelector(`[data-resize="${corner}"]`)?.focus({preventScroll:true});}
  else safely(()=>moveSelection(dx*step,dy*step));
 }
});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
new ResizeObserver(()=>{updateView();renderMap();}).observe(stage);
function applyLanguage(previousLabel){
 const drafts=Array.from(document.querySelectorAll('#anchor-form input,#inspector input,#plan-title')).filter(el=>el.id!=='object-name-edit'||el.value!==previousLabel).map(el=>({id:el.id,value:el.value,checked:el.checked}));
 I.apply(document);$('language-select').value=I.language;$('toast').hidden=true;
 render();renderNamesPreview();
 for(const draft of drafts){const el=$(draft.id);if(el){el.value=draft.value;el.checked=draft.checked;el.setCustomValidity?.('');}}
}
$('language-select').addEventListener('change',e=>{const previousLabel=selected()?M.objectLabel(state,selected()):null;if(I.setLanguage(e.target.value))applyLanguage(previousLabel);});
document.addEventListener('invalid',e=>{const el=e.target;if(!el.setCustomValidity)return;el.setCustomValidity('');el.setCustomValidity(t(el.validity.valueMissing?'Bitte dieses Feld ausfüllen.':'Bitte einen gültigen Wert eingeben.'));},true);
document.addEventListener('input',e=>e.target.setCustomValidity?.(''));
globalThis.HiveArchiveBridge={getWorkspace:()=>W.saveFile(workspace),isDirty:()=>dirty,markSaved:()=>{dirty=false;renderControls();},load:raw=>{const next=W.readFile(raw);resetMapTools(true);commitWorkspace(next);dirty=false;render();fitMap();},confirm:action=>{if(dirty)confirm(t('Gespeicherte Karte laden?'),t('Nicht gespeicherte Änderungen werden ersetzt.'),action);else action();},requestConfirm:confirm,toast};
T.init('theme-select',renderMap);initQoL();
I.apply(document);$('language-select').value=I.language;render();requestAnimationFrame(fitMap);
// Optional structured tools use exactly the same state and actions as the visible planner.
const context=document.modelContext;
if(context?.registerTool){
 const life=new AbortController();window.addEventListener('pagehide',()=>life.abort(),{once:true});
 const register=tool=>{try{void Promise.resolve(context.registerTool(tool,{signal:life.signal})).catch(()=>{});}catch{}};
 register({name:'read_hive_plan',title:'Hive-Plan lesen',description:'Returns the current players, placements and calculated coordinates.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(){return {title:state.title,season:state.season,layout:state.layout,variantCount:workspace.variants.length,groups:state.groups,priorityLabels:state.priorityLabels,alliancePriorityLabels:state.alliancePriorityLabels??{},origin:state.origin,activeAlliance:M.activeAlliance(state),players:state.players,objects:state.objects.map(o=>({...o,name:M.objectLabel(state,o),coordinates:M.displayCoords(state,o),coordinateReference:'object-center'}))};}});
 register({name:'add_hive_players',title:'Spieler hinzufügen',description:'Adds names to the player list. Existing names are preserved and duplicates skipped.',inputSchema:{type:'object',properties:{names:{type:'array',items:{type:'string',minLength:1,maxLength:80},minItems:1,maxItems:300}},required:['names'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute(input){if(!input||!Array.isArray(input.names)||!input.names.length||input.names.length>300||input.names.some(n=>typeof n!=='string'||!n.trim()||n.includes('\n')||n.length>80))throw new Error(t('Ungültige oder doppelte Spieler.'));const r=M.addPlayers(state,input.names.join('\n'));commit(r.state);return {added:r.added,skipped:r.skipped,total:M.alliancePlayers(state).length};}});
 register({name:'set_hive_center_coordinates',title:'Zentrumskoordinaten setzen',description:'Aligns only the active alliance using the center of its reference (Alliance Center or Marshall). Every object must remain within the 1000 by 1000 world.',inputSchema:{type:'object',properties:{x:{type:'integer',minimum:0,maximum:999},y:{type:'integer',minimum:0,maximum:999}},required:['x','y'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input)throw new Error(t('Bitte gültige Koordinaten eingeben.'));commit(M.setOrigin(state,input.x,input.y));return {origin:state.origin};}});
 register({name:'assign_hive_players',title:'Spieler auf freie Plätze setzen',description:'Assigns existing players to existing empty bases in one batch. Fails atomically if any assignment is invalid.',inputSchema:{type:'object',properties:{assignments:{type:'array',items:{type:'object',properties:{playerId:{type:'string'},baseId:{type:'string'}},required:['playerId','baseId'],additionalProperties:false},minItems:1,maxItems:300}},required:['assignments'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute(input){if(!input||!Array.isArray(input.assignments)||!input.assignments.length||input.assignments.length>300)throw new Error(t('Eine Spielerzuweisung ist ungültig oder doppelt.'));let next=state;const ids=new Set();for(const a of input.assignments){if(!a||ids.has(a.playerId))throw new Error(t('Eine Spielerzuweisung ist ungültig oder doppelt.'));ids.add(a.playerId);next=M.assign(next,a.playerId,a.baseId);}commit(next);return {assigned:input.assignments.length};}});
}
function filterMapLabels(source){const v=Q.view(state);return source.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g,(whole,attrs,body)=>{if(!v.names&&/class="map-name"/.test(attrs))return '';if(!v.coordinates&&/(?:^|>)X\s|(?:^|>)Y\s|· X\s/.test(body))return '';return whole;});}
function fitObjects(objects){if(!objects.length)return;const b=M.objectBounds(objects),r=stage.getBoundingClientRect();camera.x=(b.left+b.right)/2;camera.y=-(b.bottom+b.top)/2;camera.scale=Math.max(worldFitScale(),Math.min((r.width-60)/(b.right-b.left+6),(r.height-60)/(b.top-b.bottom+6),70));renderMap();}
function fitSelection(){fitObjects(selectedObjects());}
function revealObject(id){const o=state.objects.find(o=>o.id===id);if(!o)return;resetMapTools();const v=Q.view(state);if(!Q.visible(state,o)){v.alliances=[...new Set([...v.alliances,M.allianceOf(o)])];if(o.type==='note')v.notes=true;if(o.type==='missile')v.missiles=true;commit({...M.clone(state),viewOptions:v});}selectObject(id);highlightObject=id;fitObjects(M.terrainParts(state,o));}
function copySelection(){clipboardPlan=Q.capture(state,[...selectedObjectIds]);renderQoL();toast(t('Auswahl kopiert. Spielerzuweisungen werden nicht kopiert.'));}
function beginPaste(plan=clipboardPlan){if(!plan)throw Error(t('Zuerst eine Auswahl kopieren.'));const destination=$('paste-alliance').value;resetMapTools(true);pasteObjects=Q.prepareCopies(plan,destination==='active'?M.activeAlliance(state):null);previewCopies(lastPoint);render();toast(t('Auf die Karte klicken, um die Kopie zu platzieren. Esc bricht ab.'));}
function duplicateSelection(){clipboardPlan=Q.capture(state,[...selectedObjectIds]);beginPaste(clipboardPlan);}
function previewCopies(point){if(!pasteObjects)return;const b=M.objectBounds(pasteObjects),dx=Math.round(point.x-(b.left+b.right)/2),dy=Math.round(point.y-(b.bottom+b.top)/2);ghost={copies:pasteObjects.map(o=>({...o,x:o.x+dx,y:o.y+dy})),invalid:false};try{Q.pasteAt(state,pasteObjects,point.x,point.y);}catch(e){ghost.invalid=true;ghost.reason=e.message;}}
function placeCopies(point){const r=Q.pasteAt(state,pasteObjects,point.x,point.y);resetMapTools(true);selectionScope='all';setMapSelection(r.ids);selectedObjectIds=new Set(r.ids);selectedId=r.ids[0];commit(r.state,t('Kopie platziert.'));}
function previewArrange(){const entries=Q.arrange(state,[...selectedObjectIds],$('arrange-mode').value,Number($('arrange-gap').value));arrangement={entries,error:null};try{M.moveObjects(state,entries,selectionScope);}catch(e){arrangement.error=e.message;}$('arrange-status').textContent=arrangement.error||t('Vorschau bereit. Mit Übernehmen bestätigen.');$('arrange-apply').disabled=!!arrangement.error;renderMap();}
function runHiveCheck(){if(shellEnabled())$('check-drawer').open=true;checkResult=Q.audit(state,checkArea);renderCheck();renderMap();}
function focusCheck(x,y,w=3,h=3){highlightObject={x,y,w,h};fitObjects([highlightObject]);}
function qolOverlay(exporting){if(exporting)return '';let s='';const outline=(o,color,width=.2)=>`<rect x="${o.x-o.w/2}" y="${-o.y-o.h/2}" width="${o.w}" height="${o.h}" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-width="${width}" pointer-events="none"/>`;
 if(highlightObject){const o=typeof highlightObject==='string'?state.objects.find(o=>o.id===highlightObject):highlightObject;if(o&&(typeof highlightObject!=='string'||Q.visible(state,o)))s+=outline({...o,w:o.w+.5,h:o.h+.5},'#ffd56a');}
 if(checkArea)s+=outline({x:(checkArea.left+checkArea.right)/2,y:(checkArea.bottom+checkArea.top)/2,w:checkArea.right-checkArea.left,h:checkArea.top-checkArea.bottom},'#ecad61',.1);
 if(checkResult)for(const o of checkResult.landings)s+=outline(o,'#ff7474',.07);
 if(arrangement)for(const e of arrangement.entries){const o=state.objects.find(o=>o.id===e.id);s+=outline({...o,...e},arrangement.error?'#ff7474':'#78e6ba');}
 if(ghost?.copies){s+=`<g opacity=".65" pointer-events="none">${ghost.copies.map(o=>objectSvg(o,true)+outline(o,ghost.invalid?'#ff7474':'#78e6ba')).join('')}</g>`;if(ghost.reason)s+=`<text x="${lastPoint.x}" y="${-lastPoint.y-3}" font-size=".65" text-anchor="middle" fill="#ffaaa5">${esc(ghost.reason)}</text>`;}
 if(ghost?.invalid){const candidates=ghost.objects??(ghost.o?[ghost.o]:ghost.copies??[]),ignored=new Set(candidates.map(o=>o.id));for(const o of candidates){const hit=M.collision(state,o,ignored);if(hit){s+=outline(hit,'#ff5050',.3);s+=`<text x="${hit.x}" y="${-hit.y-hit.h/2-.5}" text-anchor="middle" font-size=".55" fill="#ffb4ac">${esc(M.objectLabel(state,hit))} · ${esc(allianceName(M.allianceOf(hit)))}</text>`;}}}
 return s;
}
function recoveryKey(){return 'nova-hive-workspace-recovery-v1';}
function saveRecovery(){if(!recoveryInitialized)return;try{if(!globalThis.localStorage)return;localStorage.setItem(recoveryKey(),JSON.stringify({date:new Date().toISOString(),workspace}));$('recovery-info').textContent=t('Arbeitsstand in diesem Browser gesichert.');}catch{$('recovery-info').textContent=t('Automatische Sicherung nicht möglich. Bitte Plan als Datei speichern.');}}
function scheduleRecovery(){clearTimeout(recoveryTimer);recoveryTimer=setTimeout(saveRecovery,500);}
function restoreRecovery(){try{const raw=globalThis.localStorage?.getItem(recoveryKey());if(raw){const data=JSON.parse(raw),saved=W.readFile(data.workspace);workspace=saved;state=W.activePlan(saved);dirty=true;$('recovery-status').hidden=false;$('recovery-status').innerHTML=`${h('Letzter Arbeitsstand wiederhergestellt.')} <button id="dismiss-recovery">${h('Schließen')}</button>`;$('dismiss-recovery').addEventListener('click',()=>{$('recovery-status').hidden=true;});}}catch{$('recovery-info').textContent=t('Automatische Sicherung konnte nicht geladen werden.');}recoveryInitialized=true;}
function renderObjectTree(){const query=$('object-search').value.trim().normalize('NFC').toLocaleLowerCase(),list=$('object-tree'),open=new Set(Array.from(list.querySelectorAll('details[open]')).map(e=>e.dataset.fold)),scroll=list.scrollTop;let html='';for(let alliance=1;alliance<=5;alliance++){const objects=state.objects.filter(o=>M.allianceOf(o)===alliance&&(!query||(M.objectLabel(state,o)+' '+(M.playerFor(state,o)?.name??'')).toLocaleLowerCase().includes(query)));if(!objects.length)continue;html+=`<details data-fold="${alliance}" ${query||open.has(String(alliance))?'open':''}><summary>${esc(allianceName(alliance))} · ${objects.length}</summary>`;for(const type of ['center','marshall','base','terrain','stronghold','city','missile','note']){const items=objects.filter(o=>o.type===type);if(!items.length)continue;html+=`<details data-fold="${alliance}-${type}" ${query||open.has(alliance+'-'+type)?'open':''}><summary>${type==='base'?h('Basen'):esc(typeName(items[0]))} · ${items.length}</summary>`+items.map(o=>{const q=M.displayCoords(state,o);return `<div class="object-tree-row"><input type="checkbox" data-tree-select="${esc(o.id)}" aria-label="${h('{name} auswählen',{name:M.objectLabel(state,o)})}" ${selectedObjectIds.has(o.id)?'checked':''}><button data-reveal="${esc(o.id)}"><strong>${esc(M.objectLabel(state,o))}</strong><small>X ${q.x} / Y ${q.y}${Q.visible(state,o)?'':' · '+h('Ausgeblendet')}</small></button><button data-rename="${esc(o.id)}" title="${h('Umbenennen')}">✎</button><button data-lock="${esc(o.id)}" title="${h(o.locked?'Entsperren':'Sperren')}">${o.locked?'🔒':'🔓'}</button></div>`;}).join('')+'</details>';}html+='</details>';}list.innerHTML=html||`<p>${h('Keine Treffer.')}</p>`;list.scrollTop=scroll;}
function renderSavedGroups(){const groups=[...new Set(state.objects.map(o=>o.selectionGroup).filter(Boolean))];$('object-groups').innerHTML=groups.map(name=>`<div class="qol-row"><button data-object-group="${esc(name)}">${esc(name)}</button><button data-delete-group="${esc(name)}" aria-label="${h('Gruppe auflösen')}">×</button></div>`).join('')||`<p class="field-help">${h('Noch keine Objektgruppen.')}</p>`;}
function renderBlueprints(){ $('blueprint-list').innerHTML=(state.blueprints??[]).map(b=>`<div class="qol-row"><button data-blueprint="${esc(b.id)}">${esc(b.name)} · ${b.plan.objects.length}</button><button data-blueprint-delete="${esc(b.id)}" aria-label="${h('Entfernen')}">×</button></div>`).join('')||`<p class="field-help">${h('Noch keine Bausteine.')}</p>`;}
function renderCheck(){const el=$('check-results');if(!checkResult){el.innerHTML='';return;}const r=checkResult;let html=`<p>${checkArea?h('Freie 3×3-Positionen: {n}',{n:r.totalLandings}):h('Prüfbereich zeichnen')}${r.totalLandings>200?' · '+h('Erste 200 Positionen angezeigt.'):''}</p>`;
 const positions=r.landings.map(o=>{const q=M.coords(state,o);return `<button data-check-x="${o.x}" data-check-y="${o.y}">X ${q.x} / Y ${q.y}</button>`;}).join('');html+=`<details><summary>${h('Landeflächen')}</summary><div class="check-list">${positions}</div></details>`;
 for(const [key,label] of [['full','Vollständig im Licht'],['partial','Teilweise im Licht'],['outside','Außerhalb des Lichts'],['empty','Freie Plätze']]){if(!M.isSeason4(state)&&['full','partial','outside'].includes(key))continue;html+=`<details><summary>${h(label)} · ${r[key].length}</summary><div class="check-list">${r[key].map(o=>`<button data-reveal="${esc(o.id)}">${esc(M.objectLabel(state,o))} · ${esc(allianceName(M.allianceOf(o)))}</button>`).join('')}</div></details>`;}
 html+=`<details><summary>${h('Spieler ohne Platz')} · ${r.unassigned.length}</summary><div class="check-list">${r.unassigned.map(p=>`<button data-unassigned="${esc(p.id)}">${esc(p.name)} · ${esc(allianceName(M.allianceOf(p)))}</button>`).join('')}</div></details>`;el.innerHTML=html;
}
function renderQoL(){if(!qolInitialized)return;const objects=selectedObjects();for(const id of ['qol-copy','qol-duplicate','qol-lock','qol-unlock','save-object-group','save-blueprint'])$(id).disabled=!objects.length;$('qol-paste').disabled=!clipboardPlan;$('qol-swap').disabled=objects.length!==2||objects.some(o=>o.type!=='base')||M.allianceOf(objects[0])!==M.allianceOf(objects[1]);$('arrange-preview').disabled=objects.length<2;$('arrange-apply').disabled=!arrangement||!!arrangement.error;$('fit-selection').disabled=!objects.length;
 const v=Q.view(state);for(const key of ['names','coordinates','notes','missiles','exportNotes'])$('view-'+key).checked=v[key];for(let a=1;a<=5;a++)$('view-alliance-'+a).checked=v.alliances.includes(a);$('selection-filter').value=selectionFilter;
 renderObjectTree();renderSavedGroups();renderBlueprints();renderCheck();renderShellState();}
function promptName(title,action,initial=''){$('qol-name-title').textContent=title;$('qol-name-input').value=initial;nameAction=action;$('qol-name-dialog').showModal();$('qol-name-input').focus();}
function initQoL(){
 beforeQoLRebuild();
 $('qol-panel').innerHTML=`<details class="settings-section" open><summary>${h('Auswahlaktionen')}</summary><div class="qol-actions"><button id="qol-lock">${h('Sperren')}</button><button id="qol-unlock">${h('Entsperren')}</button><button id="qol-copy" title="Ctrl/Cmd+C">${h('Kopieren')}</button><button id="qol-paste" title="Ctrl/Cmd+V">${h('Einfügen')}</button><button id="qol-duplicate" title="Ctrl/Cmd+D">${h('Duplizieren')}</button><button id="qol-swap">${h('Spielerplätze tauschen')}</button></div><label>${h('Kopien zuordnen')}<select id="paste-alliance"><option value="keep">${h('Allianzen beibehalten')}</option><option value="active">${h('Aktuelle Allianz')}</option></select></label><p class="field-help">${h('Kopien enthalten keine Spielerzuweisungen. Zentrum und Marshall: höchstens eines je Allianz.')}</p><details><summary>${h('Ausrichten und verteilen')}</summary><select id="arrange-mode"><option value="row">${h('Horizontale Reihe')}</option><option value="column">${h('Vertikale Reihe')}</option><option value="alignX">${h('Gleiche X-Koordinate')}</option><option value="alignY">${h('Gleiche Y-Koordinate')}</option></select><label>${h('Abstand zwischen Außenkanten')}<select id="arrange-gap"><option>0</option><option selected>1</option><option>2</option></select></label><div class="qol-actions"><button id="arrange-preview">${h('Vorschau')}</button><button id="arrange-apply" disabled>${h('Übernehmen')}</button><button id="arrange-cancel">${h('Abbrechen')}</button></div><p id="arrange-status" class="field-help"></p></details></details>
 <details class="settings-section"><summary>${h('Objektübersicht und Suche')}</summary><input id="object-search" aria-label="${h('Spieler oder Objekt suchen')}" placeholder="${h('Spieler oder Objekt suchen')}"><div id="object-tree" class="object-tree"></div><form id="goto-form"><h3>${h('Koordinaten anspringen')}</h3><div class="inline-fields"><label>X<input id="goto-x" type="number" min="0" max="999" step="1" required></label><label>Y<input id="goto-y" type="number" min="0" max="999" step="1" required></label></div><button>${h('Anzeigen')}</button></form></details>
 <details class="settings-section"><summary>${h('Anzeige')}</summary>${['names','coordinates','notes','missiles','exportNotes'].map((key,i)=>`<label class="check-label"><input id="view-${key}" type="checkbox" data-view="${key}" checked>${h(['Namen anzeigen','Koordinaten anzeigen','Notizen anzeigen','Raketenflächen anzeigen','Notizen exportieren'][i])}</label>`).join('')}${[1,2,3,4,5].map(a=>`<label class="check-label"><input id="view-alliance-${a}" type="checkbox" data-view-alliance="${a}" checked>${esc(allianceName(a))}</label>`).join('')}<p class="field-help">${h('Ausgeblendete Objekte blockieren weiterhin. Anzeige gilt auch für Viewer und Bildexport.')}</p></details>
 <details class="settings-section"><summary>${h('Objektgruppen')}</summary><button id="save-object-group">${h('Auswahl als Objektgruppe speichern')}</button><div id="object-groups"></div></details>
 <details class="settings-section"><summary>${h('Bausteine')}</summary><button id="save-blueprint">${h('Auswahl als Baustein speichern')}</button><div id="blueprint-list"></div><div class="qol-actions"><button id="export-blueprints">${h('Bausteine exportieren')}</button><button id="import-blueprints">${h('Bausteine importieren')}</button></div><input id="blueprint-file" type="file" accept=".json" hidden><p class="field-help">${h('Bausteine werden mit dem Plan gespeichert. Export und Import übertragen sie in andere Karten.')}</p></details>
 <details id="check-panel" class="settings-section"><summary>${h('Hive prüfen')}</summary><div class="qol-actions"><button id="draw-check-area">${h('Prüfbereich zeichnen')}</button><button id="check-selection">${h('Auswahl als Prüfbereich')}</button><button id="run-check">${h('Prüfung starten')}</button><button id="clear-check">${h('Markierungen entfernen')}</button></div><p class="field-help">${h('Prüft freie 3×3-Flächen im gewählten Rechteck, Lichtabdeckung und Belegung aller Allianzen. Terrain und feste Kerne blockieren; Schlamm, Notizen und Raketenflächen nicht. Licht wird je Allianz geometrisch geprüft. Keine Prüfung weiterer Spielregeln.')}</p><div id="check-results"></div></details><p id="recovery-info" class="field-help"></p>`;
 if(!$('qol-name-dialog')){const d=document.createElement('dialog');d.id='qol-name-dialog';d.innerHTML=`<form id="qol-name-form"><h2 id="qol-name-title"></h2><input id="qol-name-input" maxlength="80" required aria-label="${h('Name')}"><div class="dialog-footer"><button type="button" id="qol-name-cancel">${h('Abbrechen')}</button><button type="submit">${h('Speichern')}</button></div></form>`;document.body.append(d);}
 if(!qolInitialized)$('qol-name-cancel').addEventListener('click',()=>$('qol-name-dialog').close());if(!qolInitialized)$('qol-name-form').addEventListener('submit',e=>{e.preventDefault();safely(()=>{const name=$('qol-name-input').value.trim();if(!name)return;nameAction?.(name);$('qol-name-dialog').close();});});
 $('qol-name-cancel').textContent=t('Abbrechen');$('qol-name-form').querySelector('[type=submit]').textContent=t('Speichern');$('qol-name-input').setAttribute('aria-label',t('Name'));
 $('object-search').addEventListener('input',renderObjectTree);
 if(!qolInitialized)$('selection-filter').addEventListener('change',e=>{selectionFilter=e.target.value;setMapSelection(selectedObjects().filter(selectionMatches).map(o=>o.id),selectedId);render();});
 if(!qolInitialized)$('fit-selection').addEventListener('click',fitSelection);
 $('goto-form').addEventListener('submit',e=>{e.preventDefault();safely(()=>{const x=Number($('goto-x').value),y=Number($('goto-y').value);if(!$('goto-x').value||!$('goto-y').value||![x,y].every(n=>Number.isInteger(n)&&n>=0&&n<=999))throw Error(t('X und Y müssen ganze Zahlen von 0 bis 999 sein.'));focusCheck(state.origin.mapX+x-state.origin.x,state.origin.mapY+y-state.origin.y,1,1);});});
 if(!qolInitialized)(shellEnabled()?document:$('qol-panel')).addEventListener('change',e=>safely(()=>{const d=e.target.dataset;if(d.view){commit({...M.clone(state),viewOptions:{...Q.view(state),[d.view]:e.target.checked}});}if(d.viewAlliance){const v=Q.view(state),a=Number(d.viewAlliance);v.alliances=e.target.checked?[...new Set([...v.alliances,a])]:v.alliances.filter(x=>x!==a);commit({...M.clone(state),viewOptions:v});}if(d.treeSelect){selectionScope='all';const ids=new Set(selectedObjectIds);if(e.target.checked)ids.add(d.treeSelect);else ids.delete(d.treeSelect);setMapSelection([...ids],d.treeSelect);activateSelectionAlliance();render();}}));
 if(!qolInitialized)(shellEnabled()?document:$('qol-panel')).addEventListener('click',e=>safely(()=>{const el=e.target.closest('button');if(!el||el.disabled)return;const d=el.dataset,id=el.id;
 if(d.reveal)return revealObject(d.reveal);if(d.lock)return commit(Q.setLocked(state,[d.lock],!state.objects.find(o=>o.id===d.lock).locked,'all'));
 if(d.rename){const o=state.objects.find(o=>o.id===d.rename);return promptName(t('Umbenennen'),name=>{const a=M.activeAlliance(state);commit(M.setAlliance(M.updateObject(M.setAlliance(state,M.allianceOf(o)),o.id,{name}),a));},M.objectLabel(state,o));}
 if(d.objectGroup){selectionScope='all';selectionFilter='all';const objects=state.objects.filter(o=>o.selectionGroup===d.objectGroup);setMapSelection(objects.map(o=>o.id));activateSelectionAlliance();render();return fitSelection();}
 if(d.deleteGroup)return commit(Q.setGroup(state,state.objects.filter(o=>o.selectionGroup===d.deleteGroup).map(o=>o.id),''));
 if(d.blueprint)return beginPaste(state.blueprints.find(b=>b.id===d.blueprint).plan);
 if(d.blueprintDelete)return commit({...M.clone(state),blueprints:state.blueprints.filter(b=>b.id!==d.blueprintDelete)});
 if(d.checkX!==undefined)return focusCheck(Number(d.checkX),Number(d.checkY));
 if(d.unassigned){const p=state.players.find(p=>p.id===d.unassigned);activateAlliance(M.allianceOf(p));return focusPlayer(p.id);}
 if(id==='qol-copy')return copySelection();if(id==='qol-paste')return beginPaste();if(id==='qol-duplicate')return duplicateSelection();
 if(id==='qol-lock'||id==='qol-unlock')return commit(Q.setLocked(state,[...selectedObjectIds],id==='qol-lock',selectionScope));
 if(id==='qol-swap')return commit(Q.swap(state,[...selectedObjectIds]));
 if(id==='arrange-preview')return previewArrange();if(id==='arrange-apply'&&arrangement&&!arrangement.error)return commit(M.moveObjects(state,arrangement.entries,selectionScope));if(id==='arrange-cancel'){arrangement=null;$('arrange-status').textContent='';render();return;}
 if(id==='save-object-group')return promptName(t('Objektgruppe benennen'),name=>commit(Q.setGroup(state,[...selectedObjectIds],name)));
 if(id==='save-blueprint')return promptName(t('Baustein benennen'),name=>{if((state.blueprints??[]).length>=30)throw Error(t('Maximal 30 Bausteine.'));commit({...M.clone(state),blueprints:[...(state.blueprints??[]),{id:M.uid('blueprint'),name,plan:Q.capture(state,[...selectedObjectIds])}]});});
 if(id==='export-blueprints')return download(new Blob([JSON.stringify({schema:'nova-hive-blueprints',version:1,blueprints:state.blueprints??[]})],{type:'application/json'}),'nova-bausteine.json');
 if(id==='import-blueprints')return $('blueprint-file').click();
 if(id==='draw-check-area'){resetMapTools();checkResult=null;mapMode='check';$('check-panel').open=true;if(shellEnabled())$('check-drawer').open=true;toast(t('Rechteck für die Prüfung aufziehen.'));render();return;}
 if(id==='check-selection'){if(!selectedObjects().length)throw Error(t('Keine Elemente zum Verschieben ausgewählt.'));checkArea=M.objectBounds(selectedObjects());return runHiveCheck();}
 if(id==='run-check')return runHiveCheck();if(id==='clear-check'){checkArea=null;checkResult=null;highlightObject=null;render();}
 }));
 $('blueprint-file').addEventListener('change',async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{if(file.size>W.MAX_FILE_BYTES)throw Error(t('Ungültiger Baustein.'));const data=JSON.parse(await file.text());if(data.schema!=='nova-hive-blueprints'||data.version!==1||!Array.isArray(data.blueprints))throw Error(t('Ungültiger Baustein.'));const items=data.blueprints.map(b=>({...b,id:M.uid('blueprint')})),next=M.validate({...state,blueprints:[...(state.blueprints??[]),...items]});commit(next);}catch(e){toast(e.message,true);}});
 if(!qolInitialized){window.addEventListener('pagehide',saveRecovery);$('language-select').addEventListener('change',()=>{initQoL();renderQoL();});restoreRecovery();}qolInitialized=true;mountQoL();
}

// Stable editor chrome is UI state only; it never changes the workspace or undo history.
function shellEnabled(){return document.body.hasAttribute?.('data-editor-shell')===true;}
function shellTab(kind,value,focus=false){
 editorUI[kind]=value;const attr=kind==='left'?'leftTab':'inspectorTab';
 document.querySelectorAll(`[data-${kind==='left'?'left-tab':'inspector-tab'}]`).forEach(b=>{const active=b.dataset[attr]===value;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus();});
 if(kind==='left'){for(const key of ['players','objects','blueprints'])$('left-'+key).hidden=key!==value;if(value!=='players'&&organizerOpen){organizerOpen=false;renderOrganizer();renderSelection();}}
 else{document.querySelectorAll('[data-inspector-pane]').forEach(p=>p.hidden=p.dataset.inspectorPane!==value);$('inspector-actions-dock').hidden=value!=='actions';$('anchor-section').hidden=value!=='actions'||selectedObjects().length!==1||selected()?.type!==M.anchorType(state);$('inspector-apply').disabled=value!=='position'||!selectedObjects().length||selectedObjects().some(o=>o.locked);$('inspector-apply').hidden=false;$('inspector-footer-hint').textContent=value==='properties'?t('Änderungen werden direkt übernommen.'):value==='actions'?t('Aktionen gelten für die aktuelle Auswahl.'):t('Koordinaten bezeichnen den Mittelpunkt.');}
}
function initEditorShell(){
 if(!shellEnabled()||editorUI.ready)return;editorUI.ready=true;
 const wrap=document.createElement('div');wrap.id='inspector-scroll';$('inspector').before(wrap);wrap.append($('inspector'));
 const dock=document.createElement('div');dock.id='inspector-actions-dock';wrap.append(dock,$('anchor-section'));
 document.querySelectorAll('[data-left-tab],[data-inspector-tab]').forEach(button=>{const kind=button.dataset.leftTab?'left':'inspector',key=button.dataset.leftTab??button.dataset.inspectorTab;button.addEventListener('click',()=>shellTab(kind,key));button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const values=kind==='left'?['players','objects','blueprints']:['position','properties','actions'],i=values.indexOf(editorUI[kind]);shellTab(kind,e.key==='Home'?values[0]:e.key==='End'?values.at(-1):values[(i+(e.key==='ArrowRight'?1:values.length-1))%values.length],true);});});
 $('inspector-apply').addEventListener('click',()=>{$('position-form')?.requestSubmit();if(!$('position-form'))$('selection-position-form')?.requestSubmit();});
 $('new-plan').addEventListener('click',()=>confirm(t('Neuen Plan erstellen?'),t('Speichere deinen aktuellen Plan zuerst. Eine neue leere Karte wird geöffnet.'),()=>{resetMapTools(true);commitWorkspace(W.createWorkspace(M.makeLayout('empty',{season:state.season,title:t('Mein Hive')})));globalThis.HiveArchiveResetSelection?.();$('plans-menu').open=false;fitMap();}));
 $('inspector-name').addEventListener('click',()=>{const o=selected();if(selectedObjects().length!==1||!o)return;promptName(t('Umbenennen'),name=>commit(M.updateObject(state,o.id,{name})),M.objectLabel(state,o));});
 $('toggle-hive-check').addEventListener('click',()=>{$('check-drawer').open=!$('check-drawer').open;$('toggle-hive-check').setAttribute('aria-expanded',String($('check-drawer').open));});
 $('check-drawer').addEventListener('toggle',()=>$('toggle-hive-check').setAttribute('aria-expanded',String($('check-drawer').open)));
 document.addEventListener('click',e=>{for(const menu of document.querySelectorAll('.header-menu[open],.export-menu[open]'))if(!menu.contains(e.target))menu.open=false;const action=e.target.closest('[data-tool],[data-export]');if(action)action.closest('details')?.removeAttribute('open');});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.header-menu[open],.export-menu[open]').forEach(menu=>menu.open=false);});
 $('archive-viewer').addEventListener('click',()=>{if(!$('archive-name').value.trim())$('archive-name').value=state.title;});
}
function beforeQoLRebuild(){
 if(!shellEnabled())return;
 editorUI.qolValues={};for(const id of ['object-search','arrange-mode','arrange-gap','paste-alliance'])if($(id))editorUI.qolValues[id]=$(id).value;
 editorUI.folds=Array.from(document.querySelectorAll('#object-tree details[open]')).map(e=>e.dataset.fold);
 document.querySelectorAll('[data-qol-owned]').forEach(e=>e.remove());
}
function mountQoL(){
 if(!shellEnabled())return;initEditorShell();
 const parts=Array.from($('qol-panel').children),destinations=['inspector-actions-dock','left-objects','display-content','left-objects','left-blueprints','check-content','inspector-footer-hint'];
 parts.forEach((part,i)=>{part.dataset.qolOwned='true';if(part.tagName==='DETAILS'){part.open=true;part.classList.add('shell-section');}if(i===6){part.id='recovery-info';$('plans-menu').querySelector('.plans-content').append(part);}else $(destinations[i]).append(part);});
 for(const id of ['qol-lock','qol-unlock']){const b=$(id);b.dataset.qolOwned='true';$('inspector-locks').append(b);}
 for(const id of ['arrange-apply','arrange-cancel']){const b=$(id);b.dataset.qolOwned='true';$('inspector-preview-footer').append(b);}
 for(const [id,value] of Object.entries(editorUI.qolValues??{}))if($(id))$(id).value=value;
 shellTab('left',editorUI.left);shellTab('inspector',editorUI.inspector);
}
function renderInspector(){
 if(!shellEnabled()){renderInspectorContent();return;}
 const key=JSON.stringify({objects:selectedObjects(),players:state.players,origin:state.origin,season:state.season,lang:I.language,groups:state.groups,scope:selectionScope,confirmed:selectionCenterEntry,all:state.objects});
 const scroll=$('inspector-scroll')?.scrollTop??0;
 if(editorUI.inspectorKey!==key){
  const sameSelection=editorUI.selectionKey===[...selectedObjectIds].sort().join('|');
  const focusId=sameSelection?document.activeElement?.id:null;
  const drafts=sameSelection?Array.from(document.querySelectorAll('#inspector input')).filter(e=>e.dataset.draft==='true').map(e=>({id:e.id,value:e.value})):[];
  renderInspectorContent();const root=$('inspector'),form=root.querySelector('.selection-form'),children=form?Array.from(form.children):[];root.replaceChildren();
  const panes={};for(const k of ['position','properties','actions']){const pane=document.createElement('div');pane.id='inspector-pane-'+k;pane.dataset.inspectorPane=k;pane.className='selection-form inspector-pane';pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby','inspector-tab-'+k);root.append(pane);panes[k]=pane;}
  for(const child of children){const id=child.id;if(['position-form','selection-position-form','bulk-move-form'].includes(id))panes.position.append(child);else if(child.tagName==='BUTTON'||child.classList.contains('actions'))panes.actions.append(child);else panes.properties.append(child);}
  if(!selectedObjects().length){panes.position.innerHTML=`<div class="terrain-position-form"><h3>${h('Objektzentrum')}</h3><div class="inline-fields"><label>X<input disabled placeholder="—"></label><label>Y<input disabled placeholder="—"></label></div><p class="field-help">${h('Wähle eine Basis, den Marshall oder ein anderes Element auf der Karte.')}</p></div>`;panes.properties.innerHTML=`<p class="field-help">${h('Keine Auswahl')}</p>`;}
  for(const id of ['position-form','selection-position-form']){const submit=$(id)?.querySelector('[type=submit]');if(submit)submit.hidden=true;}
  for(const d of drafts){const e=$(d.id);if(e){e.value=d.value;e.dataset.draft='true';}}
  root.querySelectorAll('input').forEach(e=>e.addEventListener('input',()=>{e.dataset.draft='true';}));
  if(focusId&&$(focusId))$(focusId).focus({preventScroll:true});
  editorUI.inspectorKey=key;editorUI.selectionKey=[...selectedObjectIds].sort().join('|');
 }
 const objects=selectedObjects(),o=selected();$('inspector-name').textContent=objects.length===1?M.objectLabel(state,o):objects.length?selectionSummary():t('Keine Auswahl');$('inspector-name').disabled=objects.length!==1;
 $('selection-type').hidden=false;$('selection-type').textContent=objects.length===1?allianceName(M.allianceOf(o))+' · '+typeName(o):objects.length?selectionSummary():'—';
 shellTab('inspector',editorUI.inspector);if($('inspector-scroll'))$('inspector-scroll').scrollTop=scroll;
}
function renderShellState(){
 if(!shellEnabled())return;
 $('inspector-preview-footer').hidden=editorUI.inspector!=='actions';$('arrange-cancel').disabled=!arrangement;
 $('check-selection').disabled=!selectedObjects().length;
 for(const fold of editorUI.folds??[])document.querySelectorAll('#object-tree details').forEach(e=>{if(e.dataset.fold===fold)e.open=true;});editorUI.folds=null;
}

})();
