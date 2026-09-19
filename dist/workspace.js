/* One saved workspace contains all season/layout variants. Roster organization is shared. */
(function(root){
'use strict';
const M=root.HiveModel,SCHEMA='nova-hive-workspace',VERSION=1,LAYOUTS=['spaced','compact','empty'],MAX_FILE_BYTES=20_000_000;
const t=(key,params={})=>root.HiveI18n?.t(key,params)??key.replace(/\{(\w+)\}/g,(_,k)=>String(params[k]??'{'+k+'}'));
const key=(season,layout)=>season+':'+layout;
const variantFromPlan=plan=>M.clone({season:plan.season,layout:plan.layout,title:plan.title,origin:plan.origin,showLight:plan.showLight,objects:plan.objects});
const sharedFromPlan=plan=>M.clone({players:plan.players,groups:plan.groups,priorityLabels:plan.priorityLabels});
function activePlan(workspace){
 const variant=workspace.variants.find(v=>v.season===workspace.active.season&&v.layout===workspace.active.layout);
 if(!variant)throw new Error(t('Die aktive Variante fehlt in der Plan-Datei.'));
 return M.clone({schema:M.SCHEMA,version:M.VERSION,...variant,players:workspace.players,groups:workspace.groups,priorityLabels:workspace.priorityLabels});
}
function createWorkspace(plan=M.makeLayout()){
 const valid=M.validate(plan),variants=[];
 for(const season of M.SEASONS)for(const layout of LAYOUTS){
  const current=season===valid.season&&layout===valid.layout;
  variants.push(variantFromPlan(current?valid:M.makeLayout(layout,{season,title:valid.title,players:[],objects:[]})));
 }
 return {schema:SCHEMA,version:VERSION,planVersion:M.VERSION,active:{season:valid.season,layout:valid.layout},...sharedFromPlan(valid),variants};
}
// Never mutate stored variants: history snapshots can safely share inactive branches.
function updateWorkspace(workspace,plan){
 if(!M.SEASONS.includes(plan.season)||!LAYOUTS.includes(plan.layout))throw new Error(t('Ungültige Variante.'));
 const livePlayers=new Set(plan.players.map(p=>p.id)),current=variantFromPlan(plan);
 const variants=workspace.variants.map(v=>{
  if(v.season===plan.season&&v.layout===plan.layout)return current;
  if(!v.objects.some(o=>o.playerId&&!livePlayers.has(o.playerId)))return v;
  return {...v,objects:v.objects.map(o=>o.playerId&&!livePlayers.has(o.playerId)?{...o,playerId:null}:o)};
 });
 return {...workspace,active:{season:plan.season,layout:plan.layout},...sharedFromPlan(plan),variants};
}
function switchVariant(workspace,season,layout){
 if(!M.SEASONS.includes(season)||!LAYOUTS.includes(layout))throw new Error(t('Ungültige Variante.'));
 if(season===workspace.active.season&&layout===workspace.active.layout)return workspace;
 if(!workspace.variants.some(v=>v.season===season&&v.layout===layout))throw new Error(t('Die aktive Variante fehlt in der Plan-Datei.'));
 return {...workspace,active:{season,layout}};
}
function validateWorkspace(raw){
 if(!raw||raw.schema!==SCHEMA||raw.version!==VERSION||!Number.isInteger(raw.planVersion)||raw.planVersion<5||raw.planVersion>M.VERSION)throw new Error(t('Das ist keine unterstützte Varianten-Datei.'));
 if(!raw.active||!M.SEASONS.includes(raw.active.season)||!LAYOUTS.includes(raw.active.layout))throw new Error(t('Die aktive Variante fehlt in der Plan-Datei.'));
 if(!Array.isArray(raw.variants)||raw.variants.length!==M.SEASONS.length*LAYOUTS.length)throw new Error(t('Die Plan-Datei muss alle 21 Season- und Layout-Varianten enthalten.'));
 const seen=new Set(),variants=[];let shared=null;
 for(const v of raw.variants){
  if(!v||!M.SEASONS.includes(v.season)||!LAYOUTS.includes(v.layout)||seen.has(key(v.season,v.layout)))throw new Error(t('Eine Variante fehlt oder ist doppelt vorhanden.'));
  seen.add(key(v.season,v.layout));
  const valid=M.validate({...v,schema:M.SCHEMA,version:raw.planVersion,players:raw.players,groups:raw.groups,priorityLabels:raw.priorityLabels});
  if(!shared)shared=sharedFromPlan(valid);variants.push(variantFromPlan(valid));
 }
 if(!seen.has(key(raw.active.season,raw.active.layout)))throw new Error(t('Die aktive Variante fehlt in der Plan-Datei.'));
 return {schema:SCHEMA,version:VERSION,planVersion:M.VERSION,active:{season:raw.active.season,layout:raw.active.layout},...shared,variants};
}
function readFile(raw){
 if(raw?.schema===M.SCHEMA)return createWorkspace(M.validate(raw));
 return validateWorkspace(raw);
}
function saveFile(workspace){return {...validateWorkspace(workspace),savedAt:new Date().toISOString()};}
root.HiveWorkspace={SCHEMA,VERSION,LAYOUTS,MAX_FILE_BYTES,createWorkspace,activePlan,updateWorkspace,switchVariant,validateWorkspace,readFile,saveFile};
})(globalThis);
