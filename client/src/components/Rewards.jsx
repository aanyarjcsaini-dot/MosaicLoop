import {useState} from 'react';import {Gift,Award,Medal,Ticket} from 'lucide-react';import {REWARDS,MEDALS,COUPONS,CHALLENGES} from '../data/rewards.js';import {progressFor,claim,claimable,points,grants,medalGrants,challengeProgress,goalStreak,checkinWeekCount} from '../lib/rewards.js';import {streakDays,qualifyingWellness} from '../lib/wellness.js';import {productUseDays} from '../lib/shelf.js';
function data(){
let entries=[],items=[],done={};try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch(e){entries=[];}
try{items=JSON.parse(localStorage.getItem('shelf2')||'[]');}catch(e){items=[];}
try{done=JSON.parse(localStorage.getItem('goals')||'{}');}catch(e){done={};}
const w=streakDays([...new Set(entries.filter(qualifyingWellness).map(function(e){return e.day;}))].sort()).current;
const p=streakDays(productUseDays(items)).current;
return{w:w,p:p,vals:{checkinWeek:checkinWeekCount(entries),goalStreak:goalStreak(done),productStreak:p}};
}
export default function Rewards(){
const[,tick]=useState(0);const s=data();const brand=localStorage.getItem('brandPref')||'Be Bodywise';
const g=grants();const mg=medalGrants();
const secs=[{id:'avail',label:'Available now',list:REWARDS.filter(function(r){return claimable(r,s.w,s.p).ok;})},
{id:'prog',label:'In progress',list:REWARDS.filter(function(r){const c=claimable(r,s.w,s.p);return !c.ok&&c.reason==='in-progress';})}];
return<div style={{display:'grid',gap:12}}>
<div className="card"><b>Rewards</b><p className="muted" style={{margin:0}}>Wellness {s.w}d • Product {s.p}d • Points {points()} (no cash value)</p></div>
<div className="card" style={{background:'linear-gradient(135deg,#FFF5D9,#E6E0FF)'}}><h3 className="sec-title"><Medal size={18}/> Medal Collection</h3><p className="muted">Earned from daily goal completions in Insights. Thresholds live in reward rules.</p>
{MEDALS.map(function(m){const has=mg.some(function(x){return x.ruleId===m.id;});
return<div key={m.id} style={{display:'flex',gap:10,alignItems:'center',borderTop:'1px solid #EBD9F5',padding:'8px 0',opacity:has?1:.75}}><div style={{fontSize:28}}>{has?m.icon:'🔒'}</div><div style={{flex:1}}><b>{m.name}</b><br/><span className="muted">{m.desc} {has?'• earned ✓':''}</span></div></div>;})}</div>
<div className="card"><h3 className="sec-title"><Ticket size={18}/> Streak Rewards</h3>
{secs.map(function(sec){return<div key={sec.id}><h3>{sec.id==='avail'?'Available':'Locked challenges'} ({sec.list.length})</h3>
{sec.list.length?sec.list.map(function(rule){const pr=progressFor(rule,s.w,s.p);const done=g.some(function(x){return x.ruleId===rule.id;});
const trial=rule.type==='trial'?((rule.trialFor[brand])||rule.trialFor.default):null;
return<div key={rule.id} style={{display:'flex',gap:10,alignItems:'center',borderTop:'1px solid #EFE9F5',padding:'8px 0'}}><div style={{fontSize:26,color:'#6C7CFF'}}>{rule.type==='trial'?<Gift size={26}/>:<Award size={26}/>}</div><div style={{flex:1}}><b>{rule.name}</b> <span className="muted">• {rule.habit} {rule.required}d</span><br/><span className="muted">{rule.instructions}{trial?' Trial: '+trial+' ('+rule.availability+').':''}</span><div style={{height:8,background:'#E4E2F5',borderRadius:99,marginTop:4}}><div style={{width:(pr.current/rule.required*100)+'%',height:'100%',background:'#6C7CFF',borderRadius:99}}/></div><span className="muted">{pr.current}/{rule.required} • {pr.remaining} to go</span></div>
{done?<b>✓</b>:sec.id==='avail'?<button className="btn" onClick={function(){claim(rule,s.w,s.p);tick(function(x){return x+1;});}}>Claim</button>:<span className="muted">Locked</span>}</div>;}):<p className="muted">Nothing here right now.</p>}</div>;})}
{CHALLENGES.map(function(ch){const cur=challengeProgress(ch.metric,s.vals);const open=cur>=ch.need;
const cpn=COUPONS.filter(function(c){return c.challenge===ch.id;})[0];
return<div key={ch.id} style={{borderTop:'1px solid #EFE9F5',padding:'8px 0'}}><b>{ch.label}</b><p className="muted" style={{margin:'2px 0'}}>{cur}/{ch.need} • {open?'unlocked ✓':'locked'}</p>
{cpn&&open&&<div className="card" style={{background:'#EFFBDB',marginTop:6}}><b>{cpn.brand} — {cpn.title}</b><p className="muted">Code: <b>{cpn.code}</b> • SAMPLE — not redeemable until the brand confirms. {cpn.detail} Expiry: {cpn.expiry}</p></div>}
{cpn&&!open&&<p className="muted">{cpn.brand} coupon locked behind this challenge. Sample only.</p>}</div>;})}
</div>
</div>;
}
