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
export function shelf(){try{return JSON.parse(localStorage.getItem('shelf2')||'null')||seed();}catch{return seed();}}
export function seed(){const s=[{id:'s1',pid:'bb-rollon',startDate:off(12),perDayOverride:null,expectedOverride:null,confirmations:[off(1),off(0)],snoozeUntil:null,lastPrompt:null,status:'open'},{id:'s2',pid:'bb-biotin-30',startDate:off(9),perDayOverride:null,expectedOverride:null,confirmations:[off(0)],snoozeUntil:null,lastPrompt:null,status:'open'}];
localStorage.setItem('shelf2',JSON.stringify(s));return s;}
function off(n){const d=new Date();d.setDate(d.getDate()-n);return dayKey(d);}
export function saveShelf(s){localStorage.setItem('shelf',JSON.stringify(s));localStorage.setItem('shelf2',JSON.stringify(s));}
export function confirmToday(item){const t=dayKey();const c=item.confirmations||[];if(c.includes(t))return item;
return{...item,confirmations:[...c,t]};}
export function dueForPrompt(item,prod,today=dayKey()){
const e=estimate(item,prod,today);if(e.state!=='ok')return e.state==='depleted';
if(item.snoozeUntil&&item.snoozeUntil>today)return false;
if(item.lastPrompt&&daysBetween(item.lastPrompt,today)<3)return false;
return e.remaining<=(prod.thresholdDays||5);}
// product-use streak days derived from confirmations across items
export function productUseDays(items){const s=new Set();items.forEach(it=>(it.confirmations||[]).forEach(d=>s.add(d)));return[...s].sort();}
