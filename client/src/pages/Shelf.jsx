import {useState} from 'react';import {PRODUCTS} from '../data/products.js';import {shelf,saveShelf,estimate,dayKey,logDay,confirmToday,dueForPrompt} from '../lib/shelf.js';import {Ring} from '../components/Visuals.jsx';import Feedback from '../components/Feedback.jsx';
export default function Shelf(){
const[s,setS]=useState(shelf());const[ask,setAsk]=useState(null);const[fbFor,setFbFor]=useState(null);const[orderRef,setOrderRef]=useState('');
const today=dayKey();
const upd=n=>{saveShelf(n);setS(n);try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/shelf',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({household:'default',items:n})}).catch(()=>{});}catch{}};
const addDefault=()=>{const it={id:'s'+Date.now(),pid:'bb-biotin-30',startDate:today,perDayOverride:null,expectedOverride:null,confirmations:[],snoozeUntil:null,lastPrompt:null,status:'open'};const n=[...s,it];upd(n);logDay(today,`added ${PRODUCTS.find(p=>p.id===it.pid).name} (start ${it.startDate})`);};
const usedToday=i=>{const n=[...s];const before=(n[i].confirmations||[]).length;n[i]=confirmToday(n[i]);if((n[i].confirmations||[]).length!==before){upd(n);logDay(today,`confirmed use: ${PRODUCTS.find(p=>p.id===n[i].pid).name}`);}};
const snooze=()=>{const i=Number(String(ask).slice(1));const n=[...s];const d=new Date();d.setDate(d.getDate()+3);n[i].snoozeUntil=d.toISOString().slice(0,10);upd(n);setAsk(null);};
const openOfficial=i=>{const p=PRODUCTS.find(x=>x.id===s[i].pid);const n=[...s];n[i].lastPrompt=today;upd(n);
logDay(today,`restock started: ${p.name} → official page (pending verification, not purchased)`);
window.open(p.url+'?utm_source=wellness-app&utm_medium=restock&utm_campaign='+p.id,'_blank','noopener');};
const linkOrder=i=>{if(!orderRef.trim())return;const p=PRODUCTS.find(x=>x.id===s[i].pid);
logDay(today,`linked order ${orderRef.trim()} → ${p.name} (unverified until sync)`);
try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/purchases/link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({household:'default',orderRef:orderRef.trim(),productId:p.id})}).catch(()=>{});}catch{}
setOrderRef('');setAsk(null);};
return<div style={{display:'grid',gap:12}}>
{s.map((it,i)=>{const p=PRODUCTS.find(x=>x.id===it.pid);if(!p)return null;const e=estimate(it,p,today);
if(e.state==='needs-dates')return<div key={it.id} className="card"><b>Missing start date</b></div>;
const pct=Math.max(0,e.remaining/e.expected);const show=dueForPrompt(it,p,today);
return<div key={it.id} className="card"><div style={{display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:34}}>{p.img}</div>
<div><b>{p.name}</b><br/><span className="muted">{p.brand} • start {it.startDate} • ~{e.remaining}d left • ends {e.finish}{e.state==='depleted'?' • may be depleted — confirm?':''}</span><br/><span className="muted">Estimated day {Math.min(e.expected,e.elapsed+1)}/{e.expected} • Confirmed {(it.confirmations||[]).length}d</span>
<div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}><button className="chip" onClick={()=>usedToday(i)}>Used today ✓</button></div></div>
<div style={{marginLeft:'auto'}}><Ring pct={pct} label={`${e.remaining}d`}/></div></div>
{show&&<div className="card" style={{marginTop:8,background:'#FFF7EA'}}><b>Your product may last another {e.remaining} days. Ready to restock?</b><div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><button className="btn" onClick={()=>{const n=[...s];n[i].lastPrompt=today;upd(n);setFbFor({i,mode:'restock'});}}>Restock now</button><button className="chip" onClick={snooze}>Remind me later</button><button className="chip" onClick={()=>setFbFor({i,mode:'pass'})}>I still have enough / update</button></div></div>}
{fbFor?.i===i&&<div style={{marginTop:8}}><Feedback mode={fbFor.mode} pid={it.pid} onDone={(fb)=>{const mode=fbFor.mode;setFbFor(null);
if(mode==='restock'){openOfficial(i);}else{logDay(today,`passed: ${p.name}${fb?` (${fb.reasons.join(', ')})`:''} — inventory preserved`);}setAsk('done'+i);}}/></div>}
{ask==='done'+i&&<div className="card" style={{marginTop:8}}><p className="muted">Restock click ≠ purchase. Buy on the official page, then link your order:</p><div style={{display:'flex',gap:8}}><input value={orderRef} onChange={e=>setOrderRef(e.target.value)} placeholder="Order ref (e.g. BW123)" aria-label="Order reference"/><button className="btn" onClick={()=>linkOrder(i)}>Link order</button></div><a href={p.url} target="_blank" rel="noreferrer">Open official product page ↗</a></div>}
</div>;})}
<div className="card"><b>Add product</b><p className="muted">Purchases sync from verified orders; manual add for already-owned:</p><button className="btn" onClick={addDefault}>+ Add Biotin (started today)</button></div>
<p className="muted">Estimates auto-update. Confirmations explicit. Verified purchases only via sync/link.</p>
</div>;
}
