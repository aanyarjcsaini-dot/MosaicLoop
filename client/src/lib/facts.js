import {FACTS} from '../data/facts.js';
function seen(){try{return JSON.parse(localStorage.getItem('facts-seen')||'[]');}catch(e){return[];}}
export function todayKey(){const d=new Date();function p(n){return String(n).padStart(2,'0');}return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}
export function dailyFact(){
const key=todayKey();
try{const cached=JSON.parse(localStorage.getItem('fact-day')||'null');if(cached && cached.day===key){const f=FACTS.filter(function(x){return x.id===cached.id;})[0];if(f){return f;}}}catch(e){}
let s=seen();
let pool=FACTS.filter(function(f){return s.indexOf(f.id)<0;});
if(!pool.length){pool=FACTS.slice();s=[];}
const epochDays=Math.floor(Date.now()/864e5);
const fact=pool[epochDays%pool.length] || FACTS[0];
s.push(fact.id);if(s.length>FACTS.length*3){s=s.slice(-FACTS.length);}
try{localStorage.setItem('facts-seen',JSON.stringify(s));localStorage.setItem('fact-day',JSON.stringify({day:key,id:fact.id}));}catch(e){}
return fact;
}
