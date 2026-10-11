import {useState} from 'react';import {logs} from '../lib/shelf.js';
export default function Calendar(){
const[cur,setCur]=useState(()=>{const d=new Date();d.setDate(1);return d;});
const[day,setDay]=useState(null);
const y=cur.getFullYear(),m=cur.getMonth();
const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
const L=logs();let entries=[];try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch{entries=[];}
const byDay={};entries.forEach(e=>{byDay[e.day]=byDay[e.day]||[];byDay[e.day].push(e);});
const kFor=d=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
return<div style={{display:'grid',gap:12}}>
<div className="card"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><button onClick={()=>setCur(new Date(y,m-1,1))}>‹</button><b>{cur.toLocaleString('default',{month:'long',year:'numeric'})}</b><button onClick={()=>setCur(new Date(y,m+1,1))}>›</button></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6,marginTop:10}}>{['S','M','T','W','T','F','S'].map(d=><div key={d} className="muted" style={{textAlign:'center'}}>{d}</div>)}
{Array.from({length:first}).map((_,i)=><div key={'e'+i}/>)}
{Array.from({length:days}).map((_,di)=>{const d=di+1;const k=kFor(d);const shop=L[k]||[];const ids=(byDay[k]||[]).map(e=>e.identity?.name).filter(Boolean);const ev=[...shop,...ids];const today=k===new Date().toISOString().slice(0,10);
return<button key={k} className="chip" style={{minHeight:64,borderColor:today?'#0E3B2E':'',background:ev.length?'#E7F4EA':'#fff'}} onClick={()=>setDay(k)}><b>{d}</b><br/><small>{ids.slice(0,2).join(' • ')||ev.slice(0,2).map(e=>e.includes('bought')?'🛍️':'💭').join(' ')}</small></button>;})}</div></div>
{day&&<><div className="scrim" onClick={()=>setDay(null)}/><div className="sheet"><h3>{day}</h3>
{((byDay[day])||[]).map(e=><p key={e.ts}>• {new Date(e.ts).toLocaleTimeString()} — <b>{e.identity?.name}</b>{e.productUse?' • ✓ used':''}{e.note?` — “${e.note}”`:''}</p>)}
{((L[day])||[]).map(e=><p key={e}>• {e}</p>)}
<button className="btn" onClick={()=>setDay(null)}>Close</button></div></>}
</div>;
}
