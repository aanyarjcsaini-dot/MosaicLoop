// Centralized shelf math. Convention: start day = day 1.
// remaining = max(0, expectedDays - elapsedDays), elapsed = full days between start(local) and today(local).
export function dayKey(d=new Date()){const p=n=>String(n).padStart(2,'0');return`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;}
export function daysBetween(a,b){const pa=a.split('-').map(Number),pb=b.split('-').map(Number);
return Math.round((new Date(pb[0],pb[1]-1,pb[2])-new Date(pa[0],pa[1]-1,pa[2]))/864e5);}
export function estimate(item,prod,today=dayKey()){
if(!item.startDate||!prod)return{state:'needs-dates'};
const perDay=item.perDayOverride||prod.perDay;
const expected=item.expectedOverride||Math.ceil(prod.pack/perDay);
const elapsed=Math.max(0,daysBetween(item.startDate,today));
const remaining=Math.max(0,expected-elapsed);
const d=new Date();d.setDate(d.getDate()+remaining);
return{state:remaining===0?'depleted':'ok',expected,elapsed,remaining,perDay,finish:d.toISOString().slice(0,10)};
}
export function logs(){try{return JSON.parse(localStorage.getItem('events')||'{}');}catch{return{};}}
export function logDay(k,ev){const L=logs();L[k]=L[k]||[];if(!L[k].includes(ev))L[k].push(ev);localStorage.setItem('events',JSON.stringify(L));}
export function shelf(){try{const s=JSON.parse(localStorage.getItem('shelf2')||'null')||seed();return ensureFourth(s);}catch(e){return seed();}}
function ensureFourth(s){s=s.filter(function(x){return x.id!=='demo-restock'&&!x.demo;});
if(!s.some(function(x){return x.id==='s1'||x.id==='s2';})){try{saveShelf(s);}catch(e){}return s;}
if(s.some(function(x){return x.id==='s4';})){return s;}
const n=[...s,{id:'s4',pid:'bb-sleep',startDate:off(26),perDayOverride:null,expectedOverride:null,confirmations:[],snoozeUntil:null,lastPrompt:null,muted:false,status:'open'}];
try{saveShelf(n);}catch(e){}return n;}
export function seed(){const s=[{id:'s1',pid:'bb-rollon',startDate:off(12),perDayOverride:null,expectedOverride:null,confirmations:[off(1),off(0)],snoozeUntil:null,lastPrompt:null,status:'open'},{id:'s2',pid:'bb-biotin-30',startDate:off(9),perDayOverride:null,expectedOverride:null,confirmations:[off(0)],snoozeUntil:null,lastPrompt:null,status:'open'},{id:'s4',pid:'bb-sleep',startDate:off(26),perDayOverride:null,expectedOverride:null,confirmations:[],snoozeUntil:null,lastPrompt:null,muted:false,status:'open'}];
localStorage.setItem('shelf2',JSON.stringify(s));return s;}
function off(n){const d=new Date();d.setDate(d.getDate()-n);return dayKey(d);}
export function saveShelf(s){localStorage.setItem('shelf',JSON.stringify(s));localStorage.setItem('shelf2',JSON.stringify(s));}
export function confirmToday(item){const t=dayKey();const c=item.confirmations||[];if(c.includes(t))return item;
return{...item,confirmations:[...c,t]};}
export function usageMap(){try{return JSON.parse(localStorage.getItem('usage')||'{}');}catch(e){return{};}}
export function usageDays(pid){const a=usageMap()[pid]||[];return a.slice().sort();}
export function rawShelf(){try{return JSON.parse(localStorage.getItem('shelf2')||'[]');}catch(e){return[];}}
export function confirmProduct(pid,day){
const m=usageMap();const a=m[pid]||[];if(a.indexOf(day)<0){a.push(day);}m[pid]=a;
localStorage.setItem('usage',JSON.stringify(m));
const items=rawShelf();let changed=false;
items.forEach(function(it){if(it.pid===pid){it.confirmations=it.confirmations||[];if(it.confirmations.indexOf(day)<0){it.confirmations.push(day);changed=true;}}});
if(changed){saveShelf(items);}
return items;
}
export function needsRestock(item,prod,today){const t=today||dayKey();const e=estimate(item,prod,t);if(e.state==='depleted'){return true;}if(e.state!=='ok'){return false;}return e.remaining<=(prod.thresholdDays||5);}
export function dueForPrompt(item,prod,today=dayKey()){
const e=estimate(item,prod,today);if(e.state!=='ok')return e.state==='depleted';
if(item.snoozeUntil&&item.snoozeUntil>today)return false;
if(item.lastPrompt&&daysBetween(item.lastPrompt,today)<3)return false;
return e.remaining<=(prod.thresholdDays||5);}
// product-use streak days derived from confirmations across items
export function productUseDays(items){const s=new Set();items.forEach(it=>(it.confirmations||[]).forEach(d=>s.add(d)));return[...s].sort();}
