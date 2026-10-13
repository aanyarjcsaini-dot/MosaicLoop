import {useState} from 'react';
const KINDS=[{k:'Mom',icon:'👩‍🦰'},{k:'Dad',icon:'👨'},{k:'Sibling',icon:'🧒'},{k:'Partner',icon:'🧑‍🤝‍🧑'},{k:'Child',icon:'👶'}];
const GOALS=[{id:'walk',label:'Walk regularly',icon:'🚶'},{id:'yoga',label:'Yoga & stretching',icon:'🧘'},{id:'meditate',label:'Meditation',icon:'🌙'},{id:'product',label:'Consistent product use',icon:'💧'},{id:'habits',label:'Daily wellness habits',icon:'🌿'}];
function load(){try{return JSON.parse(localStorage.getItem('fam2')||'null')||{members:[{name:'Mom',kind:'Mom',avatar:'👩‍🦰',streak:4,badges:['7-Day Rhythm'],share:{streaks:true,goals:true},goals:['walk','habits'],done:{}}],invite:null};}catch(e){return{members:[],invite:null}};}
function today(){const d=new Date();function p(n){return String(n).padStart(2,'0');}return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}
export default function Family(){
const[fam,setFam]=useState(load);const[name,setName]=useState('');const[kind,setKind]=useState('Mom');const[code,setCode]=useState('');
const save=function(f){setFam(f);localStorage.setItem('fam2',JSON.stringify(f));};
const makeInvite=function(){const c='LOOP-'+Math.random().toString(36).slice(2,6).toUpperCase();const f=Object.assign({},fam,{invite:c});save(f);};
const join=function(){if(!code.trim()){return;}const k=KINDS[fam.members.length%KINDS.length];
const m={name:'Guest-'+code.trim().slice(-4),kind:k.k,avatar:k.icon,streak:0,badges:[],share:{streaks:true,goals:true},goals:['habits'],done:{},via:'invite '+code.trim()};
save(Object.assign({},fam,{members:[...fam.members,m]}));setCode('');};
const toggleShare=function(i,k){const m=fam.members.slice();m[i]=Object.assign({},m[i],{share:Object.assign({},m[i].share)});m[i].share[k]=!m[i].share[k];save(Object.assign({},fam,{members:m}));};
const toggleGoal=function(mi,g){const t=today();const m=fam.members.slice();const d=Object.assign({},m[mi].done||{});const k=g+':'+t;
if(d[k]){delete d[k];}else{d[k]=1;}m[mi]=Object.assign({},m[mi],{done:d});save(Object.assign({},fam,{members:m}));};
const weekCount=function(g){const out={n:0};fam.members.forEach(function(m){if(!m.share.goals){return;}for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);const k=g+':'+d.toISOString().slice(0,10);if(m.done&&m.done[k]){out.n++;}}});return out.n;};
let mine=0;try{mine=JSON.parse(localStorage.getItem('entries')||'[]').filter(function(e){const d=new Date();d.setDate(d.getDate()-7);return new Date(e.ts)>=d;}).length;}catch(e){mine=0;}
const shared=mine+fam.members.reduce(function(a,m){return a+(m.share.goals?(m.streak||0):0);},0);
return<div style={{display:'grid',gap:12}}>
<div className="card" style={{background:'linear-gradient(135deg,#FFF7EA,#FFE7CF)'}}><h3>Family wellness 💛</h3>
<p><b>{shared} shared moments this stretch!</b> <span className="muted">(counted from real events)</span></p>
{shared>=18&&<p>🎉 Family milestone — 18 together!</p>}
<p className="muted">Private notes stay private. Only shared counts and chosen badges appear. Warmth over competition.</p></div>
<div className="card"><h3>🔗 Connect Your Family</h3><p className="muted">Share a link — members join with their own profile and choose what to share. Demo flow: real invites need account backend (documented, not faked).</p>
{fam.invite?<p><b>Invite link:</b> <span className="muted">mosaic-loop.app/join/{fam.invite} (demo — works on this device)</span> <button className="chip" onClick={function(){try{navigator.clipboard.writeText('mosaic-loop.app/join/'+fam.invite);}catch(e){}}}>Copy</button> <button className="chip" onClick={makeInvite}>New code</button></p>:<button className="btn" onClick={makeInvite}>Create invite link</button>}
<div style={{display:'flex',gap:8,marginTop:8}}><input value={code} onChange={function(e){setCode(e.target.value);}} placeholder="Enter invite code" aria-label="Invite code"/><button className="btn" onClick={join}>Join</button></div></div>
<div className="card"><h3>🎯 Shared goals</h3>{GOALS.map(function(g){const n=weekCount(g.id);return<div key={g.id} style={{borderTop:'1px solid #ECE4D4',padding:'8px 0'}}><b>{g.icon} {g.label}</b> <span className="muted">• {n} completions this week</span>
<div style={{height:8,background:'#ECE4D4',borderRadius:99,marginTop:4}}><div style={{width:Math.min(100,n/7*100)+'%',height:'100%',background:'#0E3B2E',borderRadius:99}}/></div>
<div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>{fam.members.filter(function(m){return m.share.goals;}).map(function(m,mi){const done=m.done&&(m.done[g.id+':'+today()]);return<button key={mi} className={'chip'+(done?' sel':'')} onClick={function(){const idx=fam.members.indexOf(m);toggleGoal(idx,g.id);}}>{m.avatar} {m.name}{done?' ✓':''}</button>;})}</div></div>;})}</div>
<div style={{display:'grid',gap:10}}>{fam.members.map(function(m,i){return<div key={i} className="card" style={{display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:36}}>{m.avatar}</div><div style={{flex:1}}><b>{m.name}</b> <span className="muted">• {m.kind}{m.via?' • '+m.via:''}</span><br/><span className="muted">🔥 {m.streak||0}d • 🏅 {(m.badges||[]).join(', ')||'new journey'}</span><br/><label className="muted"><input type="checkbox" checked={!!m.share.streaks} onChange={function(){toggleShare(i,'streaks');}}/> share streaks</label> <label className="muted"><input type="checkbox" checked={!!m.share.goals} onChange={function(){toggleShare(i,'goals');}}/> share goals</label></div></div>;})}</div>
<div className="card"><h3>Add the old way</h3><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><input value={name} onChange={function(e){setName(e.target.value);}} placeholder="Name" aria-label="Member name"/><select value={kind} onChange={function(e){setKind(e.target.value);}} aria-label="Relation">{KINDS.map(function(k){return<option key={k.k} value={k.k}>{k.k}</option>;})}</select><button className="btn" onClick={function(){if(!name.trim()){return;}const k=KINDS.filter(function(x){return x.k===kind;})[0]||KINDS[0];save(Object.assign({},fam,{members:[...fam.members,{name:name.trim(),kind:kind,avatar:k.icon,streak:0,badges:[],share:{streaks:true,goals:true},goals:['habits'],done:{}}]}));setName('');}}>Add</button></div></div>
</div>;
}
