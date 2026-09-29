/* Local drafts are separate from explicitly saved server records. Each tab writes
   its own branch; old tabs cannot replace a newer tab's recovery state. */
(function(root){
'use strict';
const DB='nova-hive-drafts-v2',MAX_BYTES=50_000_000,MAX_HISTORY=10,MAX_AGE=30*24*60*60*1000;
let connection=null,chain=Promise.resolve(),draftId=id(),last=null;
function id(){return root.crypto?.randomUUID?.()??Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
function open(){if(connection)return connection;connection=new Promise((resolve,reject)=>{if(!root.indexedDB)return reject(Error('Automatische Sicherung ist in diesem Browser nicht verfügbar.'));const request=root.indexedDB.open(DB,1);request.onupgradeneeded=()=>request.result.createObjectStore('snapshots',{keyPath:'id'});request.onerror=()=>reject(request.error);request.onsuccess=()=>{request.result.onversionchange=()=>request.result.close();resolve(request.result);};});return connection;}
function transaction(db,mode,action){return new Promise((resolve,reject)=>{const tx=db.transaction('snapshots',mode);let value;tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error??Error('Automatische Sicherung wurde abgebrochen.'));action(tx.objectStore('snapshots'),v=>value=v);});}
async function list(){const db=await open();return transaction(db,'readonly',(store,done)=>{const r=store.getAll();r.onsuccess=()=>done(r.result.sort((a,b)=>b.updatedAt-a.updatedAt));});}
function fingerprint(workspace){const {savedAt,...value}=workspace;const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;return JSON.stringify(stable(value));}
function save(workspace,source,dirty,{force=false,legacy=false}={}){
 const body=JSON.parse(JSON.stringify(workspace)),serial=fingerprint(body),owner=draftId,record={id:id(),draftId:owner,workspace:body,source:source?{id:source.id,version:source.version,name:source.name,shared:!!source.shared}:null,dirty:!!dirty,updatedAt:Date.now(),bytes:new Blob([serial]).size,legacy};
 const operation=async()=>{
  if(last?.draftId===owner&&last.serial===serial&&JSON.stringify(last.source)===JSON.stringify(record.source)&&last.dirty===record.dirty&&!force)return last.record;
  const db=await open();await transaction(db,'readwrite',(store,done)=>{const request=store.getAll();request.onsuccess=()=>{let rows=request.result;if(!force&&!legacy){const latest=rows.filter(r=>r.draftId===owner).sort((a,b)=>b.updatedAt-a.updatedAt)[0];if(latest&&record.updatedAt-latest.updatedAt<30_000){store.delete(latest.id);rows=rows.filter(r=>r.id!==latest.id);}}
   store.put(record);rows.push(record);rows.sort((a,b)=>b.updatedAt-a.updatedAt||(a.id===record.id?-1:b.id===record.id?1:0));const counts=new Map();let bytes=0;
   for(const row of rows){const count=(counts.get(row.draftId)??0)+1;counts.set(row.draftId,count);if(row.id!==record.id&&(count>MAX_HISTORY||bytes+row.bytes>MAX_BYTES||row.updatedAt<Date.now()-MAX_AGE)){store.delete(row.id);continue;}bytes+=row.bytes;}done(record);
  };});last={draftId:owner,serial,source:record.source,dirty:record.dirty,record};return record;
 };
 const result=chain.then(operation);chain=result.catch(()=>{});return result;
}
async function init(){let rows=await list();if(!rows.length){const legacy=root.localStorage?.getItem('nova-hive-workspace-recovery-v1');if(legacy){const data=JSON.parse(legacy);root.HiveWorkspace.readFile(data.workspace);await save(data.workspace,null,true,{legacy:true,force:true});rows=await list();}}return rows[0]??null;}
function newDraft(){draftId=id();last=null;return draftId;}
root.HiveRecovery={init,list,save,newDraft,fingerprint,get draftId(){return draftId;},MAX_HISTORY,MAX_BYTES};
})(globalThis);
