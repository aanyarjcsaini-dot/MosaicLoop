import {useEffect,useMemo,useState} from 'react';import axios from 'axios';import {Q,dnaOf,identityFor,localDay,qualifyingWellness,streakDays,seedHist} from '../lib/wellness.js';import Petals,{Ring} from '../components/Visuals.jsx';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
function load(){try{return JSON.parse(localStorage.getItem('entries')||'null')||seedHist();}catch{return seedHist();}}
export default function Home(){
const[entries,setEntries]=useState(load);
const[step,setStep]=useState(0);const[cur,setCur]=useState({});const[note,setNote]=useState('');const[used,setUsed]=useState(false);const[editing,setEditing]=useState(null);const[msg,setMsg]=useState('');
useEffect(()=>localStorage.setItem('entries',JSON.stringify(entries)),[entries]);
const live=useMemo(()=>{const q=[...entries].sort((a,b)=>a.ts<b.ts?-1:1).pop();return q||null;},[entries]);
const liveDna=live?dnaOf(live.picks):(Object.keys(cur).length?dnaOf(cur):null);
const liveId=liveDna?identityFor(liveDna):null;
const wDays=[...new Set(entries.filter(qualifyingWellness).map(e=>e.day))].sort();
let shelfDays=[];try{shelfDays=JSON.parse(localStorage.getItem('shelf2')||'[]').flatMap(it=>it.confirmations||[]);}catch{shelfDays=[];}
const pDays=[...new Set([...entries.filter(e=>e.productUse).map(e=>e.day),...shelfDays])].sort();
const w=streakDays(wDays),p=streakDays(pDays);
const q=Q[step];
const pick=i=>{setCur(c=>({...c,[q.k]:i}));if(step<Q.length-1)setStep(step+1);};
const save=async()=>{
const picks=editing?{...editing.picks,...cur}:cur;
if(Object.keys(picks).length<4){setMsg('Answer a few more to qualify.');return;}
const d=dnaOf(picks);const id=identityFor(d);
const ts=editing?editing.ts:new Date().toISOString();
const entry={id:editing?.id||('e'+Date.now()),ts,day:ts.slice(0,10),picks,dna:d,identity:{id:id.id,name:id.name},note,productUse:used};
setEntries(es=>{const f=es.filter(e=>e.ts!==ts);return[...f,entry];});
setCur({});setNote('');setUsed(false);setEditing(null);setStep(0);setMsg('Saved ✓ live DNA updated');
try{await axios.post(`${API}/checkins/entry`,{household:'default',brandPref:'Be Bodywise',entry});}catch{setMsg('Saved locally ✓');}
};
const edit=e=>{setEditing(e);setCur(e.picks||{});setNote(e.note||'');setUsed(!!e.productUse);setStep(0);window.scrollTo({top:0});};
const today=entries.filter(e=>e.day===localDay()).sort((a,b)=>a.ts<b.ts?-1:1);
return<div style={{display:'grid',gap:12}}>
<div className="card"><h2 style={{fontFamily:'Fraunces,serif',margin:'4px 0'}}>Hey, how are you today?</h2>
<p className="muted">One unified ecosystem — no brand gate. Quick ritual, text or voice note optional.</p>
<p className="muted">Question {step+1}/{Q.length}</p>
<div style={{height:8,background:'#ECE4D4',borderRadius:99}}><div style={{width:`${(step+1)/Q.length*100}%`,height:'100%',background:'#0E3B2E',borderRadius:99}}/></div>
<h3>{q.t}</h3><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{q.o.map((o,i)=><button key={o} className={'chip'+(cur[q.k]===i?' sel':'')} onClick={()=>pick(i)}>{q.e[i]} {o}</button>)}</div>
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><button disabled={step===0} onClick={()=>setStep(step-1)}>Back</button><button onClick={()=>setStep((step+1)%Q.length)}>Skip</button></div>
<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Optional note…" aria-label="Optional note" style={{width:'100%',marginTop:8}}/>
<label style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}><input type="checkbox" checked={used} onChange={e=>setUsed(e.target.checked)}/> I used my product today (confirms product-use streak)</label>
<button className="btn" onClick={save}>{editing?'Update entry':'Save check-in'}</button> <span className="muted">{msg}</span></div>
{liveDna&&<div className="card"><h3>Live Wellness DNA — {liveId.name}</h3><Petals dna={liveDna}/><p><b>{liveId.blurb}</b></p><p className="muted">Updates instantly. Self-reported patterns, not medical advice.</p></div>}
<div className="card" style={{display:'flex',gap:16,flexWrap:'wrap'}}><div><b>Wellness streak</b><p>{w.current}d now • best {w.best}d • {(7-w.current%7)%7} to milestone</p></div><div><b>Product-use streak</b><p>{p.current}d now • best {p.best}d • confirm “Used today” only</p></div><Ring pct={Math.min(1,w.current/7)} label={`${w.current}/7`}/></div>
<div className="card"><h3>Today — {today.length} identities</h3>{today.map(e=><div key={e.ts} style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid #ECE4D4',padding:'6px 0'}}><span>{new Date(e.ts).toLocaleTimeString()} • <b>{e.identity?.name||'Check-in'}</b>{e.productUse?' • ✓ used':''}</span><button onClick={()=>edit(e)}>Edit</button></div>)||<p className="muted">None yet.</p>}</div>
<div className="card"><h3>History</h3>{[...entries].sort((a,b)=>b.ts.localeCompare(a.ts)).slice(0,6).map(e=><div key={e.ts} className="muted">{e.day} {new Date(e.ts).toLocaleTimeString()} • {e.identity?.name} {e.note?`• “${e.note.slice(0,40)}”`:''}</div>)}
{(()=>{const within=n=>{const c=new Date();c.setDate(c.getDate()-n);return entries.filter(e=>new Date(e.ts)>=c);};
const c7={},c30={};within(7).forEach(e=>{const k=e.identity?.name||'Check-in';c7[k]=(c7[k]||0)+1;});within(30).forEach(e=>{const k=e.identity?.name||'Check-in';c30[k]=(c30[k]||0)+1;});
return<p className="muted">7d: {Object.entries(c7).map(([k,v])=>`${k}×${v}`).join(', ')||'—'}<br/>30d: {Object.entries(c30).slice(0,4).map(([k,v])=>`${k}×${v}`).join(', ')||'—'}<br/>Correlation only — feeling better alongside a product is not proof it caused it.</p>;})()}</div>
</div>;
}
