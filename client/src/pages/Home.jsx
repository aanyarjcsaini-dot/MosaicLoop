import {useEffect,useMemo,useState} from 'react';import axios from 'axios';import {Flame,Droplets} from 'lucide-react';import {Q,IDENTITIES,dnaOf,driversOf,identityFor,describeIdentity,localDay,qualifyingWellness,streakDays,seedHist} from '../lib/wellness.js';import {dailyFact} from '../lib/facts.js';import {PRODUCTS} from '../data/products.js';import {confirmProduct,dayKey as shelfDay} from '../lib/shelf.js';import Petals,{Ring} from '../components/Visuals.jsx';import IdentityPopup from '../components/IdentityPopup.jsx';
const QBLOB={sleep:{c:'#DCCEFF',m:'sleepy'},energy:{c:'#F8A8C8',m:'happy'},mood:{c:'#FFE59A',m:'happy'},stress:{c:'#C7E5FF',m:'calm'},food:{c:'#C9EAD8',m:'happy'},skin:{c:'#FF7F91',m:'happy'}};import Blob from '../components/Blobs.jsx';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
function load(){try{return JSON.parse(localStorage.getItem('entries')||'null')||seedHist();}catch(e){return seedHist();}}
export default function Home(){
const entries0=load();const[entries,setEntries]=useState(entries0);
const[step,setStep]=useState(0);const[cur,setCur]=useState({});
const[stage,setStage]=useState('ask');const[usedPids,setUsedPids]=useState([]);
const shelfPids=function(){try{return JSON.parse(localStorage.getItem('shelf2')||'[]');}catch(e){return[];}};
const togglePid=function(pid){setUsedPids(function(s){return s.indexOf(pid)>=0?s.filter(function(x){return x!==pid;}):[...s,pid];});};
const[msg,setMsg]=useState('');const fact=useMemo(dailyFact,[]);const[pop,setPop]=useState(null);
function fullId(e){if(!e){return null;}const found=IDENTITIES.filter(function(x){return e.identity&&x.id===e.identity.id;})[0];
if(found){return found;}try{return identityFor(e.dna||dnaOf(e.picks||{}),{streak:0});}catch(err){return{id:'info',name:(e.identity&&e.identity.name)||'Check-in',icon:'💠',color:'#554B60',blurb:'Your recorded reflection.'};}}
useEffect(function(){localStorage.setItem('entries',JSON.stringify(entries));},[entries]);
const live=useMemo(function(){const s=[...entries].sort(function(a,b){return a.ts<b.ts?-1:1;});return s[s.length-1]||null;},[entries]);
const wDays=[...new Set(entries.filter(qualifyingWellness).map(function(e){return e.day;}))].sort();
let shelfDays=[];try{shelfDays=JSON.parse(localStorage.getItem('shelf2')||'[]').flatMap(function(it){return it.confirmations||[];});}catch(e){shelfDays=[];}
const pDays=[...new Set(entries.filter(function(e){return e.productUse;}).map(function(e){return e.day;}).concat(shelfDays))].sort();
const w=streakDays(wDays),p=streakDays(pDays);
const q=Q[step];
const pick=function(i){const np={};Object.keys(cur).forEach(function(k){np[k]=cur[k];});np[q.k]=i;setCur(np);
if(step<Q.length-1){setStep(step+1);}else{setUsedPids([]);setStage('product');}};
const save=function(){
const d=dnaOf(cur);const id=identityFor(d,{streak:w.current});
const ts=new Date().toISOString();
const entry={id:'e'+Date.now(),ts:ts,day:ts.slice(0,10),picks:cur,dna:d,identity:{id:id.id,name:id.name,icon:id.icon,color:id.color},productUse:usedPids.length>0,usedProducts:usedPids};
setEntries(function(es){return [...es,entry];});
usedPids.forEach(function(pid){confirmProduct(pid,ts.slice(0,10));});
setCur({});setStep(0);setUsedPids([]);setStage('done');setMsg('Saved — DNA updated instantly');
try{axios.post(API+'/checkins/entry',{household:'default',brandPref:localStorage.getItem('brandPref')||'Be Bodywise',entry:entry}).catch(function(){});}catch(e){}
};
const again=function(){setStage('ask');setStep(0);setMsg('');};
const edit=function(e){setCur(e.picks||{});setStep(0);setStage('ask');setMsg('Editing '+e.day+' — answers loaded');window.scrollTo({top:0});};
const today=entries.filter(function(e){return e.day===localDay();}).sort(function(a,b){return a.ts<b.ts?-1:1;});
function greetName(){try{const p=JSON.parse(localStorage.getItem('profile')||'null');return p&&p.name?p.name.split(' ')[0]:null;}catch(e){return null;}}
function dayPart(){const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening';}
function shelfCount(){try{return JSON.parse(localStorage.getItem('shelf2')||'[]').length;}catch(e){return 0;}}
const lastSaved=useMemo(function(){const s=[...entries].sort(function(a,b){return a.ts<b.ts?-1:1;});return s[s.length-1]||null;},[entries]);
return<div style={{display:'grid',gap:12}}>
<div><h1 style={{fontFamily:'Montserrat',fontWeight:800,margin:'4px 0',lineHeight:1.15}}>{dayPart()}{greetName()?', '+greetName():''},<br/>You're doing amazing!</h1><p className="muted">Small steps. Big changes.</p></div>
<div className="card"><h2 style={{fontFamily:'Montserrat',fontWeight:800,margin:'4px 0'}}>Hey, how are you today?</h2>
<p className="muted">6 quick taps. Your mirror, not a medical test.</p></div>
{stage==='ask'&&<div className="card"><p className="muted">Question {step+1}/{Q.length}</p>
<div style={{height:8,background:'#E4E2F5',borderRadius:99}}><div style={{width:((step+1)/Q.length*100)+'%',height:'100%',background:'#6C7CFF',borderRadius:99}}/></div>
<h3><Blob c={(QBLOB[q.k]||{}).c||'#F8A8C8'} m={(QBLOB[q.k]||{}).m||'happy'} s={34}/> {q.t}</h3><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{q.o.map(function(o,i){return<button key={o} className="chip" onClick={function(){pick(i);}}>{q.e[i]} {o}</button>;})}</div></div>}
<div className="card" style={{background:'linear-gradient(135deg,#FFE9DC,#FFF6EC)'}}><small className="muted">DID YOU KNOW? • {fact.cat}</small><p><b>{fact.title}</b></p><p className="muted">{fact.why}</p><p className="muted">Source: {fact.source}</p></div>
{stage==='product'&&function(){const items=shelfPids();return<><div className="scrim"/><div className="sheet"><h3>Have you used your products today?</h3><p className="muted">Tap each one you used — tap again to undo. Feeds each product's own streak.</p>
{items.length?items.map(function(it){const p=PRODUCTS.filter(function(x){return x.id===it.pid;})[0];const on=usedPids.indexOf(it.pid)>=0;
return<button key={it.id} className="chip" style={{display:'block',width:'100%',marginTop:6,background:on?'#6C7CFF':'#FFFFFF',color:on?'#fff':'inherit',borderColor:on?'#6C7CFF':'#E3DCFF'}} onClick={function(){togglePid(it.pid);}}>{p?p.img+' ':' '}{p?p.name:it.pid} {on?'✓':''}</button>;}):<p className="muted">No products tracked yet — add some in Shelf first.</p>}
<div style={{display:'flex',gap:8,marginTop:10}}><button className="btn" onClick={function(){setStage('save');}}>Continue</button></div></div></>;}()}
{stage==='save'&&<><div className="scrim" onClick={function(){setStage('ask');}}/><div className="sheet"><h3>Save check-in?</h3><p className="muted">{Object.keys(cur).length} answers • products used: {usedPids.length?usedPids.length:'none'}</p>
<div style={{display:'flex',gap:8}}><button className="btn" onClick={save}>Save Check-in</button></div></div></>}
{stage==='done'&&lastSaved&&function(){const fi=fullId(lastSaved);const an=describeIdentity(fi.id,entries);return<div className="card" style={{borderTop:'6px solid '+fi.color}}><h3><Blob c={fi.blob||'#F8A8C8'} m={fi.mood||'happy'} s={40}/> <button style={{color:fi.color,background:'none',border:'none',fontSize:'1.1em',fontWeight:700,fontFamily:'Montserrat'}} onClick={function(){setPop({ident:fi,picks:lastSaved.picks});}}>{fi.name} ⓘ</button></h3><Petals dna={lastSaved.dna}/>
<p>{an.line}</p>
<p><b>Tomorrow, try:</b> {an.tip}</p>
<p className="muted">{msg} • Self-reported patterns, not medical advice.</p>
<button className="btn" onClick={again}>Check in again</button></div>;}()}
{stage==='ask'&&live&&function(){const fi=fullId(live);const an=describeIdentity(fi.id,entries);return<div className="card" style={{borderTop:'6px solid '+fi.color}}><h3><Blob c={fi.blob||'#F8A8C8'} m={fi.mood||'happy'} s={40}/> <button style={{color:fi.color,background:'none',border:'none',fontSize:'1.1em',fontWeight:700,fontFamily:'Montserrat'}} onClick={function(){setPop({ident:fi,picks:live.picks});}}>Live Wellness DNA — {fi.name} ⓘ</button></h3><Petals dna={live.dna||dnaOf(live.picks)}/><p>{an.line}</p><p className="muted">Latest: {live.day} • updates the moment you save. Tap the name for details.</p></div>;}()}
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
<div className="card" style={{background:'linear-gradient(135deg,#E6E0FF,#F4F1FF)'}}><div style={{color:'#6C7CFF'}}><Flame size={30}/></div><b>One Day Rhythm</b><p style={{fontSize:22,margin:'4px 0'}}>{w.current} <span className="muted">day streak • best {w.best}</span></p><div style={{height:8,background:'#DCD5F5',borderRadius:99}}><div style={{width:Math.min(100,w.current/7*100)+'%',height:'100%',background:'#6C7CFF',borderRadius:99}}/></div><p className="muted">{w.current===0?'One check-in starts the rhythm.':w.current<7?(7-w.current)+' days to your 7-day glow!':'Flowing — protect the rhythm gently.'}</p></div>
<div className="card" style={{background:'linear-gradient(135deg,#EFFBDB,#E6E0FF)'}}><div style={{color:'#4E9B4E'}}><Droplets size={30}/></div><b>Two Day Routine</b><p style={{fontSize:22,margin:'4px 0'}}>{p.current} <span className="muted">day streak • best {p.best}</span></p><div style={{height:8,background:'#D8E8C8',borderRadius:99}}><div style={{width:Math.min(100,p.current/7*100)+'%',height:'100%',background:'#5FA832',borderRadius:99}}/></div><p className="muted">{p.current===0?'Confirm “Used today” to begin.':p.current<7?(7-p.current)+' consistent days to go!':'Routine locked in — nicely consistent.'}</p></div>
</div>
<div className="card"><b>Your Progress</b><div style={{display:'flex',gap:8,marginTop:8,textAlign:'center'}}><div style={{flex:1,background:'#EFFBDB',borderRadius:14,padding:'10px 4px'}}><div style={{fontSize:20,fontWeight:800,fontFamily:'Montserrat'}}>{w.current}</div><div className="muted">Day Streak</div></div><div style={{flex:1,background:'#E4EFFF',borderRadius:14,padding:'10px 4px'}}><div style={{fontSize:20,fontWeight:800,fontFamily:'Montserrat'}}>{entries.length}</div><div className="muted">Total Check-ins</div></div><div style={{flex:1,background:'#FFE9DC',borderRadius:14,padding:'10px 4px'}}><div style={{fontSize:20,fontWeight:800,fontFamily:'Montserrat'}}>{shelfCount()}</div><div className="muted">Products Used</div></div></div></div>
{pop&&<IdentityPopup ident={pop.ident} entries={entries} picks={pop.picks} onClose={function(){setPop(null);}}/>}
</div>;
}
