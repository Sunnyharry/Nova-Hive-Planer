/* Pure map model. Public coordinates identify the bottom-left tile (0–999).
   Internal SVG geometry uses centers; even dimensions have half-tile centers. */
(function(root){
'use strict';
const SCHEMA='nova-hive-planner',VERSION=5,WORLD_SIZE=1000;
const t=(key,params={})=>globalThis.HiveI18n?.t(key,params)??key.replace(/\{(\w+)\}/g,(_,k)=>String(params[k]??'{'+k+'}'));
const DEFAULT_NAMES={center:'Allianzzentrum',marshall:'Marshall’s Guard',terrain:'Terrain'};
const PRIORITY_DEFAULTS=['Zuverlässiger Kern','Aktiv','Casual'];
const priorityOf=player=>player?.priority??2;
const priorityLabel=(state,level)=>state.priorityLabels?.[level-1]||t(PRIORITY_DEFAULTS[level-1]);
const SEASONS=['off','1','2','3','4','5','6'];
const emptyGroups=()=>Array.from({length:10},(_,i)=>({id:i+1,playerIds:[]}));
const isSeason4=state=>(state.season??'4')==='4';
const anchorType=state=>isSeason4(state)?'center':'marshall';
const isDeveloping=state=>!['off','4'].includes(state.season??'4');
const COLORS=['#45cdec','#efb95c','#d98bc8','#5dd5b7','#aa9ded','#fa8f84'];
const clone=value=>JSON.parse(JSON.stringify(value));
const uid=prefix=>`${prefix}_${globalThis.crypto?.randomUUID?.()??Math.random().toString(36).slice(2)+Date.now().toString(36)}`;
const normalizeName=name=>String(name).trim().normalize('NFC');
const nameKey=name=>normalizeName(name).toLocaleLowerCase();
const finite=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max;
function snap(value,size=3){const offset=size%2===0?.5:0;return Math.round(value-offset)+offset;}
function rect(o){return {left:o.x-o.w/2,right:o.x+o.w/2,bottom:o.y-o.h/2,top:o.y+o.h/2};}
function overlaps(a,b){const A=rect(a),B=rect(b);return A.left<B.right-1e-8&&A.right>B.left+1e-8&&A.bottom<B.top-1e-8&&A.top>B.bottom+1e-8;}
function worldBounds(state){const left=state.origin.mapX-state.origin.x-.5,bottom=state.origin.mapY-state.origin.y-.5;return {left,right:left+WORLD_SIZE,bottom,top:bottom+WORLD_SIZE};}
function referenceCoords(state){const half=isSeason4(state)?4:1;return {x:state.origin.x-half,y:state.origin.y-half};}
function coords(state,o){
 const r=o.terrainGroup?objectBounds(terrainParts(state,o)):rect(o);
 return {x:state.origin.x+r.left+.5-state.origin.mapX,y:state.origin.y+r.bottom+.5-state.origin.mapY};
}
function requireCoordinates(x,y){if(!Number.isInteger(x)||!Number.isInteger(y)||!finite(x,0,999)||!finite(y,0,999))throw new Error(t('X und Y müssen ganze Zahlen von 0 bis 999 sein.'));}
function positionFromCoords(state,x,y,o){requireCoordinates(x,y);if(!o)throw new Error(t('Element nicht gefunden.'));const q=coords(state,o);return {x:o.x+x-q.x,y:o.y+y-q.y};}
function assertWorldPlacement(state,o){
 const x=state.origin.x+o.x-(o.w-1)/2-state.origin.mapX,y=state.origin.y+o.y-(o.h-1)/2-state.origin.mapY;
 if(!Number.isInteger(x)||!Number.isInteger(y))throw new Error(t('Objekte müssen auf ganzen Kartenfeldern stehen.'));
 if(x<0||y<0||x+o.w>WORLD_SIZE||y+o.h>WORLD_SIZE)throw new Error(t('Das gesamte Objekt muss innerhalb der Karte liegen (X/Y 0–999).'));
}
function followReference(state,object){
 if(object.type!==anchorType(state))return;
 state.origin.x+=object.x-state.origin.mapX;state.origin.y+=object.y-state.origin.mapY;
 state.origin.mapX=object.x;state.origin.mapY=object.y;
}
function setObjectCorner(state,id,x,y){
 const old=state.objects.find(o=>o.id===id);if(!old)throw new Error(t('Element nicht gefunden.'));
 const pos=positionFromCoords(state,x,y,old),dx=pos.x-old.x,dy=pos.y-old.y;
 return moveObjects(state,expandObjectIds(state,[id]).map(id=>{const o=state.objects.find(p=>p.id===id);return {id,x:o.x+dx,y:o.y+dy};}));
}
function objectBounds(objects){
 const rs=objects.map(rect);return {left:Math.min(...rs.map(r=>r.left)),right:Math.max(...rs.map(r=>r.right)),bottom:Math.min(...rs.map(r=>r.bottom)),top:Math.max(...rs.map(r=>r.top))};
}
function expandObjectIds(state,ids){
 const selected=new Set(ids),groups=new Set(state.objects.filter(o=>selected.has(o.id)&&o.terrainGroup).map(o=>o.terrainGroup));
 return state.objects.filter(o=>selected.has(o.id)||(o.terrainGroup&&groups.has(o.terrainGroup))).map(o=>o.id);
}
function terrainParts(state,o){return o.terrainGroup?state.objects.filter(q=>q.type==='terrain'&&q.terrainGroup===o.terrainGroup):[o];}
function terrainCornerCoords(state,o){return coords(state,o);}
function terrainPositionFromCornerCoords(state,o,x,y){return positionFromCoords(state,x,y,o);}
function setTerrainCorner(state,id,x,y){
 if(state.objects.find(o=>o.id===id)?.type!=='terrain')throw new Error(t('Nur Terrain kann über seine linke untere Ecke positioniert werden.'));
 return setObjectCorner(state,id,x,y);
}
function playerFor(state,o){return state.players.find(p=>p.id===o.playerId)??null;}
function objectForPlayer(state,id){return state.objects.find(o=>o.playerId===id)??null;}
function objectLabel(state,o){
 if(o.type==='base')return playerFor(state,o)?.name??(o.beacon?t('Beacon {letter}',{letter:o.beacon}):t('Platz {n}',{n:String(o.slot).padStart(2,'0')}));
 const fallback=DEFAULT_NAMES[o.type];return !o.customName&&(!o.name||o.name===fallback)?t(fallback):o.name;
}
function makeLayout(kind='spaced',existing=null){
 const season=existing?.season??'4';
 if(!SEASONS.includes(season))throw new Error(t('Ungültige Season.'));
 const state={schema:SCHEMA,version:VERSION,season,groups:clone(existing?.groups??emptyGroups()),priorityLabels:clone(existing?.priorityLabels??['','','']),title:existing?.title??'NOVA FAMILY',origin:clone(existing?.origin??{x:500,y:500,mapX:0,mapY:0}),showLight:season==='4'?(existing?.showLight??true):false,layout:kind,players:clone(existing?.players??[]).map(p=>({...p,priority:priorityOf(p)})),objects:[]};
 const ox=state.origin.mapX,oy=state.origin.mapY;
 if(kind==='empty')return state;
 if(!['spaced','compact'].includes(kind))throw new Error(t('Unbekannte Vorlage.'));
 const pitch=kind==='spaced'?4:3;
 if(!isSeason4(state)){
  const positions=[];
  for(let gy=-5;gy<=5;gy++)for(let gx=-5;gx<=5;gx++)if(gx||gy)positions.push({gx,gy});
  positions.sort((a,b)=>a.gx*a.gx+a.gy*a.gy-b.gx*b.gx-b.gy*b.gy||b.gy-a.gy||a.gx-b.gx);
  for(const [i,{gx,gy}] of positions.slice(0,100).entries()){
   const id=`basic_${gx+5}_${5-gy}`,slot=i+1,prior=existing?.objects.find(o=>o.type==='base'&&o.id===id)??existing?.objects.find(o=>o.type==='base'&&o.slot===slot);
   state.objects.push({id,type:'base',x:ox+gx*pitch,y:oy+gy*pitch,w:3,h:3,slot,playerId:prior?.playerId??null,beacon:null,lightSize:25,electricians:40});
  }
  state.objects.push({id:'marshall_guard',type:'marshall',name:'Marshall’s Guard',x:ox,y:oy,w:3,h:3});
  for(const o of state.objects)assertWorldPlacement(state,o);return state;
 }
 const beacons=[[-3,3,'A'],[3,3,'B'],[-3,-3,'C'],[3,-3,'D']];
 let slot=0;
 for(let gy=5;gy>=-4;gy--)for(let gx=-5;gx<=5;gx++){
  if(Math.abs(gx)<=1&&Math.abs(gy)<=1)continue;
  if(gx===5&&gy===5)continue;
  slot++;
  const id=`base_${gx+5}_${5-gy}`,prior=existing?.objects.find(o=>o.id===id&&o.type==='base')??existing?.objects.find(o=>o.type==='base'&&o.slot===slot);
  const beacon=beacons.find(b=>b[0]===gx&&b[1]===gy)?.[2]??null;
  state.objects.push({id,type:'base',x:ox+gx*pitch,y:oy+gy*pitch,w:3,h:3,slot,playerId:prior?.playerId??null,beacon,lightSize:25,electricians:40});
 }
 state.objects.push({id:'alliance_center',type:'center',name:'Allianzzentrum',x:ox,y:oy,w:9,h:9});
 state.objects.push({id:'marshall_guard',type:'marshall',name:'Marshall’s Guard',x:ox+5*pitch,y:oy+5*pitch,w:3,h:3});
 for(const o of state.objects)assertWorldPlacement(state,o);return state;
}
function setSeason(state,season){
 if(!SEASONS.includes(season))throw new Error(t('Ungültige Season.'));
 if(season===state.season)return state;
 return makeLayout(state.layout,{...state,season,showLight:season==='4'});
}
function collision(state,o,ignoreId=o.id){
 const ignored=ignoreId instanceof Set?ignoreId:new Set([ignoreId]);
 return state.objects.find(other=>!ignored.has(other.id)&&!(o.type==='terrain'&&other.type==='terrain')&&overlaps(o,other))??null;
}
function assertPlacement(state,o,ignoreId=o.id){
 if(!isSeason4(state)&&(o.type==='center'||o.beacon))throw new Error(t('Allianzzentrum und Beacons sind nur in Season 4 verfügbar.'));
 assertWorldPlacement(state,o);
 const hit=collision(state,o,ignoreId);
 if(hit)throw new Error(t('Die Fläche überschneidet sich mit {name}.',{name:objectLabel(state,hit)}));
}
function moveObject(state,id,x,y){
 const old=state.objects.find(o=>o.id===id);if(!old)throw new Error(t('Element nicht gefunden.'));
 const candidate={...old,x:snap(x,old.w),y:snap(y,old.h)};
 if(old.terrainGroup){const dx=candidate.x-old.x,dy=candidate.y-old.y;return moveObjects(state,terrainParts(state,old).map(o=>({id:o.id,x:o.x+dx,y:o.y+dy})));}assertPlacement(state,candidate);
 const next=clone(state);Object.assign(next.objects.find(o=>o.id===id),candidate);
 followReference(next,candidate);
 return next;
}
function moveObjects(state,entries){
 if(!Array.isArray(entries)||!entries.length||entries.length>800)throw new Error(t('Keine Elemente zum Verschieben ausgewählt.'));
 const ids=new Set(entries.map(e=>e?.id));if(ids.size!==entries.length||[...ids].some(id=>!state.objects.some(o=>o.id===id)))throw new Error(t('Ein ausgewähltes Element wurde nicht gefunden.'));
 const candidates=entries.map(e=>{const old=state.objects.find(o=>o.id===e.id);if(e.x!==snap(e.x,old.w)||e.y!==snap(e.y,old.h))throw new Error(t('Ungültige Objektposition.'));return {...old,x:e.x,y:e.y};});
 for(const candidate of candidates)if(candidate.terrainGroup){const old=state.objects.find(o=>o.id===candidate.id),dx=candidate.x-old.x,dy=candidate.y-old.y;for(const part of terrainParts(state,old)){const moved=candidates.find(o=>o.id===part.id);if(!moved||moved.x-part.x!==dx||moved.y-part.y!==dy)throw new Error(t('Verbundene Terrainflächen müssen gemeinsam verschoben werden.'));}}
 for(const candidate of candidates)assertPlacement(state,candidate,ids);
 for(let i=0;i<candidates.length;i++)for(let j=0;j<i;j++)if(!(candidates[i].type==='terrain'&&candidates[j].type==='terrain')&&overlaps(candidates[i],candidates[j]))throw new Error(t('Die ausgewählten Elemente überschneiden sich nach dem Verschieben.'));
 const next=clone(state);for(const candidate of candidates)Object.assign(next.objects.find(o=>o.id===candidate.id),candidate);
 const anchor=candidates.find(o=>o.type===anchorType(state));if(anchor)followReference(next,anchor);
 return next;
}
function nextBeacon(state){for(const char of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')if(!state.objects.some(o=>o.beacon===char))return char;throw new Error(t('Alle Beacon-Buchstaben sind vergeben.'));}
function makeObject(state,type,x=0,y=0){
 if(!isSeason4(state)&&['center','beacon'].includes(type))throw new Error(t('Allianzzentrum und Beacons sind nur in Season 4 verfügbar.'));
 if(type==='beacon'||type==='base')return {id:uid('base'),type:'base',x:snap(x),y:snap(y),w:3,h:3,slot:Math.max(0,...state.objects.filter(o=>o.type==='base').map(o=>o.slot))+1,playerId:null,beacon:type==='beacon'?nextBeacon(state):null,lightSize:25,electricians:40};
 if(type==='center')return {id:uid('center'),type,name:'Allianzzentrum',x:snap(x,9),y:snap(y,9),w:9,h:9};
 if(type==='marshall')return {id:uid('marshall'),type,name:'Marshall’s Guard',x:snap(x),y:snap(y),w:3,h:3};
 if(type==='terrain')return {id:uid('terrain'),type,name:'Terrain',x:snap(x,4),y:snap(y,4),w:4,h:4};
 throw new Error(t('Unbekanntes Element.'));
}
function addObject(state,o){
 if(state.objects.length>=800)throw new Error(t('Ein Plan kann höchstens 800 Elemente enthalten.'));
 if(['center','marshall'].includes(o.type)&&state.objects.some(q=>q.type===o.type))throw new Error(t('Dieses Element ist bereits auf der Karte.'));
 assertPlacement(state,o);const next=clone(state);next.objects.push(clone(o));
 followReference(next,o);
 return next;
}
function removeObject(state,id){return removeObjects(state,[id]);}
function removeObjects(state,ids){const set=new Set(expandObjectIds(state,ids));if(!set.size)return state;const next=clone(state);next.objects=next.objects.filter(o=>!set.has(o.id));return next;}
function terrainTouching(a,b){const A=rect(a),B=rect(b);return A.left<=B.right+1e-7&&A.right>=B.left-1e-7&&A.bottom<=B.top+1e-7&&A.top>=B.bottom-1e-7;}
function terrainsConnected(parts){
 if(!parts.length)return false;const seen=new Set([parts[0].id]),queue=[parts[0]];
 while(queue.length){const current=queue.pop();for(const other of parts)if(!seen.has(other.id)&&terrainTouching(current,other)){seen.add(other.id);queue.push(other);}}
 return seen.size===parts.length;
}
function connectTerrains(state,ids){
 const set=new Set(expandObjectIds(state,ids)),parts=state.objects.filter(o=>set.has(o.id));
 if(parts.length<2)throw new Error(t('Wähle mindestens zwei Terrainflächen aus.'));
 if(parts.some(o=>o.type!=='terrain'))throw new Error(t('Nur Terrainflächen können verbunden werden.'));
 if(!terrainsConnected(parts))throw new Error(t('Die ausgewählten Terrainflächen berühren sich nicht durchgehend.'));
 const groupId=parts.find(o=>o.terrainGroup)?.terrainGroup??uid('terrain_group'),next=clone(state);
 for(const o of next.objects)if(set.has(o.id))o.terrainGroup=groupId;return next;
}
function disconnectTerrains(state,ids){const set=new Set(expandObjectIds(state,ids)),next=clone(state);for(const o of next.objects)if(set.has(o.id))delete o.terrainGroup;return next;}
// Sweep rectangle edges to draw the union with holes and no internal borders.
function terrainUnionGeometry(parts){
 const rectangles=parts.map(rect),xs=[...new Set(rectangles.flatMap(r=>[r.left,r.right]))].sort((a,b)=>a-b),slices=[],edges=[];
 const merge=intervals=>{const result=[];for(const [lo,hi] of intervals.sort((a,b)=>a[0]-b[0]||a[1]-b[1])){const previous=result[result.length-1];if(previous&&lo<=previous[1])previous[1]=Math.max(previous[1],hi);else result.push([lo,hi]);}return result;};
 let previous=[];
 for(let i=0;i<xs.length;i++){
  const x=xs[i],right=xs[i+1],current=right===undefined?[]:merge(rectangles.filter(r=>r.left<right&&r.right>x).map(r=>[r.bottom,r.top]));
  const events=new Map();for(const [a,b] of [...previous,...current]){events.set(a,(events.get(a)??0)^1);events.set(b,(events.get(b)??0)^1);}
  let inside=false,start=null;for(const [y,toggle] of [...events].sort((a,b)=>a[0]-b[0]))if(toggle){if(inside)edges.push([x,start,x,y]);else start=y;inside=!inside;}
  for(const [bottom,top] of current){slices.push({left:x,right,bottom,top});edges.push([x,bottom,right,bottom],[x,top,right,top]);}
  previous=current;
 }
 return {slices,edges};
}
function planBaseFill(state,area,gap=0){
 if(!area||![area.left,area.right,area.bottom,area.top].every(Number.isFinite)||!Number.isInteger(gap)||gap<0||gap>2)throw new Error(t('Ungültiger Füllbereich oder Basisabstand.'));
 const world=worldBounds(state),left=Math.max(world.left,Math.min(area.left,area.right)),right=Math.min(world.right,Math.max(area.left,area.right)),bottom=Math.max(world.bottom,Math.min(area.bottom,area.top)),top=Math.min(world.top,Math.max(area.bottom,area.top)),pitch=3+gap;
 const x0=Math.ceil(left+1.5-1e-8),y0=Math.ceil(bottom+1.5-1e-8),x1=Math.floor(right-1.5+1e-8),y1=Math.floor(top-1.5+1e-8),capacity=Math.max(0,800-state.objects.length);
 if(x0>x1||y0>y1)return {positions:[],skipped:0,limited:false,gap};
 const anchor=state.objects.find(o=>o.type===anchorType(state)),cx=anchor?.x??state.origin.mapX,cy=anchor?.y??state.origin.mapY;
 // A 9-tile center fits exactly into the 3- and 4-tile lattices. With a
 // 5-tile pitch, widen only the two central intervals to 6: the first bases
 // still touch the center, without reducing the requested gap between bases.
 // Axis positions never depend on the selection rectangle's starting corner.
 function axis(center,lo,hi){
  const values=[];
  if(anchor?.type==='center'){
   const inner=gap===0?[-3,0,3]:gap===1?[-2,2]:[0];
   for(const offset of inner)if(center+offset>=lo&&center+offset<=hi)values.push(center+offset);
   for(const sign of [-1,1])for(let offset=6;offset<=Math.max(Math.abs(lo-center),Math.abs(hi-center));offset+=pitch){const value=center+sign*offset;if(value>=lo&&value<=hi)values.push(value);}
  }else for(let k=Math.ceil((lo-center)/pitch);k<=Math.floor((hi-center)/pitch);k++)values.push(center+k*pitch);
  return values.sort((a,b)=>(a-center)**2-(b-center)**2||a-b);
 }
 const xs=axis(cx,x0,x1),ys=axis(cy,y0,y1).sort((a,b)=>(a-cy)**2-(b-cy)**2||b-a),positions=[],buckets=new Map();let skipped=0,limited=false;
 // Only nearby obstacles need inspection, even for large selected areas.
 for(const original of state.objects){const o=original.type==='base'?{...original,w:original.w+2*gap,h:original.h+2*gap}:original,r=rect(o);for(let gx=Math.floor(r.left/16);gx<=Math.floor(r.right/16);gx++)for(let gy=Math.floor(r.bottom/16);gy<=Math.floor(r.top/16);gy++){const key=gx+','+gy;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);}}
 // Merge distance-sorted columns with a small heap instead of sorting up to
 // 110,000 world-wide candidates on every live resize. Stop at the plan limit.
 const heap=[],compare=(a,b)=>a.distance-b.distance||b.y-a.y||a.x-b.x;
 function push(x,i){const y=ys[i],item={x,y,i,distance:(x-cx)**2+(y-cy)**2};let n=heap.length;heap.push(item);while(n){const p=(n-1)>>1;if(compare(heap[p],item)<=0)break;heap[n]=heap[p];n=p;}heap[n]=item;}
 function pop(){const first=heap[0],last=heap.pop();if(heap.length){let n=0;while(n*2+1<heap.length){let c=n*2+1;if(c+1<heap.length&&compare(heap[c+1],heap[c])<0)c++;if(compare(last,heap[c])<=0)break;heap[n]=heap[c];n=c;}heap[n]=last;}return first;}
 if(ys.length)for(const x of xs)push(x,0);
 while(heap.length){
  const {x,y,i}=pop();if(i+1<ys.length)push(x,i+1);
  const candidate={x,y,w:3,h:3},nearby=new Set();for(let gx=Math.floor((x-1.5)/16);gx<=Math.floor((x+1.5)/16);gx++)for(let gy=Math.floor((y-1.5)/16);gy<=Math.floor((y+1.5)/16);gy++)for(const o of buckets.get(gx+','+gy)??[])nearby.add(o);
  if([...nearby].some(o=>overlaps(candidate,o))){skipped++;continue;}
  if(positions.length>=capacity){limited=true;break;}
  positions.push({x:x||0,y:y||0});
 }
 return {positions,skipped,limited,gap};
}
function fillBases(state,area,gap=0){
 const preview=planBaseFill(state,area,gap);if(!preview.positions.length)return {state,added:0,skipped:preview.skipped,limited:preview.limited,ids:[]};
 const next=clone(state),ids=[];let slot=Math.max(0,...state.objects.filter(o=>o.type==='base').map(o=>o.slot));
 for(const {x,y} of preview.positions){const id=uid('base');ids.push(id);next.objects.push({id,type:'base',x,y,w:3,h:3,slot:++slot,playerId:null,beacon:null,lightSize:25,electricians:40,spacing:gap});}
 return {state:next,added:ids.length,skipped:preview.skipped,limited:preview.limited,ids};
}
function parsePlayerFile(text,format='txt'){
 const source=String(text).replace(/^\uFEFF/,'');
 if(source.includes('\0'))throw new Error(t('Bitte eine Textdatei im Format UTF-8 oder UTF-16 verwenden.'));
 if(format==='txt')return source.split(/\r\n?|\n/).map(normalizeName).filter(Boolean);
 if(format!=='csv')throw new Error(t('Bitte eine TXT- oder CSV-Datei auswählen.'));
 const csv=source.replace(/^sep=;\r?\n/i,''),names=[];let field='',quoted=false,closed=false;
 const finish=()=>{const name=normalizeName(field);if(name)names.push(name);field='';closed=false;};
 for(let i=0;i<csv.length;i++){
  const c=csv[i];
  if(quoted){
   if(c==='"'){if(csv[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}
   else if(c==='\r'||c==='\n')throw new Error(t('Ein Spielername in der CSV darf keinen Zeilenumbruch enthalten.'));
   else field+=c;
  }else if(c===';'||c==='\r'||c==='\n')finish();
  else if(closed){if(c!==' '&&c!=='\t')throw new Error(t('CSV prüfen: Nach einem schließenden Anführungszeichen muss ein Semikolon oder Zeilenende folgen.'));}
  else if(c==='"'&&!field.trim()){field='';quoted=true;}
  else field+=c;
 }
 if(quoted)throw new Error(t('CSV prüfen: Ein schließendes Anführungszeichen fehlt.'));
 finish();return names;
}
function decodePlayerFile(buffer){
 const bytes=new Uint8Array(buffer),encoding=bytes[0]===0xff&&bytes[1]===0xfe?'utf-16le':bytes[0]===0xfe&&bytes[1]===0xff?'utf-16be':'utf-8';
 try{return new TextDecoder(encoding,{fatal:true}).decode(bytes);}
 catch{throw new Error(t('Die Textkodierung konnte nicht gelesen werden. Bitte die Datei als UTF-8 speichern.'));}
}
function addPlayerNames(state,names){
 const raw=names.map(normalizeName).filter(Boolean);
 if(raw.some(name=>name.length>80))throw new Error(t('Ein Name darf höchstens 80 Zeichen lang sein.'));
 const next=clone(state),seen=new Set(next.players.map(p=>nameKey(p.name)));let added=0;
 for(const name of raw){if(seen.has(nameKey(name)))continue;seen.add(nameKey(name));next.players.push({id:uid('player'),name,priority:2});added++;}
 if(next.players.length>300)throw new Error(t('Die Liste kann höchstens 300 Spieler enthalten.'));
 return {state:next,added,skipped:raw.length-added};
}
function addPlayers(state,text){return addPlayerNames(state,parsePlayerFile(text,'txt'));}
function importPlayers(state,text,format){return addPlayerNames(state,parsePlayerFile(text,format));}
function autofillOptions(state,includeBeacons=false){
 const occupied=new Set(state.objects.filter(o=>o.playerId).map(o=>o.playerId));
 const players=state.players.filter(p=>!occupied.has(p.id));
 const empty=state.objects.filter(o=>o.type==='base'&&!o.playerId);
 const distance=o=>(o.x-state.origin.mapX)**2+(o.y-state.origin.mapY)**2;
 const seats=empty.filter(o=>includeBeacons||!o.beacon).sort((a,b)=>distance(a)-distance(b)||a.slot-b.slot||a.id.localeCompare(b.id));
 return {players,seats,reserved:includeBeacons?0:empty.filter(o=>o.beacon).length};
}
function groupForPlayer(state,id){return (state.groups??[]).find(g=>g.playerIds.includes(id))??null;}
function requirePlayerIds(state,playerIds){
 if(!Array.isArray(playerIds)||!playerIds.length||playerIds.length>300||playerIds.some(id=>!state.players.some(p=>p.id===id)))throw new Error(t('Spieler nicht gefunden.'));
 return new Set(playerIds);
}
function setPlayerGroups(state,playerIds,groupId){
 const ids=requirePlayerIds(state,playerIds);
 if(groupId!==null&&(!Number.isInteger(groupId)||groupId<1||groupId>10))throw new Error(t('Bitte eine Gruppe von 1 bis 10 wählen.'));
 if([...ids].every(id=>(groupForPlayer(state,id)?.id??null)===groupId))return state;
 const next=clone(state);next.groups=clone(next.groups??emptyGroups());
 for(const g of next.groups)g.playerIds=g.playerIds.filter(id=>!ids.has(id));
 if(groupId!==null){let group=next.groups.find(g=>g.id===groupId);if(!group){group={id:groupId,playerIds:[]};next.groups.push(group);}group.playerIds.push(...state.players.filter(p=>ids.has(p.id)).map(p=>p.id));}
 return next;
}
function setPlayerGroup(state,playerId,groupId){return setPlayerGroups(state,[playerId],groupId);}
function setPlayerPriorities(state,playerIds,priority){
 const ids=requirePlayerIds(state,playerIds);
 if(!Number.isInteger(priority)||priority<1||priority>3)throw new Error(t('Priorität muss 1, 2 oder 3 sein.'));
 if(state.players.filter(p=>ids.has(p.id)).every(p=>priorityOf(p)===priority))return state;
 const next=clone(state);for(const p of next.players)if(ids.has(p.id))p.priority=priority;return next;
}
function setPriorityLabel(state,level,label){
 if(!Number.isInteger(level)||level<1||level>3||typeof label!=='string'||label.length>40)throw new Error(t('Die Prioritätsbezeichnung darf höchstens 40 Zeichen haben.'));
 const next=clone(state);next.priorityLabels=clone(next.priorityLabels??['','','']);next.priorityLabels[level-1]=normalizeName(label);return next;
}
function groupPriority(state,group){const members=state.players.filter(p=>group.playerIds.includes(p.id));return members.length?members.reduce((sum,p)=>sum+priorityOf(p),0)/members.length:2;}
function clearPlayers(state){const next=clone(state);next.players=[];next.groups=emptyGroups();for(const o of next.objects)if(o.type==='base')o.playerId=null;return next;}
function areNeighbors(a,b,gap=1){gap=Math.max(gap,a.spacing??0,b.spacing??0);return a.id!==b.id&&Math.abs(a.x-b.x)<=(a.w+b.w)/2+gap+1e-8&&Math.abs(a.y-b.y)<=(a.h+b.h)/2+gap+1e-8;}
function groupComponents(objects,gap=1){
 const unseen=new Set(objects.map((_,i)=>i));let count=0;
 while(unseen.size){count++;const seed=unseen.values().next().value;unseen.delete(seed);const queue=[seed];
  while(queue.length){const i=queue.pop();for(const j of unseen)if(areNeighbors(objects[i],objects[j],gap)){unseen.delete(j);queue.push(j);}}
 }
 return count;
}
const pairDistance=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
const compareScores=(a,b)=>{for(let i=0;i<a.length;i++)if(Math.abs(a[i]-b[i])>1e-8)return a[i]-b[i];return 0;};
function groupSeats(state,free,anchors,count){
 if(!count||!free.length)return [];
 const center=o=>(o.x-state.origin.mapX)**2+(o.y-state.origin.mapY)**2,gap=state.layout==='compact'?0:1;
 // Bounded multi-start growth: favor connected, mutually adjacent clusters, then proximity to the anchor.
 const seedCount=count>20?12:48;
 const seeds=[...free].sort((a,b)=>{
  if(anchors.length){const nearA=Math.min(...anchors.map(o=>pairDistance(o,a))),nearB=Math.min(...anchors.map(o=>pairDistance(o,b)));if(nearA!==nearB)return nearA-nearB;}
  return center(a)-center(b)||a.slot-b.slot||a.id.localeCompare(b.id);
 }).slice(0,seedCount);
 let best=null;
 for(const seed of seeds){
  const chosen=[seed],cluster=[...anchors,seed];
  let candidates=free.filter(o=>o.id!==seed.id).map(o=>({o,contacts:0,sum:0,max:0,nearest:Infinity}));
  const addMetric=(c,q)=>{const d=pairDistance(c.o,q);c.sum+=d;c.max=Math.max(c.max,d);c.nearest=Math.min(c.nearest,d);if(areNeighbors(c.o,q,gap))c.contacts++;};
  for(const c of candidates)for(const q of cluster)addMetric(c,q);
  while(chosen.length<count&&candidates.length){
   let winner=0,score=null;
   for(let i=0;i<candidates.length;i++){const c=candidates[i],rank=[c.contacts?0:1,-c.contacts,c.max,c.sum,c.nearest,center(c.o),c.o.slot];if(score===null||compareScores(rank,score)<0){winner=i;score=rank;}}
   const q=candidates.splice(winner,1)[0].o;chosen.push(q);cluster.push(q);for(const c of candidates)addMetric(c,q);
  }
  let diameter=0,contacts=0;
  for(let i=0;i<cluster.length;i++)for(let j=0;j<i;j++){diameter=Math.max(diameter,pairDistance(cluster[i],cluster[j]));if(areNeighbors(cluster[i],cluster[j],gap))contacts++;}
  const rank=[groupComponents(cluster,gap),diameter,-contacts,chosen.reduce((sum,o)=>sum+center(o),0),center(seed),seed.slot];
  if(best===null||compareScores(rank,best.rank)<0)best={chosen,rank};
 }
 return best?.chosen??[];
}
function autofill(state,includeBeacons=false){
 const {players,seats,reserved}=autofillOptions(state,includeBeacons),assigned=Math.min(players.length,seats.length);
 if(!assigned)return {state,assigned:0,remaining:players.length,freeSeats:seats.length,reserved,splitGroups:[]};
 const next=clone(state),unassigned=new Set(players.map(p=>p.id)),available=new Map(seats.map(o=>[o.id,o])),placements=new Map();
 const order=new Map(state.players.map((p,i)=>[p.id,i])),byId=new Map(state.players.map(p=>[p.id,p]));
 const distance=o=>(o.x-state.origin.mapX)**2+(o.y-state.origin.mapY)**2;
 const seatOrder=(a,b)=>distance(a)-distance(b)||a.slot-b.slot||a.id.localeCompare(b.id);
 const units=[],grouped=new Set();
 for(const group of state.groups??[]){
  const members=group.playerIds.filter(id=>unassigned.has(id));if(!members.length)continue;
  for(const id of members)grouped.add(id);
  units.push({members,anchors:state.objects.filter(o=>group.playerIds.includes(o.playerId)),score:groupPriority(state,group),order:Math.min(...group.playerIds.map(id=>order.get(id)))});
 }
 for(const player of players)if(!grouped.has(player.id))units.push({members:[player.id],anchors:[],score:priorityOf(player),order:order.get(player.id)});
 // Fixed placements constrain nearby group seats. All other groups and individuals share one priority ranking.
 units.sort((a,b)=>Number(!!b.anchors.length)-Number(!!a.anchors.length)||a.score-b.score||a.order-b.order);
 for(const unit of units){
  const members=[...unit.members].sort((a,b)=>priorityOf(byId.get(a))-priorityOf(byId.get(b))||order.get(a)-order.get(b));
  const count=Math.min(members.length,available.size),free=[...available.values()];
  const chosen=unit.members.length===1&&!unit.anchors.length?free.slice(0,count):groupSeats(state,free,unit.anchors,count);
  // Higher-priority members occupy the inner side of their selected cluster; existing members remain fixed.
  chosen.sort(seatOrder).forEach((seat,i)=>{placements.set(seat.id,members[i]);available.delete(seat.id);});
 }
 for(const o of next.objects)if(placements.has(o.id))o.playerId=placements.get(o.id);
 const splitGroups=(next.groups??[]).filter(g=>g.playerIds.length>1&&g.playerIds.some(id=>unassigned.has(id))).filter(g=>{
  const objects=next.objects.filter(o=>g.playerIds.includes(o.playerId));return objects.length<g.playerIds.length||groupComponents(objects,state.layout==='compact'?0:1)>1;
 }).map(g=>g.id);
 return {state:next,assigned:placements.size,remaining:players.length-placements.size,freeSeats:seats.length-placements.size,reserved,splitGroups};
}
function assign(state,playerId,objectId,replace=false){
 const obj=state.objects.find(o=>o.id===objectId);
 if(!obj||obj.type!=='base')throw new Error(t('Spieler können nur auf einer Basis sitzen.'));
 if(!state.players.some(p=>p.id===playerId))throw new Error(t('Spieler nicht gefunden.'));
 if(obj.playerId&&obj.playerId!==playerId&&!replace)throw new Error(t('Dieser Platz ist bereits vergeben. Wähle einen freien Platz.'));
 const next=clone(state);for(const o of next.objects)if(o.playerId===playerId)o.playerId=null;
 next.objects.find(o=>o.id===objectId).playerId=playerId;return next;
}
function unassign(state,objectId){const next=clone(state);const obj=next.objects.find(o=>o.id===objectId);if(obj?.type==='base')obj.playerId=null;return next;}
function unassignAll(state){
 if(!state.objects.some(o=>o.type==='base'&&o.playerId))return state;
 const next=clone(state);for(const o of next.objects)if(o.type==='base')o.playerId=null;return next;
}
function removePlayer(state,id){const next=clone(state);next.players=next.players.filter(p=>p.id!==id);for(const g of next.groups??[])g.playerIds=g.playerIds.filter(p=>p!==id);for(const o of next.objects)if(o.playerId===id)o.playerId=null;return next;}
// Align the entire plan via its reference's bottom-left tile. Individual moves never recalibrate the world.
function setOrigin(state,x,y){
 requireCoordinates(x,y);const half=isSeason4(state)?4:1;
 if(x+half*2>=WORLD_SIZE||y+half*2>=WORLD_SIZE)throw new Error(t('Das gesamte Objekt muss innerhalb der Karte liegen (X/Y 0–999).'));
 const next={...clone(state),origin:{...state.origin,x:x+half,y:y+half}};
 for(const o of next.objects)assertWorldPlacement(next,o);return next;
}
function updateObject(state,id,patch){
 const next=clone(state),obj=next.objects.find(o=>o.id===id);if(!obj)throw new Error(t('Element nicht gefunden.'));
 if(obj.type==='terrain'){
  if(obj.terrainGroup&&(patch.w!==undefined||patch.h!==undefined))throw new Error(t('Löse die Terrainverbindung, um einzelne Teile zu vergrößern.'));
  const oldRect=rect(obj);
  if(patch.w!==undefined){if(!Number.isInteger(patch.w)||!finite(patch.w,1,60))throw new Error(t('Breite: 1 bis 60 Felder.'));obj.w=patch.w;}
  if(patch.h!==undefined){if(!Number.isInteger(patch.h)||!finite(patch.h,1,60))throw new Error(t('Höhe: 1 bis 60 Felder.'));obj.h=patch.h;}
  obj.x=oldRect.left+obj.w/2;obj.y=oldRect.bottom+obj.h/2;
 }
 if(patch.name!==undefined&&obj.type!=='base'){const name=normalizeName(patch.name).slice(0,80);obj.name=name||DEFAULT_NAMES[obj.type];if(name)obj.customName=true;else delete obj.customName;}
 if(obj.type==='base'){
  if(patch.beacon!==undefined){if(patch.beacon!==null&&!/^[A-Z]$/.test(patch.beacon))throw new Error(t('Beacon-Buchstabe: A bis Z.'));if(patch.beacon&&next.objects.some(q=>q.id!==id&&q.beacon===patch.beacon))throw new Error(t('Dieser Beacon-Buchstabe ist bereits vergeben.'));obj.beacon=patch.beacon;}
  if(patch.lightSize!==undefined){if(!Number.isInteger(patch.lightSize)||!finite(patch.lightSize,1,101))throw new Error(t('Lichtbreite: 1 bis 101 Felder.'));obj.lightSize=patch.lightSize;}
  if(patch.electricians!==undefined){if(!Number.isInteger(patch.electricians)||!finite(patch.electricians,0,100))throw new Error(t('Elektriker: 0 bis 100.'));obj.electricians=patch.electricians;}
 }
 assertPlacement(next,obj);return next;
}
function terrainResizeCandidate(o,corner,x,y){
 if(o?.type!=='terrain'||o.terrainGroup||!['nw','ne','sw','se'].includes(corner)||!Number.isFinite(x)||!Number.isFinite(y))throw new Error(t('Ungültige Terrain-Größe.'));
 const r=rect(o),east=corner.endsWith('e'),north=corner.startsWith('n'),fixedX=east?r.left:r.right,fixedY=north?r.bottom:r.top;
 const w=Math.max(1,Math.min(60,Math.round((x-fixedX)*(east?1:-1)))),h=Math.max(1,Math.min(60,Math.round((y-fixedY)*(north?1:-1))));
 return {...o,w,h,x:fixedX+(east?1:-1)*w/2,y:fixedY+(north?1:-1)*h/2};
}
function resizeTerrain(state,id,corner,x,y){const o=state.objects.find(o=>o.id===id),candidate=terrainResizeCandidate(o,corner,x,y);assertPlacement(state,candidate);const next=clone(state);Object.assign(next.objects.find(o=>o.id===id),candidate);return next;}

function coverage(state,o){
 const lights=state.objects.filter(q=>q.type==='base'&&q.beacon).map(q=>({x:q.x,y:q.y,w:q.lightSize,h:q.lightSize}));
 const r=rect(o),contains=(a,x,y)=>{const b=rect(a);return x>=b.left-1e-8&&x<=b.right+1e-8&&y>=b.bottom-1e-8&&y<=b.top+1e-8;};
 const singleFull=lights.some(q=>contains(q,r.left,r.bottom)&&contains(q,r.right,r.top));
 const center=lights.some(q=>contains(q,o.x,o.y));
 if(singleFull)return {singleFull:true,unionFull:true,center:true};
 const clipped=lights.map(rect).map(q=>({left:Math.max(q.left,r.left),right:Math.min(q.right,r.right),bottom:Math.max(q.bottom,r.bottom),top:Math.min(q.top,r.top)})).filter(q=>q.left<q.right&&q.bottom<q.top);
 const edges=[...new Set([r.left,r.right,...clipped.flatMap(q=>[q.left,q.right])])].sort((a,b)=>a-b);let area=0;
 for(let i=1;i<edges.length;i++){const x=(edges[i-1]+edges[i])/2,intervals=clipped.filter(q=>x>q.left&&x<q.right).map(q=>[q.bottom,q.top]).sort((a,b)=>a[0]-b[0]);let length=0,low=null,high=null;
  for(const [a,b] of intervals){if(low===null){low=a;high=b;}else if(a<=high){high=Math.max(high,b);}else{length+=high-low;low=a;high=b;}}
  if(low!==null)length+=high-low;area+=(edges[i]-edges[i-1])*length;
 }
 return {singleFull:false,unionFull:Math.abs(area-o.w*o.h)<1e-7,center};
}
function bounds(state,includeLight=state.showLight){
 const all=[...state.objects];if(includeLight)for(const o of state.objects)if(o.beacon)all.push({x:o.x,y:o.y,w:o.lightSize,h:o.lightSize});
 if(!all.length)return {left:state.origin.mapX-20,right:state.origin.mapX+20,bottom:state.origin.mapY-20,top:state.origin.mapY+20};
 const rs=all.map(rect);return {left:Math.min(...rs.map(r=>r.left)),right:Math.max(...rs.map(r=>r.right)),bottom:Math.min(...rs.map(r=>r.bottom)),top:Math.max(...rs.map(r=>r.top))};
}
function validate(raw){
 if(!raw||raw.schema!==SCHEMA||![1,2,3,4,VERSION].includes(raw.version))throw new Error(t('Das ist keine unterstützte Hive-Plan-Datei.'));
 if(typeof raw.title!=='string'||raw.title.length>80)throw new Error(t('Ungültiger Planname.'));
 if(!raw.origin||!['x','y','mapX','mapY'].every(k=>Number.isSafeInteger(raw.origin[k])))throw new Error(t('Ungültiger Koordinatenursprung.'));
 if(!finite(raw.origin.x,0,999999)||!finite(raw.origin.y,0,999999)||!finite(raw.origin.mapX,-1000000000,1000000000)||!finite(raw.origin.mapY,-1000000000,1000000000))throw new Error(t('Ungültiger Koordinatenursprung.'));
 if(raw.origin.x>999||raw.origin.y>999)throw new Error(t(raw.version<5?'Der ältere Plan liegt außerhalb der neuen Karte (X/Y 0–999) und wurde nicht geladen.':'Ungültiger Koordinatenursprung.'));
 if(!Array.isArray(raw.players)||raw.players.length>300||!Array.isArray(raw.objects)||raw.objects.length>800)throw new Error(t('Die Datei enthält zu viele oder ungültige Elemente.'));
 const season=raw.version===1?'4':raw.season;
 if(!SEASONS.includes(season))throw new Error(t('Ungültige Season.'));
 const state={schema:SCHEMA,version:VERSION,season,groups:[],priorityLabels:['','',''],title:raw.title,origin:{x:raw.origin.x,y:raw.origin.y,mapX:raw.origin.mapX,mapY:raw.origin.mapY},showLight:raw.showLight!==false,layout:['spaced','compact','empty'].includes(raw.layout)?raw.layout:'empty',players:[],objects:[]};
 if(raw.version>=3){if(!Array.isArray(raw.priorityLabels)||raw.priorityLabels.length!==3||raw.priorityLabels.some(v=>typeof v!=='string'||v.length>40))throw new Error(t('Ungültige Prioritätsbezeichnungen.'));state.priorityLabels=raw.priorityLabels.map(normalizeName);}
 const ids=new Set(),names=new Set(),assigned=new Set(),beacons=new Set();
 const validId=id=>typeof id==='string'&&id.length>0&&id.length<=100&&/^[A-Za-z0-9_-]+$/.test(id);
 for(const p of raw.players){if(!p||!validId(p.id)||ids.has(p.id)||typeof p.name!=='string'||!normalizeName(p.name)||p.name.length>80||names.has(nameKey(p.name)))throw new Error(t('Ungültige oder doppelte Spieler.'));ids.add(p.id);names.add(nameKey(p.name));const priority=raw.version>=3?p.priority:2;if(!Number.isInteger(priority)||priority<1||priority>3)throw new Error(t('Priorität muss 1, 2 oder 3 sein.'));state.players.push({id:p.id,name:normalizeName(p.name),priority});}
 const groups=raw.version===1?emptyGroups():raw.groups,groupIds=new Set(),groupedPlayers=new Set();
 if(!Array.isArray(groups)||groups.length>10)throw new Error(t('Ungültige Gruppenliste.'));
 for(const g of groups){
  if(!g||!Number.isInteger(g.id)||g.id<1||g.id>10||groupIds.has(g.id)||!Array.isArray(g.playerIds)||g.playerIds.length>300)throw new Error(t('Ungültige Gruppenliste.'));
  groupIds.add(g.id);const playerIds=[];
  for(const id of g.playerIds){if(!ids.has(id)||groupedPlayers.has(id))throw new Error(t('Ein Spieler darf nur einer Gruppe angehören.'));groupedPlayers.add(id);playerIds.push(id);}
  state.groups.push({id:g.id,playerIds});
 }
 if(!isSeason4(state))state.showLight=false;
 const objIds=new Set();let centerCount=0,marshallCount=0;
 for(const o of raw.objects){
  if(!o||!validId(o.id)||objIds.has(o.id)||!['base','center','marshall','terrain'].includes(o.type)||!finite(o.x,-1000001000,1000001000)||!finite(o.y,-1000001000,1000001000))throw new Error(t('Ungültiges Kartenelement.'));
  objIds.add(o.id);const fixed=o.type==='center'?9:3,w=o.type==='terrain'?o.w:fixed,h=o.type==='terrain'?o.h:fixed;
  const terrainPosition=o.type==='terrain'&&(raw.version<5?(Number.isInteger(o.x*2)&&Number.isInteger(o.y*2)):(o.x===snap(o.x,w)&&o.y===snap(o.y,h)));
  if(!Number.isInteger(w)||!Number.isInteger(h)||!finite(w,1,60)||!finite(h,1,60)||o.w!==w||o.h!==h||!(o.type==='terrain'?terrainPosition:(o.x===snap(o.x,w)&&o.y===snap(o.y,h))))throw new Error(t('Ungültige Größe oder Position eines Elements.'));
  const q={id:o.id,type:o.type,x:o.x,y:o.y,w,h};
  if(raw.version<5&&o.type==='terrain'){q.x=Math.floor(o.x-(w-1)/2)+(w-1)/2;q.y=Math.floor(o.y-(h-1)/2)+(h-1)/2;}
  if(o.type==='base'){
   if(!Number.isInteger(o.slot)||!finite(o.slot,1,100000)||!Number.isInteger(o.lightSize)||!finite(o.lightSize,1,101)||!Number.isInteger(o.electricians)||!finite(o.electricians,0,100))throw new Error(t('Ungültige Basis-Einstellungen.'));
   if(o.playerId!==null&&(!ids.has(o.playerId)||assigned.has(o.playerId)))throw new Error(t('Eine Spielerzuweisung ist ungültig oder doppelt.'));
   if(o.playerId)assigned.add(o.playerId);
   if(o.beacon!==null&&(!/^[A-Z]$/.test(o.beacon)||beacons.has(o.beacon)))throw new Error(t('Ungültige oder doppelte Beacons.'));
   if(o.beacon)beacons.add(o.beacon);
   Object.assign(q,{slot:o.slot,playerId:o.playerId,beacon:o.beacon,lightSize:o.lightSize,electricians:o.electricians});
   if(o.spacing!==undefined){if(!Number.isInteger(o.spacing)||o.spacing<0||o.spacing>2)throw new Error(t('Ungültiger Füllbereich oder Basisabstand.'));q.spacing=o.spacing;}
  }else{if(typeof o.name!=='string'||o.name.length>80)throw new Error(t('Ungültiger Elementname.'));q.name=o.name;if(o.customName!==undefined){if(typeof o.customName!=='boolean')throw new Error(t('Ungültiger Elementname.'));q.customName=o.customName;}if(o.type==='terrain'&&o.terrainGroup!==undefined){if(!validId(o.terrainGroup))throw new Error(t('Ungültige Terrain-Gruppe.'));q.terrainGroup=o.terrainGroup;}}
  if(o.type==='center')centerCount++;
  if(o.type===anchorType(state)&&(o.x!==state.origin.mapX||o.y!==state.origin.mapY))throw new Error(t('Mittelpunkt und Koordinatenursprung stimmen nicht überein.'));
  if(o.type==='marshall')marshallCount++;
  if(centerCount>1||marshallCount>1)throw new Error(t('Zentrum oder Marshall mehrfach vorhanden.'));
  if(raw.version<5){try{assertWorldPlacement(state,q);}catch{throw new Error(t('Der ältere Plan liegt außerhalb der neuen Karte (X/Y 0–999) und wurde nicht geladen.'));}}
  assertPlacement(state,q);state.objects.push(q);
 }
 for(const group of new Set(state.objects.filter(o=>o.terrainGroup).map(o=>o.terrainGroup)))if(!terrainsConnected(state.objects.filter(o=>o.terrainGroup===group)))throw new Error(t('Ungültige Terrain-Gruppe.'));
 return state;
}
root.HiveModel={SCHEMA,VERSION,WORLD_SIZE,worldBounds,referenceCoords,assertWorldPlacement,setObjectCorner,PRIORITY_DEFAULTS,priorityOf,priorityLabel,setPlayerPriorities,setPriorityLabel,setPlayerGroups,groupPriority,SEASONS,emptyGroups,isSeason4,isDeveloping,anchorType,setSeason,groupForPlayer,setPlayerGroup,clearPlayers,areNeighbors,groupComponents,terrainResizeCandidate,resizeTerrain,terrainCornerCoords,terrainPositionFromCornerCoords,setTerrainCorner,connectTerrains,disconnectTerrains,terrainTouching,terrainsConnected,terrainParts,expandObjectIds,objectBounds,terrainUnionGeometry,planBaseFill,fillBases,moveObjects,removeObjects,COLORS,clone,uid,normalizeName,snap,rect,overlaps,coords,positionFromCoords,playerFor,objectForPlayer,objectLabel,makeLayout,collision,assertPlacement,moveObject,nextBeacon,makeObject,addObject,removeObject,parsePlayerFile,decodePlayerFile,importPlayers,addPlayers,autofillOptions,autofill,assign,unassign,unassignAll,removePlayer,setOrigin,updateObject,coverage,bounds,validate};
})(globalThis);
