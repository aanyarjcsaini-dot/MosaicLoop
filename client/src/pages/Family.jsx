import {useState} from 'react';import {streakDays,qualifyingWellness} from '../lib/wellness.js';import {usageMap} from '../lib/shelf.js';
const KINDS=[{k:'Mom',icon:'👩‍🦰'},{k:'Dad',icon:'👨'},{k:'Sibling',icon:'🧒'},{k:'Partner',icon:'🧑‍🤝‍🧑'},{k:'Child',icon:'👶'},{k:'Friend',icon:'🧑‍🎤'}];
const GOALS=[{id:'walk',label:'Walk regularly',icon:'🚶'},{id:'yoga',label:'Yoga & stretching',icon:'🧘'},{id:'meditate',label:'Meditation',icon:'🌙'},{id:'product',label:'Consistent product use',icon:'💧'},{id:'habits',label:'Daily wellness habits',icon:'🌿'}];
function lastDays(n){const out=[];for(let i=0;i<n;i++){const d=new Date();d.setDate(d.getDate()-i);out.push(d.toISOString().slice(0,10));}return out;}
function load(){let f=null;try{f=JSON.parse(localStorage.getItem('fam2')||'null');}catch(e){f=null;}
if(!f){f={members:[
{name:'Mom',kind:'Mom',avatar:'👩‍🦰',streak:6,badges:['7-Day Rhythm'],share:{streaks:true,goals:true},goals:['walk','habits'],done:{},days:lastDays(6)},
{name:'Dad',kind:'Dad',avatar:'👨',streak:4,badges:[],share:{streaks:true,goals:true},goals:['walk'],done:{},days:lastDays(4)},
{name:'Friend 1',kind:'Friend',avatar:'🧑‍🎤',streak:2,badges:[],share:{streaks:true,goals:true},goals:['habits'],done:{},days:lastDays(2)}],invite:null,shared:[]};}
if(f.members.length===1&&f.members[0].name==='Mom'&&!f.members[0].via){f.members.push({name:'Dad',kind:'Dad',avatar:'👨',streak:4,badges:[],share:{streaks:true,goals:true},goals:['walk'],done:{},days:lastDays(4)},{name:'Friend 1',kind:'Friend',avatar:'🧑‍🎤',streak:2,badges:[],share:{streaks:true,goals:true},goals:['habits'],done:{},days:lastDays(2)});try{localStorage.setItem('fam2',JSON.stringify(f));}catch(e){}}
f.members.forEach(function(m){if(!m.days){m.days=lastDays(m.streak||0);}});f.shared=f.shared||[];
return f;}
function myDays(type){
if(type==='product'){const s=new Set();try{const u=usageMap();Object.keys(u).forEach(function(k){u[k].forEach(function(d){s.add(d);});});}catch(e){}
try{JSON.parse(localStorage.getItem('entries')||'[]').forEach(function(x){if(x.productUse){s.add(x.day);}});}catch(e){}
return [...s].sort();}
const s=new Set();try{JSON.parse(localStorage.getItem('entries')||'[]').forEach(function(x){if(qualifyingWellness(x)){s.add(x.day);}});}catch(e){}
return [...s].sort();}
export default function Family(){
const[fam,setFam]=useState(load);const[name,setName]=useState('');const[kind,setKind]=useState('Mom');const[code,setCode]=useState('');
const[sel,setSel]=useState([]);const[stype,setStype]=useState('wellness');
const save=function(f){setFam(f);localStorage.setItem('fam2',JSON.stringify(f));};
const makeInvite=function(){const c='LOOP-'+Math.random().toString(36).slice(2,6).toUpperCase();save(Object.assign({},fam,{invite:c}));};
const join=function(){if(!code.trim()){return;}const k=KINDS[fam.members.length%KINDS.length];
const m={name:'Guest-'+code.trim().slice(-4),kind:k.k,avatar:k.icon,streak:0,badges:[],share:{streaks:true,goals:true},goals:['habits'],done:{},days:[],via:'invite '+code.trim()};
save(Object.assign({},fam,{members:[...fam.members,m]}));setCode('');};
const remove=function(i){const m=fam.members[i];if(!window.confirm('Remove '+m.name+' from your circle? Their history stays on their device.')){return;}
const kept=fam.members.filter(function(_,j){return j!==i;});
const shared=(fam.shared||[]).map(function(s){return Object.assign({},s,{members:s.members.filter(function(n){return n!==m.name;})});}).filter(function(s){return s.members.length>0;});
save(Object.assign({},fam,{members:kept,shared:shared}));};
const toggleShare=function(i,k){const m=fam.members.slice();m[i]=Object.assign({},m[i],{share:Object.assign({},m[i].share)});m[i].share[k]=!m[i].share[k];save(Object.assign({},fam,{members:m}));};
const toggleGoal=function(mi,g){const t=new Date().toISOString().slice(0,10);const m=fam.members.slice();const d=Object.assign({},m[mi].done||{});const k=g+':'+t;
if(d[k]){delete d[k];}else{d[k]=1;}m[mi]=Object.assign({},m[mi],{done:d});save(Object.assign({},fam,{members:m}));};
const weekCount=function(g){let n=0;fam.members.forEach(function(m){if(!m.share.goals){return;}for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);const k=g+':'+d.toISOString().slice(0,10);if(m.done&&m.done[k]){n++;}}});return n;};
let mine=0;try{mine=JSON.parse(localStorage.getItem('entries')||'[]').filter(function(e){const d=new Date();d.setDate(d.getDate()-7);return new Date(e.ts)>=d;}).length;}catch(e){mine=0;}
const sharedTotal=mine+fam.members.reduce(function(a,m){return a+(m.share.goals?(m.streak||0):0);},0);
const toggleSel=function(n){setSel(function(s){return s.indexOf(n)>=0?s.filter(function(x){return x!==n;}):[...s,n];});};
const createShared=function(){if(!sel.length){return;}const type=stype;
const sh={id:'sh'+Date.now(),members:sel.slice(),type:type,created:new Date().toISOString().slice(0,10)};
save(Object.assign({},fam,{shared:[...(fam.shared||[]),sh]}));setSel([]);};
const sharedProg=function(sh){
const sets=[new Set(myDays(sh.type))];
sh.members.forEach(function(n){const m=fam.members.filter(function(x){return x.name===n;})[0];if(m){sets.push(new Set(m.days||[]));}});
const inter=[...sets[0]].filter(function(d){return sets.every(function(s){return s.has(d);});}).sort();
const st=streakDays(inter);
const contrib=sh.members.map(function(n){const m=fam.members.filter(function(x){return x.name===n;})[0];return{name:n,streak:m?streakDays(m.days||[]).current:0};});
return{count:st.current,best:st.best,contrib:contrib};
};
return<div style={{display:'grid',gap:12}}>
<div className="card" style={{background:'linear-gradient(135deg,#E6E0FF,#EFFBDB)'}}><h3>Leaderboard</h3><p className="muted">Your circle, ranked live. Demo members included.</p>
{function(){let mine=0;try{const es=JSON.parse(localStorage.getItem('entries')||'[]');const days={};es.forEach(function(e){if(e.picks&&Object.keys(e.picks).length>=4){days[e.day]=1;}});mine=streakDays(Object.keys(days).sort()).current;}catch(e){mine=0;}
const rows=fam.members.map(function(m){return{name:m.name,av:m.avatar,streak:streakDays(m.days||[]).current,you:false};});
rows.push({name:'You',av:null,streak:mine,you:true});
rows.sort(function(a,b){return b.streak-a.streak;});
const cols=['#6C7CFF','#B9A3FF','#FFB99B'];
return rows.map(function(r,i){return<div key={r.name+i} style={{display:'flex',gap:10,alignItems:'center',borderTop:'1px solid #EBD9F5',padding:'8px 0'}}><b style={{width:24}}>{i+1}</b>{r.you?<div style={{width:36,height:36,borderRadius:'50%',background:'#171747',color:'#fff',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>Y</div>:<div style={{fontSize:32}}>{r.av}</div>}<div style={{flex:1}}><b>{r.name}{r.you?' (you)':''}</b><br/><span className="muted">{r.streak}-day streak</span></div><div style={{height:8,width:90,background:'#E4E2F5',borderRadius:99}}><div style={{width:Math.min(100,r.streak/14*100)+'%',height:'100%',background:cols[i%3],borderRadius:99}}/></div></div>;});}()}</div>
<div className="card" style={{background:'linear-gradient(135deg,#FFF5D9,#E9E1F5)'}}><h3>Family & Friends 💛</h3>
<p><b>{sharedTotal} shared moments this stretch!</b> <span className="muted">(counted from real events)</span></p>
{sharedTotal>=18&&<p>🎉 Milestone — 18 together! Keep each other gently going.</p>}
<p className="muted">Supportive, never competitive. Private notes stay private. Only shared counts appear.</p></div>
<div className="card"><h3>🔗 Connect Your Family & Friends</h3><p className="muted">Share a link — they join with their own profile and choose what to share. Demo flow: real invites need account backend.</p>
{fam.invite?<p><b>Invite link:</b> <span className="muted">mosaic-loop.app/join/{fam.invite} (demo)</span> <button className="chip" onClick={function(){try{navigator.clipboard.writeText('mosaic-loop.app/join/'+fam.invite);}catch(e){}}}>Copy</button> <button className="chip" onClick={makeInvite}>New code</button></p>:<button className="btn" onClick={makeInvite}>Create invite link</button>}
<div style={{display:'flex',gap:8,marginTop:8}}><input value={code} onChange={function(e){setCode(e.target.value);}} placeholder="Enter invite code" aria-label="Invite code"/><button className="btn" onClick={join}>Join</button></div></div>
<div className="card"><h3>🔥 Shared streaks</h3><p className="muted">Everyone counts only their own days; the shared number is days you all managed. Missed days simply pause it — no guilt. Same local-date rules for all.</p>
{(fam.shared||[]).map(function(sh){const pr=sharedProg(sh);return<div key={sh.id} style={{borderTop:'1px solid #EFE9F5',padding:'8px 0'}}><b>{sh.type==='wellness'?'🌿':'💧'} {sh.members.join(' + ')}</b> <span className="muted">• {sh.type}</span><p style={{fontSize:22,margin:'4px 0'}}>{pr.count} together <span className="muted">best {pr.best}</span></p><p className="muted">{pr.contrib.map(function(c){return c.name+' '+c.streak+'d';}).join(' • ')}</p></div>;})}
{(fam.shared||[]).length===0&&<p className="muted">No shared streaks yet — pick people below.</p>}
<div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>{fam.members.filter(function(m){return m.share.goals;}).map(function(m){return<button key={m.name} className={'chip'+(sel.indexOf(m.name)>=0?' sel':'')} onClick={function(){toggleSel(m.name);}}>{m.avatar} {m.name}</button>;})}</div>
<div style={{display:'flex',gap:8,marginTop:8,alignItems:'center'}}><select value={stype} onChange={function(e){setStype(e.target.value);}} aria-label="Streak type"><option value="wellness">Wellness check-ins</option><option value="product">Product use</option></select><button className="btn" disabled={!sel.length} onClick={createShared}>Start shared streak</button></div></div>
<div className="card"><h3>🎯 Shared goals</h3>{[{id:'walk',label:'Walk regularly',icon:'🚶'},{id:'yoga',label:'Yoga & stretching',icon:'🧘'},{id:'meditate',label:'Meditation',icon:'🌙'},{id:'product',label:'Consistent product use',icon:'💧'},{id:'habits',label:'Daily wellness habits',icon:'🌿'}].map(function(g){const n=weekCount(g.id);return<div key={g.id} style={{borderTop:'1px solid #EFE9F5',padding:'8px 0'}}><b>{g.icon} {g.label}</b> <span className="muted">• {n} this week</span>
<div style={{height:8,background:'#E4D8F0',borderRadius:99,marginTop:4}}><div style={{width:Math.min(100,n/7*100)+'%',height:'100%',background:'#6F9676',borderRadius:99}}/></div>
<div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>{fam.members.filter(function(m){return m.share.goals;}).map(function(m,mi){const t=new Date().toISOString().slice(0,10);const done=m.done&&(m.done[g.id+':'+t]);return<button key={mi} className={'chip'+(done?' sel':'')} onClick={function(){const idx=fam.members.indexOf(m);toggleGoal(idx,g.id);}}>{m.avatar} {m.name}{done?' ✓':''}</button>;})}</div></div>;})}</div>
<div style={{display:'grid',gap:10}}>{fam.members.map(function(m,i){return<div key={i} className="card" style={{display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:36}}>{m.avatar}</div><div style={{flex:1}}><b>{m.name}</b> <span className="muted">• {m.kind}{m.via?' • '+m.via:''}</span><br/><span className="muted">🔥 {streakDays(m.days||[]).current}d personal • 🏅 {(m.badges||[]).join(', ')||'new journey'}</span><br/><label className="muted"><input type="checkbox" checked={!!m.share.streaks} onChange={function(){toggleShare(i,'streaks');}}/> share streaks</label> <label className="muted"><input type="checkbox" checked={!!m.share.goals} onChange={function(){toggleShare(i,'goals');}}/> share goals</label></div><button className="chip" onClick={function(){remove(i);}}>Remove</button></div>;})}</div>
<div className="card"><h3>Add someone</h3><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><input value={name} onChange={function(e){setName(e.target.value);}} placeholder="Name" aria-label="Member name"/><select value={kind} onChange={function(e){setKind(e.target.value);}} aria-label="Relation">{[{k:'Mom'},{k:'Dad'},{k:'Sibling'},{k:'Partner'},{k:'Child'},{k:'Friend'}].map(function(k){return<option key={k.k} value={k.k}>{k.k}</option>;})}</select><button className="btn" onClick={function(){if(!name.trim()){return;}const icons={Mom:'👩‍🦰',Dad:'👨',Sibling:'🧒',Partner:'🧑‍🤝‍🧑',Child:'👶',Friend:'🧑‍🎤'};save(Object.assign({},fam,{members:[...fam.members,{name:name.trim(),kind:kind,avatar:icons[kind]||'🧑',streak:0,badges:[],share:{streaks:true,goals:true},goals:['habits'],done:{},days:[]}]}));setName('');}}>Add</button></div></div>
</div>;
}
