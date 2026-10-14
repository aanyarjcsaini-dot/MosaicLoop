import {useEffect,useState} from 'react';import {ShoppingBag,Bell,Check} from 'lucide-react';import {PRODUCTS} from '../data/products.js';import {shelf,saveShelf,estimate,dayKey,logDay,confirmProduct,dueForPrompt,needsRestock,usageDays} from '../lib/shelf.js';import {streakDays,concernStrip} from '../lib/wellness.js';import {trialInfo,trialLine} from '../lib/trial.js';import {Ring} from '../components/Visuals.jsx';import Feedback from '../components/Feedback.jsx';
export default function Shelf(){
const[s,setS]=useState(shelf());const[ask,setAsk]=useState(null);const[fbFor,setFbFor]=useState(null);const[orderRef,setOrderRef]=useState('');const[thanks,setThanks]=useState(false);const[cfg,setCfg]=useState([]);const[trialFb,setTrialFb]=useState(null);const[onb,setOnb]=useState(function(){try{return localStorage.getItem('trial-onboard')!=='1';}catch(e){return true;}});
const today=dayKey();
useEffect(function(){fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/products').then(function(r){return r.json();}).then(function(a){setCfg(Array.isArray(a)?a:[]);}).catch(function(){});},[]);
const cfgFor=function(pid){return cfg.filter(function(c){return c.sku===pid||pid.indexOf(c.sku)>=0||c.sku.indexOf(pid)>=0;})[0]||null;};
const dismissOnb=function(){try{localStorage.setItem('trial-onboard','1');}catch(e){}setOnb(false);};
const upd=function(n){saveShelf(n);setS(n);try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/shelf',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({household:'default',items:n})}).catch(function(){});}catch(e){}};
const addDefault=function(){const it={id:'s'+Date.now(),pid:'bb-biotin-30',startDate:today,perDayOverride:null,expectedOverride:null,confirmations:[],snoozeUntil:null,lastPrompt:null,muted:false,status:'open'};const n=[...s,it];upd(n);logDay(today,'added '+PRODUCTS.find(function(p){return p.id===it.pid;}).name+' (start '+it.startDate+')');logDay(today,'trial start: '+PRODUCTS.find(function(p){return p.id===it.pid;}).name);};
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
const pct=Math.max(0,e.remaining/e.expected);const show=!it.muted&&needsRestock(it,p,today);
const low=needsRestock(it,p,today);
return<div key={it.id} className="card" style={low?{background:'linear-gradient(135deg,#FFE9DC,#FFF6EC)',border:'2px solid #FFB99B'}:null}><div style={{display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:34}}>{p.img}</div>
<div><b>{it.muted?'🔕 ':''}{p.name}</b><br/><span className="muted">{p.brand} • start {it.startDate} • ~{e.remaining}d left • ends {e.finish}{e.state==='depleted'?' • may be depleted — confirm?':''}</span><br/><span className="muted">Estimated day {Math.min(e.expected,e.elapsed+1)}/{e.expected} • 🔥 {streakDays(usageDays(it.pid)).current}d streak • history: {(usageDays(it.pid).slice(-4).join(', ')||'none yet')}</span>
<div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}><button className="chip" onClick={function(){usedToday(i);}}>Used today ✓</button><button className="chip" onClick={function(){mute(i);}}>{it.muted?'Unmute reminders':'Mute reminders'}</button><button className="chip" onClick={function(){setFbFor({i:i,mode:'pass'});}}>Report an issue</button></div></div>
<div style={{marginLeft:'auto'}}><Ring pct={pct} label={e.remaining+'d'}/></div></div>
{function(){const c=cfgFor(it.pid);const conf=usageDays(it.pid).length;const t=trialInfo(c,conf,e.elapsed+1);
if(!t.known){return<p className="muted">Fair trial: no typical window available for this product.</p>;}
const doneFlag=function(){try{return localStorage.getItem('trialdone-'+it.pid)==='1';}catch(e2){return false;}}();
return<div><p className="muted">Fair-trial window: {trialLine(c,conf,e.elapsed+1)} Consistency so far: {conf} of {e.elapsed+1} days (confirmed taps only).</p>
{t.done&&!doneFlag()&&<div className="card" style={{marginTop:6,background:'#E6E0FF'}}><b>You've given it a fair trial. How does it feel?</b>{['Noticed change','Not sure yet','No change','Stopped early'].map(function(o){return<button key={o} className="chip" style={{display:'block',width:'100%',marginTop:6}} onClick={function(){try{localStorage.setItem('trialdone-'+it.pid,'1');}catch(e2){}
const fb={id:'fb'+Date.now(),pid:it.pid,mode:'trial',reasons:[o],comment:'',ts:new Date().toISOString()};
try{const all=JSON.parse(localStorage.getItem('feedback')||'[]');all.push(fb);localStorage.setItem('feedback',JSON.stringify(all));}catch(e3){}
try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/reviews/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fb)}).catch(function(){});}catch(e4){}
logDay(today,'trial milestone: '+p.name+' — '+o+(o==='Stopped early'||o==='No change'?' (judge kindly: irregular use can look like no result)':''));setTrialFb(it.pid);}}> {o}</button>;})}</div>}</div>;}()}
{function(){const st=concernStrip((function(){try{return JSON.parse(localStorage.getItem('entries')||'[]');}catch(e2){return[];}})(),it.pid);
if(!st.days.length){return null;}
return<p className="muted">Concern notes (your self-reported notes): {st.days.slice(-7).map(function(d){return '•';}).join(' ')} {st.days.length} noted days{st.days.length>=30?' (30-day view)':' (7-day view)'}.</p>;}()}
{show&&<div className="card" style={{marginTop:8,background:'#FFE9DC'}}><b>🔔 About {e.remaining} days left. Ready to restock?</b><div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><button className="btn" onClick={function(){const n=[...s];n[i].lastPrompt=today;upd(n);setFbFor({i:i,mode:'restock'});}}>Purchase Now</button><button className="chip" onClick={function(){setFbFor({i:i,mode:'pass'});}}>Pass This Time</button></div></div>}
{fbFor&&fbFor.i===i&&<div style={{marginTop:8}}><Feedback mode={fbFor.mode} pid={it.pid} onDone={function(fb){const mode=fbFor.mode;setFbFor(null);if(fb){setThanks(true);}
if(mode==='restock'){openOfficial(i);}else{logDay(today,'passed: '+p.name+(fb&&fb.reasons.length?' ('+fb.reasons.join(', ')+')':'')+' — inventory preserved');}setAsk('done'+i);}}/></div>}
{ask==='done'+i&&<div className="card" style={{marginTop:8}}>{thanks&&<p><b>Thanks. This goes into Mosaic's product feedback.</b></p>}<p className="muted">Restock click is not a purchase. Buy on the official page, then link your order:</p><div style={{display:'flex',gap:8}}><input value={orderRef} onChange={function(e){setOrderRef(e.target.value);}} placeholder="Order ref (e.g. BW123)" aria-label="Order reference"/><button className="btn" onClick={function(){linkOrder(i);}}>Link order</button></div><a href={p.url} target="_blank" rel="noreferrer">Open official product page ↗</a></div>}
</div>;};
const usedIdx=[],restIdx=[];
s.forEach(function(it,i){const p=PRODUCTS.find(function(x){return x.id===it.pid;});if(!p){return;}const e=estimate(it,p,today);
if(needsRestock(it,p,today)){restIdx.push(i);}else{usedIdx.push(i);}});
return<div style={{display:'grid',gap:12}}>
{onb&&<div className="card" style={{background:'linear-gradient(135deg,#E6E0FF,#EFFBDB)'}}><b>New to a product?</b><p className="muted">Most products need steady use for a few weeks. We'll keep track so you can judge fairly.</p><button className="chip" onClick={dismissOnb}>Got it</button></div>}
<div className="card"><h3><ShoppingBag size={18}/> Used — currently tracking</h3><p className="muted">Check-in “Yes” and Used-today taps land here automatically.</p></div>
{usedIdx.length?usedIdx.map(function(i){return card(s[i],i);}):<div className="card"><p className="muted">Nothing here — add your first product below.</p></div>}
<div className="card" style={{background:'linear-gradient(135deg,#E9E1F5,#FFF5D9)'}}><h3><Bell size={18}/> Restock — low or finished</h3><p className="muted">Shows at ~5 days left. Purchase opens the official site; passing asks why.</p></div>
{restIdx.length?restIdx.map(function(i){return card(s[i],i);}):<div className="card"><p className="muted">All stocked up. Nothing needs restocking.</p></div>}
<div className="card"><b>Add product</b><p className="muted">Purchases sync from verified orders; manual add for already-owned:</p><button className="btn" onClick={addDefault}>+ Add Biotin (started today)</button></div>
<p className="muted">Estimates auto-update with time. Confirmations are explicit. Verified purchases only via sync/link.</p>
</div>;
}
