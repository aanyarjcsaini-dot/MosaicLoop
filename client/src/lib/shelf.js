export function finishInfo(p){const days=Math.max(0,Math.ceil((p.pack-p.used)/p.perDay));const d=new Date();d.setDate(d.getDate()+days);return{daysLeft:days,finish:d.toISOString().slice(0,10)};}
export function logs(){return JSON.parse(localStorage.getItem('events')||'{}');}
export function logDay(k,ev){const L=logs();L[k]=L[k]||[];if(!L[k].includes(ev))L[k].push(ev);localStorage.setItem('events',JSON.stringify(L));}
export function shelf(){return JSON.parse(localStorage.getItem('shelf')||'null')||seed();}
export function seed(){const s=[{pid:'bb-rollon',used:18,start:off(12)},{pid:'bb-biotin-30',used:9,start:off(9)},{pid:'lj-dha',used:22,start:off(22)}];localStorage.setItem('shelf',JSON.stringify(s));return s;}
function off(n){const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10);}
export function saveShelf(s){localStorage.setItem('shelf',JSON.stringify(s));}
