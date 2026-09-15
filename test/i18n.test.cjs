const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
vm.runInThisContext(fs.readFileSync('dist/i18n.js','utf8'));
vm.runInThisContext(fs.readFileSync('dist/model.js','utf8'));
const I=globalThis.HiveI18n,M=globalThis.HiveModel;
assert.deepEqual(I.languages,['en','de','fr','es','pt','vi','ko']);
const variables=text=>[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
for(const [key,values] of Object.entries(I.messages)){
 assert.equal(values.length,6,key);
 for(const value of values){assert.ok(value.trim(),key);assert.deepEqual(variables(value),variables(key),key);}
}
// Every explicitly referenced static or dynamic translation is present.
const source=fs.readFileSync('dist/app.js','utf8')+'\n'+fs.readFileSync('dist/model.js','utf8');
for(const match of source.matchAll(/\b(?:t|h)\('([^']+)'/g))assert.ok(I.messages[match[1]],'Missing message: '+match[1]);
for(const key of ['Oben links ziehen','Oben rechts ziehen','Unten links ziehen','Unten rechts ziehen','Marshall 3 × 3','Füge Spieler hinzu und verteile sie rund um den Marshall.','{assigned} / {total} Plätze vergeben','Basis 3 × 3 · Marshall 3 × 3 · Koordinaten der Gebäudemitte · X nach rechts, Y nach oben'])assert.ok(I.messages[key],'Missing conditional message: '+key);
const decode=s=>s.replaceAll('&#x27;',"'").replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>');
const html=fs.readFileSync('dist/index.html','utf8');
for(const match of html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g))assert.ok(I.messages[decode(match[1])],'Missing static message: '+decode(match[1]));
let state=M.addPlayers(M.makeLayout(),'Allianzzentrum\n미스터MM\nNguyễn Hà').state;
const base=state.objects.find(o=>o.type==='base'&&!o.beacon),center=state.objects.find(o=>o.type==='center');
state=M.assign(state,state.players[0].id,base.id);
state=M.setPlayerGroup(state,state.players[0].id,10);
const terrain=M.makeObject(state,'terrain',40,40);state=M.addObject(state,terrain);
state=M.updateObject(state,terrain.id,{name:'Terrain'}); // Explicit custom name matches a translation key.
const snapshot=M.clone(state),order=M.autofillOptions(state).seats.map(o=>o.id);
for(const language of I.languages){
 I.setLanguage(language);
 const sample=I.t('{players} ohne Platz · {seats} freie Plätze.',{players:7,seats:10});
 assert.ok(sample.includes('7')&&sample.includes('10')&&!sample.includes('{'));
 assert.equal(M.objectLabel(state,center),I.t('Allianzzentrum'));
 assert.equal(M.objectLabel(state,state.objects.find(o=>o.id===base.id)),'Allianzzentrum');
 assert.equal(M.objectLabel(state,state.objects.find(o=>o.id===terrain.id)),'Terrain');
 assert.deepEqual(M.validate(JSON.parse(JSON.stringify(state))),snapshot);
 assert.deepEqual(M.autofillOptions(state).seats.map(o=>o.id),order);
 assert.throws(()=>M.setOrigin(state,.5,500),{message:I.t('X und Y müssen ganze Zahlen von 0 bis 999999 sein.')});
 assert.deepEqual(state,snapshot);
}
assert.equal(I.setLanguage('invalid'),false);assert.equal(I.language,'ko');
I.setLanguage('de');
console.log(`Passed: all ${Object.keys(I.messages).length} messages in seven languages, placeholder parity, interface coverage, localized errors and unchanged names, plans and autofill order.`);
