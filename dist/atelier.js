(function(root){
'use strict';
const $=id=>document.getElementById(id),t=(k,p)=>root.HiveI18n.t(k,p);
function element(tag,attrs={},text){const e=document.createElement(tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;return e;}
function textKey(e,key){e.setAttribute('data-i18n',key);e.textContent=t(key);return e;}
function fold(id,key){const d=element('details',{id});d.append(textKey(element('summary'),key));return d;}
function mount(actions){
 const sidebar=document.querySelector('.library-sidebar'),workspace=document.querySelector('.workspace'),inspector=document.querySelector('.inspector-sidebar');
 document.body.dataset.atelier='true';
 const tabs=sidebar.querySelector('.shell-tabs'),build=$('left-objects'),players=$('left-players');
 textKey($('left-tab-objects'),'Bauen');tabs.prepend($('left-tab-objects'));
 $('left-tab-blueprints').remove();
 const checkTab=textKey(element('button',{id:'left-tab-check','data-left-tab':'check',role:'tab','aria-controls':'left-check','aria-selected':'false',tabindex:'-1'}),'Prüfen');
 tabs.append(checkTab);checkTab.addEventListener('click',()=>actions.tab('check'));checkTab.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();actions.tab(e.key==='End'?'check':e.key==='ArrowLeft'?'players':'objects',true);}});
 const check=element('section',{id:'left-check',class:'left-pane',role:'tabpanel','aria-labelledby':'left-tab-check',hidden:''});
 sidebar.append(check);check.append(textKey(element('h2'),'Hive prüfen'),$('check-drawer'));$('check-drawer').open=true;$('toggle-hive-check').hidden=true;
 const palette=document.querySelector('.map-toolbar');palette.className='build-palette';build.prepend(textKey(element('h2'),'Objekt hinzufügen'),palette);
 const fills=document.querySelector('[data-map-mode=fill]');fills.classList.add('full');build.append(fills,$('area-fill-options'));
 const advanced=fold('selection-options','Auswahl und Navigation');advanced.append(document.querySelector('.map-editor-tools'));build.append(advanced);
 const blueprints=fold('blueprints-fold','Bausteine');blueprints.append($('left-blueprints'));build.append(blueprints);$('left-blueprints').hidden=false;
 const viewbar=element('div',{class:'map-viewbar'});document.querySelector('.map-workspace').prepend(viewbar);
 viewbar.append($('map-style').closest('label'));
 const grid=document.querySelector('[data-world-option=grid]').closest('label');viewbar.append(grid,$('display-menu'));
 const navigation=element('div',{class:'map-navigation'});for(const mode of ['pan','select'])navigation.append(document.querySelector('[data-map-mode='+mode+']'));viewbar.append(navigation);
 const top=document.querySelector('.topbar'),fileActions=document.querySelector('.file-actions');top.insertBefore($('plans-menu'),document.querySelector('.header-plan'));
 const settings=fold('settings-menu','Einstellungen');settings.className='header-menu';const settingsBody=element('div',{class:'menu-content'});settings.append(settingsBody);settingsBody.append(document.querySelector('.appearance-controls'),$('show-help'));top.append(settings);
 document.querySelector('.export-menu>summary').classList.remove('primary');textKey(document.querySelector('.export-menu>summary'),'Teilen');
 const context=document.querySelector('.contextbar'),mapSettings=fold('map-settings-menu','Karte');mapSettings.className='header-menu';const mapSettingsBody=element('div',{class:'menu-content'});mapSettings.append(mapSettingsBody);for(const id of ['season-select','layout-select'])mapSettingsBody.append($(id).closest('label'));context.prepend(mapSettings);
 const allianceMenu=fold('alliance-menu','Allianz verwalten');allianceMenu.className='header-menu';const allianceBody=element('div',{class:'menu-content'});allianceMenu.append(allianceBody);for(const [id,key] of [['alliance-edit','Allianz bearbeiten'],['alliance-add','Allianz hinzufügen']]){const b=$(id);b.classList.remove('icon-button');textKey(b,key);allianceBody.append(b);}allianceBody.append($('alliance-status'));context.append(allianceMenu);
 const footer=element('footer',{class:'atelier-footer'});footer.append($('app-version'));const hint=textKey(element('span'),'Ein Feld entspricht einem Spielfeld.');footer.append(hint);document.body.append(footer);
 const close=textKey(element('button',{id:'close-inspector',class:'text-button'}),'Auswahl schließen');close.addEventListener('click',()=>{actions.clearSelection();$('map').focus();});inspector.querySelector('.inspector-heading').prepend(close);
 const libraryToggle=textKey(element('button',{id:'toggle-library','aria-expanded':'true','aria-controls':'atelier-library'}),'Werkzeuge');sidebar.id='atelier-library';viewbar.prepend(libraryToggle);
 libraryToggle.addEventListener('click',()=>{const closed=document.body.classList.toggle('library-collapsed');libraryToggle.setAttribute('aria-expanded',String(!closed));});
 const compact=root.matchMedia?.('(max-width:700px)');if(compact?.matches){document.body.classList.add('library-collapsed');libraryToggle.setAttribute('aria-expanded','false');}
 sidebar.addEventListener('click',e=>{if(compact?.matches&&e.target.closest('[data-tool],#draw-check-area')){document.body.classList.add('library-collapsed');libraryToggle.setAttribute('aria-expanded','false');}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')){document.querySelectorAll('.header-menu[open],.export-menu[open]').forEach(x=>x.open=false);}});
 document.addEventListener('toggle',e=>{if(e.target.matches?.('.header-menu,.export-menu')&&e.target.open)for(const menu of document.querySelectorAll('.header-menu[open],.export-menu[open]'))if(menu!==e.target&&!menu.contains(e.target))menu.open=false;},true);
 const wizard=createWizard(actions);$('new-plan').addEventListener('click',()=>wizard.open());
 function refresh(){
  $('left-blueprints').hidden=false;
  for(const section of build.querySelectorAll('details[data-qol-owned]')){section.classList.remove('shell-section');section.open=false;}
  for(const section of $('left-blueprints').querySelectorAll('details')){section.classList.add('shell-section');section.open=true;}
  const panel=$('check-panel');if(panel){panel.open=true;panel.classList.add('shell-section');$('run-check').classList.add('primary');}
  const info=$('area-fill-options');if(!info.querySelector('.fill-help')){const help=fold('fill-help','So funktioniert das Füllen');help.className='fill-help';for(const p of [...info.querySelectorAll('p.field-help')])help.append(p);info.append(help);}
  root.HiveI18n.apply(document);
 }
 function sync(state){
  const show=state.selection;inspector.hidden=!show;workspace.classList.toggle('has-selection',show);
  const summary=mapSettings.querySelector('summary');summary.removeAttribute('data-i18n');summary.textContent=state.season+' · '+state.layout;
  for(const b of document.querySelectorAll('[data-left-tab]'))b.classList.toggle('active',b.dataset.leftTab===state.left);
  const fillMode=state.mode==='fill';fills.classList.toggle('primary',fillMode);
  if(fillMode&&state.left!=='objects')actions.tab('objects');
 }
 refresh();actions.tab('objects');return {refresh,sync};
}
function createWizard(actions){
 const d=element('dialog',{id:'new-plan-dialog','aria-labelledby':'new-plan-title'});
 d.innerHTML='<form id="new-plan-form"><div class="wizard-heading"><div><small data-i18n="Neuer Plan">Neuer Plan</small><h2 id="new-plan-title" data-i18n="Deinen Hive vorbereiten">Deinen Hive vorbereiten</h2></div><button type="button" id="wizard-cancel" data-i18n="Abbrechen">Abbrechen</button></div><nav class="wizard-steps" aria-label="Plan setup">'+['Karte','Allianz','Loslegen'].map((k,i)=>'<button type="button" data-wizard-step="'+i+'"><span>'+(i+1)+'</span><span data-i18n="'+k+'">'+k+'</span></button>').join('')+'</nav><section data-wizard-pane="0"><label><span data-i18n="Planname">Planname</span><input id="wizard-title" maxlength="80"></label><div class="wizard-two"><label><span data-i18n="Season">Season</span><select id="wizard-season"></select></label><label><span data-i18n="Layout-Variante">Layout-Variante</span><select id="wizard-layout"></select></label></div><details><summary data-i18n="Kartendaten hinzufügen (optional)">Kartendaten hinzufügen (optional)</summary><label><span data-i18n="Kartendaten importieren">Kartendaten importieren</span><input id="wizard-map" type="file" accept=".json,application/json"></label><p class="field-help" data-i18n="Terrain, Gebäude und Schlamm für diese Season.">Terrain, Gebäude und Schlamm für diese Season.</p></details></section><section data-wizard-pane="1" hidden><label><span data-i18n="Allianzname">Allianzname</span><input id="wizard-alliance" maxlength="40"></label><label class="wizard-color"><span data-i18n="Farbe">Farbe</span><input id="wizard-color" type="color" value="#367cb6"></label><details><summary data-i18n="Spieler hinzufügen (optional)">Spieler hinzufügen (optional)</summary><label><span data-i18n="Namen einfügen">Namen einfügen</span><textarea id="wizard-players" rows="5" maxlength="30000"></textarea></label><p class="field-help" data-i18n="Ein Spielername pro Zeile.">Ein Spielername pro Zeile.</p></details></section><section data-wizard-pane="2" hidden><h3 data-i18n="Bereit zum Planen">Bereit zum Planen</h3><p id="wizard-summary"></p><p class="field-help" data-i18n="Alle Einstellungen kannst du später ändern.">Alle Einstellungen kannst du später ändern.</p></section><p id="wizard-error" role="alert"></p><div class="dialog-footer"><button type="button" id="wizard-back" data-i18n="Zurück">Zurück</button><button id="wizard-next" class="primary" type="submit" data-i18n="Weiter">Weiter</button></div></form>';
 document.body.append(d);d.addEventListener('close',()=>{$('plans-menu').querySelector('summary').focus();});for(const name of ['season','layout'])$('wizard-'+name).innerHTML=$(name+'-select').innerHTML;
 let step=0,generation=0,busy=false;
 function show(n){step=n;for(const p of d.querySelectorAll('[data-wizard-pane]'))p.hidden=Number(p.dataset.wizardPane)!==step;for(const b of d.querySelectorAll('[data-wizard-step]')){b.setAttribute('aria-current',Number(b.dataset.wizardStep)===step?'step':'false');b.disabled=busy;} $('wizard-back').hidden=step===0;textKey($('wizard-next'),step===2?'Plan erstellen':'Weiter');$('wizard-summary').textContent=[$('wizard-title').value||t('Mein Hive'),$('wizard-season').selectedOptions?.[0]?.textContent,$('wizard-layout').selectedOptions?.[0]?.textContent,$('wizard-alliance').value||t('Allianz {n}',{n:1}),$('wizard-map').files?.[0]?.name].filter(Boolean).join(' · ');}
 const cancel=()=>{generation++;d.close();};$('wizard-cancel').addEventListener('click',cancel);d.addEventListener('cancel',()=>generation++);
 $('wizard-back').addEventListener('click',()=>show(Math.max(0,step-1)));d.querySelectorAll('[data-wizard-step]').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.wizardStep))));
 $('new-plan-form').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;if(step<2){show(step+1);return;}const token=generation;busy=true;$('wizard-next').disabled=true;$('wizard-error').textContent='';try{const M=root.HiveModel,W=root.HiveWorkspace;let plan=M.makeLayout($('wizard-layout').value,{season:$('wizard-season').value,title:$('wizard-title').value.trim()||t('Mein Hive')});plan=M.editAlliance(plan,1,$('wizard-alliance').value.trim()||t('Allianz {n}',{n:1}),$('wizard-color').value);if($('wizard-players').value.trim())plan=M.addPlayers(plan,$('wizard-players').value).state;const file=$('wizard-map').files?.[0];if(file){if(file.size>8000000)throw Error(t('Kartendatei ist zu groß (maximal 8 MB).'));const data=root.HiveWorldMap.parse(JSON.parse(await file.text()));plan=root.HiveWorldMap.apply(plan,data);}const next=W.createWorkspace(plan);if(token!==generation||!d.open)return;d.close();actions.createPlan(next);}catch(error){if(token===generation&&d.open)$('wizard-error').textContent=error.message;}finally{if(token===generation){busy=false;$('wizard-next').disabled=false;}}});
 return {open(){generation++;busy=false;step=0;$('new-plan-form').reset?.();$('wizard-title').value=t('Mein Hive');$('wizard-season').value=actions.getState().season;$('wizard-layout').value='empty';$('wizard-alliance').value='';$('wizard-color').value='#367cb6';$('wizard-players').value='';$('wizard-map').value='';$('wizard-error').textContent='';$('wizard-next').disabled=false;root.HiveI18n.apply(document);show(0);$('plans-menu').open=false;d.showModal();$('wizard-title').focus();}};
}
function previewRecovery(row,restore){
 const W=root.HiveWorkspace,M=root.HiveModel,workspace=W.readFile(row.workspace),plan=W.activePlan(workspace);
 $('recovery-preview')?.remove();
 const dialog=element('dialog',{id:'recovery-preview','aria-labelledby':'recovery-preview-title'}),title=textKey(element('h2',{id:'recovery-preview-title'}),'Vorschau'),name=element('h3',{},plan.title),date=element('p',{},new Date(row.updatedAt).toLocaleString(root.HiveI18n.language)),stats=element('dl',{class:'recovery-stats'});
 const values=[['Season',plan.season==='off'?t('Off Season'):t('Season {n}',{n:plan.season})],['Layout-Variante',t(plan.layout==='empty'?'Leere Karte':plan.layout==='compact'?'Kompakt':'Mit Abstand')],['Objekte',plan.objects.length+(plan.worldMap?.areas?.length??0)],['Spieler',plan.players.length],['Allianzen',M.alliances(plan).length]];
 for(const [key,value] of values)stats.append(textKey(element('dt'),key),element('dd',{},String(value)));
 const list=element('ul',{class:'recovery-preview-objects'});for(const object of plan.objects.slice(0,20)){const c=M.displayCoords(plan,object);list.append(element('li',{},M.objectLabel(plan,object)+' · '+object.w+'×'+object.h+' · X '+c.x+' / Y '+c.y));}
 const footer=element('div',{class:'dialog-footer'}),close=textKey(element('button',{type:'button'}),'Schließen'),load=textKey(element('button',{type:'button',class:'primary'}),'Wiederherstellen');
 close.addEventListener('click',()=>dialog.close());load.addEventListener('click',()=>{dialog.close();restore();});footer.append(close,load);dialog.append(title,name,date,stats,list,textKey(element('p',{class:'field-help'}),'Manuell gespeicherte Karten bleiben unverändert.'),footer);document.body.append(dialog);dialog.showModal();close.focus();
}
root.HiveAtelier={mount,previewRecovery};
})(globalThis);
