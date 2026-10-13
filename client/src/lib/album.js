export const CATS=[{id:'skin',label:'Skin / face'},{id:'hair',label:'Hair / scalp'},{id:'length',label:'Length / density'},{id:'other',label:'Other care'}];
export function catLabel(id){const c=CATS.filter(function(x){return x.id===id;})[0];return c?c.label:id;}
export function load(){try{return JSON.parse(localStorage.getItem('album')||'[]');}catch(e){return[];}}
export function saveAll(list){localStorage.setItem('album',JSON.stringify(list));}
export function setup(){try{return JSON.parse(localStorage.getItem('album-setup')||'null');}catch(e){return null;}}
export function saveSetup(s){localStorage.setItem('album-setup',JSON.stringify(s));}
export function compress(file){
return new Promise(function(resolve,reject){
if(!file.type || file.type.indexOf('image/')!==0){reject(new Error('Not an image — JPG/PNG only.'));return;}
const url=URL.createObjectURL(file);const img=new Image();
img.onload=function(){
try{
const max=900;let w=img.width,h=img.height;const sc=Math.min(1,max/Math.max(w,h));w=Math.round(w*sc);h=Math.round(h*sc);
const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
URL.revokeObjectURL(url);resolve(c.toDataURL('image/jpeg',0.72));
}catch(e){URL.revokeObjectURL(url);reject(new Error('Could not read that photo.'));}
};
img.onerror=function(){URL.revokeObjectURL(url);reject(new Error('Could not read that photo.'));};
img.src=url;
});
}
export function distinctWeeks(list){const s={};list.forEach(function(e){const d=new Date(e.day);const one=new Date(d.getFullYear(),0,1);const wk=Math.ceil((((d-one)/864e5)+one.getDay()+1)/7);s[d.getFullYear()+'-W'+wk]=1;});return Object.keys(s).length;}
export function milestones(list){
const out=[];if(!list.length){return out;}
out.push({id:'first',label:'First photo uploaded',done:true});
const w=distinctWeeks(list);
out.push({id:'w4',label:'4 weekly check-ins',done:w>=4,prog:Math.min(w,4)+'/4'});
out.push({id:'w8',label:'8 weeks of tracking',done:w>=8,prog:Math.min(w,8)+'/8'});
const days=list.length?Math.round((new Date()-new Date(list.slice().sort(function(a,b){return a.day<b.day?-1:1;})[0].day))/864e5):0;
out.push({id:'m3',label:'3 months documented',done:days>=90,prog:Math.min(days,90)+'/90d'});
return out;
}
export function insights(list){
const photos=list.reduce(function(a,e){return a+(e.photos||[]).length;},0);
const sorted=list.slice().sort(function(a,b){return a.day<b.day?-1:1;});
const first=sorted[0]?sorted[0].day:null;const latest=sorted[sorted.length-1];
const byCat={};list.forEach(function(e){(e.photos||[]).forEach(function(){byCat[e.cat]=(byCat[e.cat]||0)+1;});});
let pairs=0;Object.keys(byCat).forEach(function(k){const n=byCat[k];pairs+=n*(n-1)/2;});
return{weeks:distinctWeeks(list),photos:photos,elapsed:first?Math.round((new Date()-new Date(first))/864e5):0,latest:latest?latest.day:null,pairs:pairs};
}
