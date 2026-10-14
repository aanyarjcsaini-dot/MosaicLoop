import {REWARDS} from '../data/rewards.js';
export function grants(){try{return JSON.parse(localStorage.getItem('grants')||'[]');}catch{return[];}}
export function progressFor(rule,wellnessStreak,productStreak){
const cur=rule.habit==='wellness'?wellnessStreak:productStreak;
return{current:Math.min(cur,rule.required),remaining:Math.max(0,rule.required-cur),eligible:cur>=rule.required};
}
export function claimable(rule,wellnessStreak,productStreak){
const g=grants();if(g.some(x=>x.ruleId===rule.id))return{ok:false,reason:'already-redeemed'};
const p=progressFor(rule,wellnessStreak,productStreak);
if(!p.eligible)return{ok:false,reason:'in-progress'};
return{ok:true};
}
export function claim(rule,wellnessStreak,productStreak){
const c=claimable(rule,wellnessStreak,productStreak);if(!c.ok)return c;
const g=[...grants(),{ruleId:rule.id,ts:new Date().toISOString(),points:rule.points||0}];
localStorage.setItem('grants',JSON.stringify(g));
try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/rewards/grant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({household:'default',ruleId:rule.id,points:rule.points||0})}).catch(()=>{});}catch{}
return{ok:true};
}
export function points(){return grants().reduce((a,g)=>a+(g.points||0),0);}
export function medalGrants(){try{return JSON.parse(localStorage.getItem('medal-grants')||'[]');}catch(e){return[];}}
import {MEDALS} from '../data/rewards.js';
export function evaluateMedals(doneCount){
const g=medalGrants();const earned=[];
MEDALS.forEach(function(m){if(doneCount>=m.need&&!g.some(function(x){return x.ruleId===m.id;})){earned.push(m);}});
if(!earned.length){return[];}
const next=[...g,...earned.map(function(m){return{ruleId:m.id,ts:new Date().toISOString(),points:0};})];
localStorage.setItem('medal-grants',JSON.stringify(next));
earned.forEach(function(m){try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/rewards/grant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({household:'default',ruleId:m.id,points:0})}).catch(function(){});}catch(e){}});
return earned;
}
export function goalStreak(done){
let n=0;const d=new Date();const k=function(dt){return dt.toISOString().slice(0,10);};
if(!done[k(d)]||!Object.keys(done[k(d)]||{}).length){d.setDate(d.getDate()-1);}
let guard=0;
while(guard<400){const key=k(d);if(done[key]&&Object.keys(done[key]).length){n++;d.setDate(d.getDate()-1);}else{break;}guard++;}
return n;
}
export function checkinWeekCount(entries){
const c=new Date();c.setDate(c.getDate()-7);const s={};
entries.forEach(function(e){if(new Date(e.ts)>=c&&(e.picks&&Object.keys(e.picks).length>=4)){s[e.day]=1;}});
return Object.keys(s).length;
}export function challengeProgress(metric,vals){
if(metric==='checkinWeek'){return vals.checkinWeek||0;}
if(metric==='goalStreak'){return vals.goalStreak||0;}
if(metric==='productStreak'){return vals.productStreak||0;}
return 0;
}
