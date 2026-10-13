import {useState} from 'react';import {Gift,Award} from 'lucide-react';import {REWARDS} from '../data/rewards.js';import {progressFor,claim,claimable,points,grants} from '../lib/rewards.js';import {streakDays,qualifyingWellness} from '../lib/wellness.js';import {productUseDays} from '../lib/shelf.js';
function streaks(){
let entries=[],items=[];try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch(e){entries=[];}
try{items=JSON.parse(localStorage.getItem('shelf2')||'[]');}catch(e){items=[];}
const w=streakDays([...new Set(entries.filter(qualifyingWellness).map(function(e){return e.day;}))].sort()).current;
const p=streakDays(productUseDays(items)).current;return{w:w,p:p};
}
export default function Rewards(){
const[,tick]=useState(0);const s=streaks();const brand=localStorage.getItem('brandPref')||'Be Bodywise';
const g=grants();
const secs=[{id:'avail',label:'🎉 Available now',list:REWARDS.filter(function(r){return claimable(r,s.w,s.p).ok;})},
{id:'prog',label:'🔒 In progress',list:REWARDS.filter(function(r){const c=claimable(r,s.w,s.p);return !c.ok&&c.reason==='in-progress';})},
{id:'earn',label:'🏅 Earned',list:REWARDS.filter(function(r){return g.some(function(x){return x.ruleId===r.id;});})}];
return<div style={{display:'grid',gap:12}}>
<div className="card"><b>Habit Rewards</b><p className="muted" style={{margin:0}}>Wellness {s.w}d • Product {s.p}d • Points {points()} (no cash value) • trials from another brand</p></div>
{secs.map(function(sec){return<div key={sec.id} className="card"><h3>{sec.label} ({sec.list.length})</h3>
{sec.list.length?sec.list.map(function(rule){const pr=progressFor(rule,s.w,s.p);const done=g.some(function(x){return x.ruleId===rule.id;});
const trial=rule.type==='trial'?((rule.trialFor[brand])||rule.trialFor.default):null;
return<div key={rule.id} style={{display:'flex',gap:10,alignItems:'center',borderTop:'1px solid #ECE4D4',padding:'8px 0'}}><div style={{fontSize:26,color:'#6F9676'}}>{rule.type==='trial'?<Gift size={26}/>:<Award size={26}/>}</div><div style={{flex:1}}><b>{rule.name}</b> <span className="muted">• {rule.habit} {rule.required}d</span><br/><span className="muted">{rule.instructions}{trial?' Trial: '+trial+' ('+rule.availability+').':''}</span><div style={{height:7,background:'#ECE4D4',borderRadius:99,marginTop:4}}><div style={{width:(pr.current/rule.required*100)+'%',height:'100%',background:'#0E3B2E',borderRadius:99}}/></div><span className="muted">{pr.current}/{rule.required} • {pr.remaining} to go</span></div>
{done?<b>✓</b>:sec.id==='avail'?<button className="btn" onClick={function(){claim(rule,s.w,s.p);tick(function(x){return x+1;});}}>Claim</button>:<span className="muted">Locked</span>}</div>;}):<p className="muted">Nothing here right now.</p>}</div>;})}
</div>;
}
