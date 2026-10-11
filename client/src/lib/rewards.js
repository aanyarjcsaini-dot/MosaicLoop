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
