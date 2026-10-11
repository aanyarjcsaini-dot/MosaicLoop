import {useState} from 'react';import {REWARDS} from '../data/rewards.js';import {progressFor,claim,claimable,points,grants} from '../lib/rewards.js';import {streakDays,qualifyingWellness} from '../lib/wellness.js';import {productUseDays} from '../lib/shelf.js';
function streaks(){
let entries=[],items=[];try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch{entries=[];}
try{items=JSON.parse(localStorage.getItem('shelf2')||'[]');}catch{items=[];}
const w=streakDays([...new Set(entries.filter(qualifyingWellness).map(e=>e.day))].sort()).current;
const p=streakDays(productUseDays(items)).current;return{w,p};
}
export default function Rewards(){
const[,tick]=useState(0);const{w,p}=streaks();const brand=localStorage.getItem('brandPref')||'Be Bodywise';
return<div className="card"><h3>Habit Rewards 🎉</h3>
<p className="muted">Wellness {w}d • Product {p}d • Points {points()} (no cash value) • trials from another brand</p>
{REWARDS.map(rule=>{const pr=progressFor(rule,w,p);const c=claimable(rule,w,p);const g=grants().some(x=>x.ruleId===rule.id);
const trial=rule.type==='trial'?((rule.trialFor[brand])||rule.trialFor.default):null;
return<div key={rule.id} style={{borderTop:'1px solid #ECE4D4',padding:'8px 0'}}><b>{rule.image} {rule.name}</b> <span className="muted">• {rule.habit} {rule.required}d • {pr.current}/{rule.required} • {pr.remaining} left</span><br/>
<span className="muted">{rule.instructions}{trial?` Trial: ${trial} (${rule.availability}).`:''}</span><br/>
{g?<b>✓ redeemed</b>:<button className="btn" disabled={!c.ok} onClick={()=>{claim(rule,w,p);tick(x=>x+1);}}>{c.ok?'Claim':c.reason==='in-progress'?`Locked — ${pr.remaining} to go`:'Unavailable'}</button>}</div>;})}
<p className="muted">Unlocks only when eligible. No duplicates. Encouragement, not pressure.</p></div>;
}
