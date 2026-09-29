/* Manual archive writes occur only through an explicit Save action. */
(function(){
'use strict';
const API='https://nova-hive-viewer.georgiadis-c.chatgpt.site',B=globalThis.HiveArchiveBridge,I=globalThis.HiveI18n,t=(k,p)=>I.t(k,p),$=id=>document.getElementById(id),KEY='nova-hive-archive-key-v1';
let items=[],busy=false,key=null;
const source=()=>B.getSource();
const status=(k,p)=>{for(const id of ['archive-status','share-status'])if($(id))$(id).textContent=t(k,p);};
function getKey(){if(key)return key;key=localStorage.getItem(KEY);if(!/^[a-f0-9]{64}$/.test(key??'')){key=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');localStorage.setItem(KEY,key);}return key;}
async function request(path,method='GET',body){let r;try{r=await fetch(API+'/api/plans'+path,{method,headers:{Authorization:'Bearer '+getKey(),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(45000)});}catch{throw Error(t('Kartenarchiv nicht erreichbar. Dein aktueller Plan bleibt erhalten.'));}const v=await r.json();if(!r.ok){if(r.status===409)throw Error(t('Diese Karte wurde inzwischen anderswo geändert. Lade den gespeicherten Stand oder sichere deinen Entwurf als neue Karte.'));throw Error(t(v.error??'Kartenarchiv nicht erreichbar. Dein aktueller Plan bleibt erhalten.'));}return v;}
function refreshState(){for(const id of ['top-save','archive-save','archive-copy','archive-viewer','archive-save-viewer','archive-refresh','archive-key-load'])if($(id))$(id).disabled=busy;if($('archive-save-viewer'))$('archive-save-viewer').hidden=!B.isDirty()&&!!source();}
async function run(fn){if(busy)return;busy=true;refreshState();try{return await fn();}catch(e){status(e.message);B.toast(e.message,true);}finally{busy=false;refreshState();draw();}}
globalThis.HiveArchiveRefreshState=refreshState;
globalThis.HiveArchiveResetSelection=()=>{$('archive-name').value='';$('archive-share').hidden=true;draw();refreshState();};
globalThis.HiveArchiveRestoreSource=record=>{$('archive-name').value=record?.name??'';$('archive-share').hidden=!record?.shared;if(record?.shared)showLink(record.id);draw();refreshState();};
function shareLink(id){return 'https://sunnyharry.github.io/Nova-Hive-Planer/viewer/?plan='+encodeURIComponent(id);}
function showLink(id){$('archive-link').value=shareLink(id);$('archive-share').hidden=false;}
function button(label,action){const b=document.createElement('button');b.textContent=t(label);b.disabled=busy;b.addEventListener('click',action);return b;}
function draw(){const list=$('archive-list');list.replaceChildren();if(!items.length){const p=document.createElement('p');p.className='field-help';p.textContent=t('Noch keine gespeicherten Karten.');list.append(p);return;}for(const item of items){const current=source()?.id===item.id,card=document.createElement('article');card.className='archive-card'+(current?' active':'');const title=document.createElement('strong');title.textContent=item.name;const meta=document.createElement('small');meta.textContent=new Date(item.updatedAt).toLocaleString(I.language)+(current?' · '+t('Geöffnete Karte'):'')+(item.shared?' · Viewer':'');const actions=document.createElement('div');actions.append(button('Laden',()=>load(item)));if(current)actions.append(button('Sichern',()=>run(()=>save())));actions.append(button('Viewer',()=>viewSaved(item)));const more=document.createElement('details'),summary=document.createElement('summary');summary.textContent=t('Mehr');const removeButton=button('Löschen',()=>remove(item));removeButton.className='danger';more.append(summary,button('Umbenennen',()=>renameSaved(item)),button('Als neue Karte',()=>copySaved(item)),removeButton);actions.append(more);card.append(title,meta,actions);list.append(card);}}
async function refresh(){const data=await request('');items=data.plans.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));draw();}
async function refreshAfterSave(){try{await refresh();}catch{status('Karte gesichert. Die Kartenliste konnte noch nicht aktualisiert werden.');}}
function load(item){if(busy)return;B.confirm(()=>run(async()=>{const record=await request('/'+item.id);B.load(record.workspace,record);$('archive-name').value=record.name;$('archive-share').hidden=!record.shared;if(record.shared)showLink(record.id);draw();status('Karte geladen.');}));}
function remove(item){if(busy)return;B.requestConfirm(t('Karte löschen?'),t('Die gespeicherte Karte und ihr Viewer-Link werden entfernt. Der geöffnete Entwurf bleibt erhalten.'),()=>run(async()=>{await request('/'+item.id,'DELETE',{version:item.version});if(source()?.id===item.id){B.detach();$('archive-share').hidden=true;}await refresh();status('Karte gelöscht.');}));}
function renameSaved(item){if(busy)return;B.promptName(t('Umbenennen'),name=>run(async()=>{const current=await request('/'+item.id),saved=await request('/'+item.id,'PUT',{name,workspace:current.workspace,version:current.version,share:current.shared});B.updateSource(saved,current.version);if(source()?.id===saved.id)$('archive-name').value=saved.name;await refreshAfterSave();status('Karte manuell gesichert.');}),item.name);}
function copySaved(item){if(busy)return;B.promptName(t('Als neue Karte'),name=>run(async()=>{const current=await request('/'+item.id);await request('/'+crypto.randomUUID(),'PUT',{name,workspace:current.workspace,version:0,share:false});await refreshAfterSave();status('Karte manuell gesichert.');}),item.name);}
async function save(copy=false,publish=false){
 const snapshot=B.getWorkspace(),token=B.getDraftToken(),base=source(),name=$('archive-name').value.trim()||snapshot.variants.find(v=>v.season===snapshot.active.season&&v.layout===snapshot.active.layout).title;
 if(!name){$('plans-menu').open=true;$('archive-name').focus();throw Error(t('Bitte einen Kartennamen eingeben.'));}
 const id=copy||!base?crypto.randomUUID():base.id,record=await request('/'+id,'PUT',{name,workspace:snapshot,version:copy||!base?0:base.version,share:publish||(!copy&&!!base?.shared)});
 B.markSaved(record,snapshot,token);if(B.getDraftToken()===token){$('archive-name').value=name;if(record.shared)showLink(id);else $('archive-share').hidden=true;}
 status('Karte manuell gesichert.');await refreshAfterSave();return id;
}
function viewerTab(){const tab=window.open('about:blank','_blank');if(tab){tab.opener=null;tab.document.title='Nova Hive Viewer';tab.document.body.textContent=t('Viewer wird vorbereitet …');}return tab;}
function viewSaved(item){
 if(busy)return;if(!item){$('plans-menu').open=true;status('Sichere diese Karte zuerst. Der Viewer zeigt immer den letzten manuell gesicherten Stand.');return;}
 const tab=viewerTab();run(async()=>{try{
  // Publishing changes access to the saved record, never its content to the draft.
  if(!item.shared){const record=await request('/'+item.id);if(!record.shared){const saved=await request('/'+item.id,'PUT',{name:record.name,workspace:record.workspace,version:record.version,share:true,publishOnly:true});B.updateSource(saved,record.version);}await refreshAfterSave();}
  showLink(item.id);if(tab)tab.location.replace(shareLink(item.id));status(B.isDirty()&&source()?.id===item.id?'Viewer zeigt den letzten manuell gesicherten Stand. Dein Entwurf enthält weitere Änderungen.':'Viewer-Link bereit. Jeder mit diesem Link kann die Karte sehen.');
 }catch(e){tab?.close();throw e;}});
}
function saveAndView(){if(busy)return;const tab=viewerTab();run(async()=>{try{const id=await save(false,true);if(tab)tab.location.replace(shareLink(id));status('Karte gesichert. Viewer geöffnet.');}catch(e){tab?.close();throw e;}});}
globalThis.HiveArchiveSave=()=>{if(!source()&&!$('archive-name').value.trim()){const w=B.getWorkspace();$('archive-name').value=w.variants.find(v=>v.season===w.active.season&&v.layout===w.active.layout).title;$('plans-menu').open=true;$('archive-name').focus();$('archive-name').select();return;}return run(()=>save());};
$('top-save').addEventListener('click',e=>{e.stopPropagation();globalThis.HiveArchiveSave();});$('archive-save').addEventListener('click',globalThis.HiveArchiveSave);$('archive-copy').addEventListener('click',()=>run(()=>save(true)));
$('archive-viewer').addEventListener('click',e=>{e.stopPropagation();viewSaved(source());});$('archive-save-viewer').addEventListener('click',saveAndView);
$('archive-link-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('archive-link').value);status('Link kopiert.');}catch{$('archive-link').select();status('Link markieren und kopieren.');}});
$('archive-refresh').addEventListener('click',()=>run(refresh));
$('archive-key-save').addEventListener('click',()=>run(async()=>{const blob=new Blob([JSON.stringify({schema:'nova-hive-archive-access',key:getKey()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nova-hive-archiv-schluessel.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}));
$('archive-key-load').addEventListener('click',()=>$('archive-key-file').click());
$('archive-key-file').addEventListener('change',e=>run(async()=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;if(f.size>1000)throw Error(t('Ungültige Archiv-Schlüsseldatei.'));const data=JSON.parse(await f.text());if(data.schema!=='nova-hive-archive-access'||!/^[a-f0-9]{64}$/.test(data.key))throw Error(t('Ungültige Archiv-Schlüsseldatei.'));B.requestConfirm(t('Archiv wechseln?'),t('Sichere zuerst deinen bisherigen Archiv-Schlüssel. Der geöffnete Plan bleibt erhalten.'),()=>run(async()=>{localStorage.setItem(KEY,data.key);key=data.key;B.detach();$('archive-share').hidden=true;await refresh();}));}));
$('language-select').addEventListener('change',()=>{draw();refreshState();});
run(async()=>{await refresh();status('Manuell gespeicherte Karten. Änderungen werden erst mit Sichern übernommen.');});
})();
