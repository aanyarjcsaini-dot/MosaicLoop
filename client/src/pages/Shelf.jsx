import {useState} from 'react';import {ShoppingBag,Bell,Check} from 'lucide-react';import {PRODUCTS} from '../data/products.js';import {shelf,saveShelf,estimate,dayKey,logDay,confirmProduct,dueForPrompt,usageDays} from '../lib/shelf.js';import {streakDays} from '../lib/wellness.js';import {Ring} from '../components/Visuals.jsx';import Feedback from '../components/Feedback.jsx';
export default function Shelf(){
const[s,setS]=useState(shelf());const[ask,setAsk]=useState(null);const[fbFor,setFbFor]=useState(null);const[orderRef,setOrderRef]=useState('');
const today=dayKey();
const upd=function(n){saveShelf(n);setS(n);try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/shelf',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({household:'default',items:n})}).catch(function(){});}catch(e){}};
const addDefault=function(){const it={id:'s'+Date.now(),pid:'bb-biotin-30',startDate:today,perDayOverride:null,expectedOverride:null,confirmations:[],snoozeUntil:null,lastPrompt:null,muted:false,status:'open'};const n=[...s,it];upd(n);logDay(today,'added '+PRODUCTS.find(function(p){return p.id===it.pid;}).name+' (start '+it.startDate+')');};
const usedToday=function(i){const pid=s[i].pid;const before=usageDays(pid).length;const items=confirmProduct(pid,today);setS(items);if(usageDays(pid).length!==before){logDay(today,'confirmed use: '+PRODUCTS.find(function(p){return p.id===pid;}).name);}};
const snooze=function(){const i=Number(String(ask).slice(1));const n=[...s];const d=new Date();d.setDate(d.getDate()+3);n[i].snoozeUntil=d.toISOString().slice(0,10);upd(n);setAsk(null);};
const mute=function(i){const n=[...s];n[i].muted=!n[i].muted;upd(n);};
const openOfficial=function(i){const p=PRODUCTS.find(function(x){return x.id===s[i].pid;});const n=[...s];n[i].lastPrompt=today;upd(n);
logDay(today,'restock started: '+p.name+' → official page (pending verification, not purchased)');
window.open(p.url+'?utm_source=wellness-app&utm_medium=restock&utm_campaign='+p.id,'_blank','noopener');};
const linkOrder=function(i){if(!orderRef.trim()){return;}const p=PRODUCTS.find(function(x){return x.id===s[i].pid;});
logDay(today,'linked order '+orderRef.trim()+' → '+p.name+' (unverified until sync)');
try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/purchases/link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({household:'default',orderRef:orderRef.trim(),productId:p.id})}).catch(function(){});}catch(e){}
setOrderRef('');setAsk(null);};
const card=function(it,i){
const p=PRODUCTS.find(function(x){return x.id===it.pid;});if(!p){return null;}const e=estimate(it,p,today);
if(e.state==='needs-dates'){return<div key={it.id} className="card"><b>Missing start date</b></div>;}
const pct=Math.max(0,e.remaining/e.expected);const show=!it.muted&&dueForPrompt(it,p,today);
return<div key={it.id} className="card"><div style={{display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:34}}>{p.img}</div>
<div><b>{it.muted?'🔕 ':''}{p.name}</b><br/><span className="muted">{p.brand} • start {it.startDate} • ~{e.remaining}d left • ends {e.finish}{e.state==='depleted'?' • may be depleted — confirm?':''}</span><br/><span className="muted">Estimated day {Math.min(e.expected,e.elapsed+1)}/{e.expected} • 🔥 {streakDays(usageDays(it.pid)).current}d streak • history: {(usageDays(it.pid).slice(-4).join(', ')||'none yet')}</span>
<div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}><button className="chip" onClick={function(){usedToday(i);}}>Used today ✓</button><button className="chip" onClick={function(){mute(i);}}>{it.muted?'Unmute reminders':'Mute reminders'}</button></div></div>
<div style={{marginLeft:'auto'}}><Ring pct={pct} label={e.remaining+'d'}/></div></div>
{show&&<div className="card" style={{marginTop:8,background:'#FFF7EA'}}><b>🔔 About {e.remaining} days left. Ready to restock?</b><div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><button className="btn" onClick={function(){const n=[...s];n[i].lastPrompt=today;upd(n);setFbFor({i:i,mode:'restock'});}}>Purchase Now</button><button className="chip" onClick={snooze}>Remind me later</button><button className="chip" onClick={function(){setFbFor({i:i,mode:'pass'});}}>Pass This Time</button></div></div>}
{fbFor&&fbFor.i===i&&<div style={{marginTop:8}}><Feedback mode={fbFor.mode} pid={it.pid} onDone={function(fb){const mode=fbFor.mode;setFbFor(null);
if(mode==='restock'){openOfficial(i);}else{logDay(today,'passed: '+p.name+(fb&&fb.reasons.length?' ('+fb.reasons.join(', ')+')':'')+' — inventory preserved');}setAsk('done'+i);}}/></div>}
{ask==='done'+i&&<div className="card" style={{marginTop:8}}><p className="muted">Restock click is not a purchase. Buy on the official page, then link your order:</p><div style={{display:'flex',gap:8}}><input value={orderRef} onChange={function(e){setOrderRef(e.target.value);}} placeholder="Order ref (e.g. BW123)" aria-label="Order reference"/><button className="btn" onClick={function(){linkOrder(i);}}>Link order</button></div><a href={p.url} target="_blank" rel="noreferrer">Open official product page ↗</a></div>}
</div>;};
const usedIdx=[],restIdx=[];
s.forEach(function(it,i){const p=PRODUCTS.find(function(x){return x.id===it.pid;});if(!p){return;}const e=estimate(it,p,today);
if(e.state==='depleted'||(!it.muted&&dueForPrompt(it,p,today))){restIdx.push(i);}else{usedIdx.push(i);}});
return<div style={{display:'grid',gap:12}}>
<div className="card"><h3><ShoppingBag size={18}/> Used — currently tracking</h3><p className="muted">Check-in “Yes” and Used-today taps land here automatically.</p></div>
{usedIdx.length?usedIdx.map(function(i){return card(s[i],i);}):<div className="card"><p className="muted">Nothing here — add your first product below.</p></div>}
<div className="card" style={{background:'linear-gradient(135deg,#FFF7EA,#FFE7CF)'}}><h3><Bell size={18}/> Restock — low or finished</h3><p className="muted">Shows at ~5 days left. Purchase opens the official site; passing asks why.</p></div>
{restIdx.length?restIdx.map(function(i){return card(s[i],i);}):<div className="card"><p className="muted">All stocked up. Nothing needs restocking.</p></div>}
<div className="card"><b>Add product</b><p className="muted">Purchases sync from verified orders; manual add for already-owned:</p><button className="btn" onClick={addDefault}>+ Add Biotin (started today)</button></div>
<p className="muted">Estimates auto-update with time. Confirmations are explicit. Verified purchases only via sync/link.</p>
</div>;
}
