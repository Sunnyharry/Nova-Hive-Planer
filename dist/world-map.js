/* Static world data uses game coordinates. Images never define collision geometry. */
(function(root){
'use strict';
const types=['mountain','lake','stone_statue','sushi_restaurant','city','capital','stronghold','trading_post','special_structure_tree','special_structure_mountain','cannon'];
const terrain=new Set(types.slice(0,4)),cache=new Map(),identities=new WeakMap();
const tr=k=>root.HiveI18n?.t(k)??k;
const names={mountain:'Berge',lake:'Seen',stone_statue:'Statuen',sushi_restaurant:'Sushi-Restaurants',city:'Stadt',capital:'Hauptstadt',stronghold:'Stronghold',trading_post:'Trading Post',special_structure_tree:'Sonderbauwerk Baum',special_structure_mountain:'Sonderbauwerk Berg',cannon:'Geschütz',mud:'Schlamm'};
const fail=()=>{throw Error(tr('Ungültige Kartendaten.'));};
const integer=n=>Number.isInteger(n)&&n>=0&&n<1000;
function bounds(b){if(!b||!['minX','maxX','minY','maxY'].every(k=>integer(b[k]))||b.minX>b.maxX||b.minY>b.maxY)fail();return {minX:b.minX,maxX:b.maxX,minY:b.minY,maxY:b.maxY};}
function runs(cells){if(!Array.isArray(cells)||!cells.length||cells.length>1000000)fail();const rows=new Map();for(const c of cells){if(!Array.isArray(c)||c.length!==2||!c.every(integer))fail();if(!rows.has(c[1]))rows.set(c[1],new Set());rows.get(c[1]).add(c[0]);}const result=[];for(const [y,row] of [...rows].sort((a,b)=>a[0]-b[0])){let start=-1,last=-1;for(const x of [...row].sort((a,b)=>a-b)){if(start<0)start=x;else if(x!==last+1){result.push([y,start,last]);start=x;}last=x;}result.push([y,start,last]);}return result;}
function validate(raw){
 if(!raw||raw.schema!=='nova-static-map'||raw.version!==1||raw.season!=='4'||!Array.isArray(raw.areas)||raw.areas.length>4000||!Array.isArray(raw.mud)||raw.mud.length>4000)fail();
 const ids=new Set();let total=0;
 function id(v){if(typeof v!=='string'||! /^[a-zA-Z0-9_-]{1,100}$/.test(v)||ids.has(v))fail();ids.add(v);return v;}
 const areas=raw.areas.map(a=>{if(!a||!types.includes(a.type)||!Array.isArray(a.runs)||!a.runs.length||a.runs.length>100000)fail();const b=bounds(a.bounds),out={id:id(a.id),type:a.type,bounds:b,level:Number.isInteger(a.level)&&a.level>=1&&a.level<=7?a.level:1,runs:[]};for(const r of a.runs){if(!Array.isArray(r)||r.length!==3||!r.every(integer)||r[1]>r[2]||r[0]<b.minY||r[0]>b.maxY||r[1]<b.minX||r[2]>b.maxX)fail();total+=r[2]-r[1]+1;if(total>1000000)fail();out.runs.push([...r]);}return out;});
 const mud=raw.mud.map(a=>({id:id(a.id),bounds:bounds(a.bounds)}));return {schema:'nova-static-map',version:1,season:'4',areas,mud};
}
function parse(raw){
 if(!raw||!['1.0','2.0'].includes(raw.schemaVersion)||raw.map?.game!=='Last War: Survival'||raw.map.season!=='S04'||raw.map.width!==1000||raw.map.height!==1000||raw.map.coordinatesTransformed!==false||raw.map.coordinateSystem!=='source_grid_coordinates'||!Array.isArray(raw.blockAreas)||raw.blockAreas.length>4000)fail();
 if(raw.schemaVersion==='2.0'&&!Array.isArray(raw.mudAreas))fail();
 return validate({schema:'nova-static-map',version:1,season:'4',areas:raw.blockAreas.map(a=>{if(a.blocksBasePlacement!==true)fail();return {id:a.id,type:a.type,level:a.objects?.[0]?.level,bounds:bounds(a.boundsInclusive),runs:runs(a.cells)};}),mud:(raw.mudAreas??[]).map(a=>{if(a.blocksBasePlacement!==false||a.alwaysPvp!==true)fail();return {id:a.id,bounds:bounds(a.boundsInclusive)};})});
}
function apply(state,data,chosen={terrain:true,buildings:true,mud:true}){if(state.season!==data.season)throw Error(tr('Kartendaten passen nicht zur ausgewählten Season.'));const current=state.worldMap??{areas:[],mud:[]};return {...state,worldMap:validate({...data,areas:[...current.areas.filter(a=>!chosen[terrain.has(a.type)?'terrain':'buildings']),...data.areas.filter(a=>chosen[terrain.has(a.type)?'terrain':'buildings'])],mud:chosen.mud?data.mud:current.mud})};}
function index(data){
 if(!data)return null;if(identities.has(data))return identities.get(data);const key=JSON.stringify(data);if(cache.has(key)){const found=cache.get(key);identities.set(data,found);return found;}
 const blocked=new Uint8Array(1000000),mud=new Uint8Array(1000000);for(const a of data.areas)for(const [y,l,r] of a.runs)blocked.fill(1,y*1000+l,y*1000+r+1);for(const a of data.mud){const b=a.bounds;for(let y=b.minY;y<=b.maxY;y++)mud.fill(1,y*1000+b.minX,y*1000+b.maxX+1);}
 const value={blocked,mud};identities.set(data,value);cache.set(key,value);if(cache.size>3)cache.delete(cache.keys().next().value);return value;
}
function footprint(state,o){const M=root.HiveModel,q=M.solidFootprint(o),r=M.rect(q),b=M.worldBounds(state);return {minX:Math.max(0,Math.floor(r.left-b.left+1e-7)),maxX:Math.min(999,Math.ceil(r.right-b.left-1e-7)-1),minY:Math.max(0,Math.floor(r.bottom-b.bottom+1e-7)),maxY:Math.min(999,Math.ceil(r.top-b.bottom-1e-7)-1)};}
function intersects(mask,b){for(let y=b.minY;y<=b.maxY;y++)for(let x=b.minX;x<=b.maxX;x++)if(mask[y*1000+x])return true;return false;}
function status(state,o){if(['note','missile'].includes(o.type))return {blocked:false,mud:false};const i=index(state.worldMap),b=footprint(state,o),mud=o.type==='base'&&root.HiveModel?.mudContact?root.HiveModel.mudContact(state,o).count>0:!!i&&intersects(i.mud,b);return {blocked:!!i&&intersects(i.blocked,b),mud};}
function eligible(state,o){return root.HiveModel?.baseSeatEligible?root.HiveModel.baseSeatEligible(state,o):!status(state,o).blocked;}
function options(state){return {terrain:true,buildings:true,mud:true,labels:true,grid:true,...state.mapOptions};}
function validateOptions(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw))fail();const out={};for(const k of ['terrain','buildings','mud','labels','grid','avoidMud','mudEdge'])if(raw[k]!==undefined){if(typeof raw[k]!=='boolean')fail();out[k]=raw[k];}return out;}
const rect=b=>`x="${b.minX-.5}" y="${-b.maxY-.5}" width="${b.maxX-b.minX+1}" height="${b.maxY-b.minY+1}"`;
const colors={mountain:'#727765',lake:'#3d9ab8',stone_statue:'#ada295',sushi_restaurant:'#b47757'};
function outline(area){const cells=new Set();for(const [y,l,r] of area.runs)for(let x=l;x<=r;x++)cells.add(y*1000+x);let path='';for(const [y,l,r] of area.runs)for(let x=l;x<=r;x++){const px=x-.5,py=-y-.5;if(y===999||!cells.has((y+1)*1000+x))path+=`M${px} ${py}h1`;if(y===0||!cells.has((y-1)*1000+x))path+=`M${px} ${py+1}h1`;if(x===0||!cells.has(y*1000+x-1))path+=`M${px} ${py}v1`;if(x===999||!cells.has(y*1000+x+1))path+=`M${px+1} ${py}v1`;}return path;}
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function sprite(a){const detailed={special_structure_tree:'sacred-tree.webp',special_structure_mountain:'sacred-mountain.webp',stone_statue:'statue.webp',sushi_restaurant:'sushi-restaurant.webp',trading_post:'trading-post.webp'}[a.type];if(detailed&&root.HiveMapAssets?.[detailed])return detailed;if(a.type==='stronghold')return 'zyf_S4_city2.png';if(a.type==='trading_post')return 'zyf_S4_city3.png';if(['city','capital'].includes(a.type)){const level=a.type==='capital'?7:a.level;return root.HiveMapAssets?.['city-'+level+'.webp']?'city-'+level+'.webp':`zyf_S4_city${2*level+3}.png`;}return {special_structure_tree:'zyf_S4_wujisuofang_5.png',special_structure_mountain:'zyf_S4_wujisuofang_2.png',cannon:'zyf_S4_wujisuofang_6.png'}[a.type];}
const visualCache=new WeakMap();
function terrainVisual(a){if(visualCache.has(a))return visualCache.get(a);const v=root.HiveMapVisuals?.[a.id];let hash=2166136261;if(v?.type===a.type)for(const [y,l,r] of a.runs)for(let x=l;x<=r;x++)hash=Math.imul(hash^(y*1000+x),16777619)>>>0;const result=v?.type===a.type&&v.signature===hash?v:null;visualCache.set(a,result);return result;}
function assetDefinitions(){return Object.entries(root.HiveMapAssets??{}).map(([key,uri])=>{const aspect=/^(mountain-|lake-s4)/.test(key)?'none':'xMidYMid meet';return `<symbol id="asset-${key.replace(/[^a-zA-Z0-9]/g,'-')}" viewBox="0 0 1 1" preserveAspectRatio="${aspect}"><image href="${uri}" width="1" height="1" preserveAspectRatio="${aspect}"/></symbol>`;}).join('');}
function baseArtwork(o,caption=true){
 if(!root.HiveMapAssets?.['base-hq27.webp'])return '';
 return `<g data-base-art="hq27" data-theme-preserve="true" pointer-events="none" transform="translate(${o.x} ${-o.y})"><use href="#asset-base-hq27-webp" x="-1.4" y="-1.44" width="2.8" height="${caption?2.05:2.8}"/>${caption?'<rect x="-1.43" y=".12" width="2.86" height="1.31" rx=".1" fill="#0c1723" fill-opacity=".88"/>':''}</g>`;
}
function centerArtwork(o,caption=true){
 if(!root.HiveMapAssets?.['alliance-center.webp'])return '';
 return `<g data-center-art="s4" data-theme-preserve="true" pointer-events="none" transform="translate(${o.x} ${-o.y})"><use href="#asset-alliance-center-webp" x="-4.35" y="-4.35" width="8.7" height="${caption?6.8:8.7}"/>${caption?'<rect x="-4.35" y="1.35" width="8.7" height="2.95" rx=".18" fill="#0c1723" fill-opacity=".88"/>':''}</g>`;
}
function rechargeOverlay(state,o){
 const M=root.HiveModel,r=M.rechargeBounds(state,o);if(!r)return '';
 const color=M.allianceColor(state,M.allianceOf(o)),label=esc(tr('Stromaufladebereich'))+' · 41 × 41';
 return `<g data-recharge-range="${esc(o.id)}" data-theme-preserve="true" pointer-events="none"><title>${label}</title><rect x="${r.left}" y="${-r.top}" width="${r.right-r.left}" height="${r.top-r.bottom}" fill="${color}" fill-opacity=".075" stroke="${color}" stroke-width=".16" stroke-dasharray=".65 .3"/><text x="${(r.left+r.right)/2}" y="${-r.top+1.1}" text-anchor="middle" font-size=".65" fill="#fff" stroke="#182620" stroke-width=".16" paint-order="stroke">${label}</text></g>`;
}
function planLabel(a){
 const b=a.bounds,cx=(b.minX+b.maxX)/2,cy=(b.minY+b.maxY)/2,w=b.maxX-b.minX+1,h=b.maxY-b.minY+1;
 const name=tr(names[a.type])+(['city','capital'].includes(a.type)?' · '+tr('Stufe')+' '+a.level:''),coords=`X ${cx} / Y ${cy}`,dimensions=`${w} × ${h}`;
 const size=Math.min(1.5,Math.max(.65,Math.min(w,h)/8),(w-.25)/Math.max([...name].length*.56,coords.length*.4,dimensions.length*.4),h/4);
 return `<g class="world-map-label" data-map-label="${a.id}" transform="translate(${cx} ${-cy})" pointer-events="none" text-anchor="middle" dominant-baseline="middle" fill="white" stroke="#182620" stroke-width="${size*.16}" stroke-linejoin="round" paint-order="stroke"><text y="${-size*1.15}" font-size="${size}" font-weight="600">${esc(name)}</text><text y="0" font-size="${size*.72}">${dimensions}</text><text y="${size*1.05}" font-size="${size*.72}">${coords}</text></g>`;
}
function render(state,view=null,scale=12,interactive=false,selected=null,externalAssets=false){
 const M=root.HiveModel,opt=options(state),game=state.mapStyle==='game',assets=root.HiveMapAssets??{},world=M.worldBounds(state),dx=world.left+.5,dy=world.bottom+.5,data=state.worldMap;
 const visible=b=>!view||(b.maxX+dx+3>=view.x&&b.minX+dx-3<=view.x+view.w&&-b.minY-dy+3>=view.y&&-b.maxY-dy-3<=view.y+view.h);
 const image=(key,attrs)=>assets[key]?`<use href="#asset-${key.replace(/[^a-zA-Z0-9]/g,'-')}" ${attrs}/>`:'';
 let s='<g data-theme-preserve="true" pointer-events="none">';
 if(game&&!externalAssets)s+='<defs>'+assetDefinitions()+'</defs>';
 if(game){s+='<defs>';for(const [id,key,size] of [['map-grass','O_env_ground_caodi02_s4.png',24],['map-mud','O_terrain_heitudi_D_sj.png',12]])s+=`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${id==='map-grass'?'#688051':'#665043'}"/>${image(key,`width="${size}" height="${size}" opacity=".72"`)}</pattern>`;s+='</defs>';s+=`<rect x="${world.left}" y="${-world.top}" width="1000" height="1000" fill="url(#map-grass)"/>`;}
 s+=`<g transform="translate(${dx} ${-dy})">`;
 if(data&&opt.mud)for(const a of data.mud){if(!visible(a.bounds))continue;s+=`<rect ${interactive?`data-map-area="${a.id}" pointer-events="auto" tabindex="0" role="button" aria-label="${esc(tr(names.mud))}"`:""} ${rect(a.bounds)} stroke="${selected===a.id?"#ffe075":"none"}" stroke-width=".13" fill="${game?'url(#map-mud)':'#765638'}" fill-opacity="${game?'.95':'.5'}"/>`;}
 if(data)for(const a of data.areas){if(!opt[terrain.has(a.type)?'terrain':'buildings']||!visible(a.bounds))continue;const b=a.bounds,cx=(b.minX+b.maxX)/2,cy=(b.minY+b.maxY)/2,w=b.maxX-b.minX+1,h=b.maxY-b.minY+1,path=a.runs.map(([y,l,r])=>`M${l-.5} ${-y-.5}h${r-l+1}v1h-${r-l+1}z`).join('');
 s+=`<g ${interactive?`data-map-area="${a.id}" pointer-events="auto" tabindex="0" role="button" aria-label="${esc(tr(names[a.type]))} X ${cx} Y ${cy}"`:''}><title>${esc(tr(names[a.type]))} · X ${cx} / Y ${cy} · ${w} × ${h}</title><path d="${path}" fill="${colors[a.type]??'#8996ad'}" fill-opacity="${game&&!terrain.has(a.type)?'.4':'.9'}"/>`;
 if(game&&(!terrain.has(a.type)||['stone_statue','sushi_restaurant'].includes(a.type)))s+=image(sprite(a),`x="${cx-w*.7}" y="${-cy-h*.9}" width="${w*1.4}" height="${h*1.4}" pointer-events="none"`);
 if(game&&terrain.has(a.type)){const visual=terrainVisual(a);if(visual){s+=`<defs><clipPath id="map-art-${a.id}"><path d="${path}"/></clipPath></defs><g data-map-art="${a.id}" clip-path="url(#map-art-${a.id})" pointer-events="none">`;for(const o of visual.instances)s+=`<g transform="translate(${o.cx} ${-o.cy}) rotate(${o.angle}) scale(${o.scale})">`+image(o.asset,`x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}"`)+'</g>';s+='</g>';}}
 if(opt.labels){if(!game)s+=planLabel(a);else if(scale>=4&&(!terrain.has(a.type)||['stone_statue','sushi_restaurant'].includes(a.type)))s+=`<text x="${cx}" y="${-cy+h/2+.9}" text-anchor="middle" font-size=".65" fill="white" stroke="#182620" stroke-width=".16" paint-order="stroke">${esc(tr(names[a.type]))}${['city','capital'].includes(a.type)?' '+a.level:''}</text>`;}
 if(selected===a.id)s+=`<path d="${outline(a)}" fill="none" stroke="#ffe075" stroke-width="2" vector-effect="non-scaling-stroke"/>`;s+='</g>';
 }
 s+='</g>';

 return s+'</g>';
}
root.HiveWorldMap={parse,validate,apply,index,status,eligible,options,validateOptions,render,terrain,names,assetDefinitions,baseArtwork,centerArtwork,rechargeOverlay};
})(globalThis);
