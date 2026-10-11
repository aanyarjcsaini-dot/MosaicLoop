import {useState} from 'react';
const KINDS=['Parent','Partner','Sibling','Child'];
export default function Family(){
const[members,setMembers]=useState(JSON.parse(localStorage.getItem('fam')||'[{"name":"Mom","kind":"Parent","dna":{"Sleep":55,"Energy":60,"Stress":50}}]'));
const[name,setName]=useState('');const[kind,setKind]=useState('Parent');
const add=()=>{if(!name.trim())return;const m=[...members,{name:name.trim(),kind,dna:{Sleep:55+Math.round(Math.random()*20),Energy:55+Math.round(Math.random()*20),Stress:45+Math.round(Math.random()*20)}}];setMembers(m);localStorage.setItem('fam',JSON.stringify(m));setName('');};
return<div style={{display:'grid',gap:12}}>
<div className="card"><h3>Family Circle — light</h3><p className="muted">Each keeps a mini DNA. No complex dashboard.</p>
<div style={{display:'flex',gap:8,flexWrap:'wrap'}}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" aria-label="Member name"/><select value={kind} onChange={e=>setKind(e.target.value)} aria-label="Relation">{KINDS.map(k=><option key={k}>{k}</option>)}</select><button className="btn" onClick={add}>Add</button></div></div>
{members.map((m,i)=><div key={i} className="card"><b>{m.name}</b> <span className="muted">• {m.kind}</span><div className="muted">Sleep {m.dna.Sleep} • Energy {m.dna.Energy} • Stress signal {100-m.dna.Stress}</div></div>)}
</div>;
}
