import {useState} from 'react';
const KINDS=['Parent','Partner','Sibling','Child'];
const AV=['🦊','🐰','🐻','🐱','🦁','🐼'];
export default function Family(){
const[members,setMembers]=useState(()=>{try{return JSON.parse(localStorage.getItem('fam')||'[{"name":"Mom","kind":"Parent","avatar":"🦊","streak":4,"badges":["7-Day Rhythm"]}]');}catch{return[];}});
const[name,setName]=useState('');const[kind,setKind]=useState('Parent');
let entries=[];try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch{entries=[];}
const weekAgo=new Date();weekAgo.setDate(weekAgo.getDate()-7);
const mine=entries.filter(e=>new Date(e.ts)>=weekAgo).length;
const shared=mine+members.reduce((a,m)=>a+(m.streak||0),0);
const add=()=>{if(!name.trim())return;const m=[...members,{name:name.trim(),kind,avatar:AV[members.length%AV.length],streak:0,badges:[]}];setMembers(m);localStorage.setItem('fam',JSON.stringify(m));setName('');};
return<div style={{display:'grid',gap:12}}>
<div className="card" style={{background:'linear-gradient(135deg,#FFF7EA,#FFE7CF)'}}><h3>Family wellness 💛</h3>
<p><b>Our family completed {shared} check-ins this stretch!</b> <span className="muted">(counted from actual events)</span></p>
{(shared>=18)&&<p>🎉 Family milestone — 18 together! Gentle celebration, no pressure.</p>}
<p className="muted">Private notes stay private. Only shared counts and chosen badges appear here.</p></div>
<div className="card"><h3>Shared goal — 18 check-ins together</h3>
<div style={{height:10,background:'#ECE4D4',borderRadius:99}}><div style={{width:`${Math.min(100,shared/18*100)}%`,height:'100%',background:'#0E3B2E',borderRadius:99}}/></div>
<p className="muted">{Math.max(0,18-shared)} to go • encouragement over guilt</p></div>
<div style={{display:'grid',gap:10}}>{members.map((m,i)=><div key={i} className="card" style={{display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:36}}>{m.avatar}</div><div><b>{m.name}</b> <span className="muted">• {m.kind}</span><br/><span className="muted">🔥 {m.streak||0}d streak • 🏅 {(m.badges||[]).join(', ')||'new journey'}</span></div></div>)}</div>
<div className="card"><h3>Add member</h3><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" aria-label="Member name"/><select value={kind} onChange={e=>setKind(e.target.value)} aria-label="Relation">{KINDS.map(k=><option key={k}>{k}</option>)}</select><button className="btn" onClick={add}>Add</button></div>
{!members.length&&<p className="muted">No members yet — add your first circle. Inviting others needs account sharing (backend follow-up).</p>}</div>
</div>;
}
