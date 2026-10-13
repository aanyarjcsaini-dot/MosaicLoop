import {useEffect,useMemo,useState} from 'react';import axios from 'axios';import {Q,IDENTITIES,dnaOf,driversOf,identityFor,describeIdentity,localDay,qualifyingWellness,streakDays,seedHist} from '../lib/wellness.js';import {dailyFact} from '../lib/facts.js';import Petals,{Ring} from '../components/Visuals.jsx';import IdentityPopup from '../components/IdentityPopup.jsx';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
function load(){try{return JSON.parse(localStorage.getItem('entries')||'null')||seedHist();}catch(e){return seedHist();}}
export default function Home(){
const entries0=load();const[entries,setEntries]=useState(entries0);
const[step,setStep]=useState(0);const[cur,setCur]=useState({});
const[stage,setStage]=useState('ask');const[usedPick,setUsedPick]=useState(null);
const[msg,setMsg]=useState('');const fact=useMemo(dailyFact,[]);const[pop,setPop]=useState(null);
function fullId(e){if(!e){return null;}const found=IDENTITIES.filter(function(x){return e.identity&&x.id===e.identity.id;})[0];
if(found){return found;}try{return identityFor(e.dna||dnaOf(e.picks||{}),{streak:0});}catch(err){return{id:'info',name:(e.identity&&e.identity.name)||'Check-in',icon:'💠',color:'#0E3B2E',blurb:'Your recorded reflection.'};}}
useEffect(function(){localStorage.setItem('entries',JSON.stringify(entries));},[entries]);
const live=useMemo(function(){const s=[...entries].sort(function(a,b){return a.ts<b.ts?-1:1;});return s[s.length-1]||null;},[entries]);
const wDays=[...new Set(entries.filter(qualifyingWellness).map(function(e){return e.day;}))].sort();
let shelfDays=[];try{shelfDays=JSON.parse(localStorage.getItem('shelf2')||'[]').flatMap(function(it){return it.confirmations||[];});}catch(e){shelfDays=[];}
const pDays=[...new Set(entries.filter(function(e){return e.productUse;}).map(function(e){return e.day;}).concat(shelfDays))].sort();
const w=streakDays(wDays),p=streakDays(pDays);
const q=Q[step];
const pick=function(i){const np={};Object.keys(cur).forEach(function(k){np[k]=cur[k];});np[q.k]=i;setCur(np);
if(step<Q.length-1){setStep(step+1);}else{setStage('product');}};
const confirmUsed=function(v){setUsedPick(v);setStage('save');};
const save=function(){
const d=dnaOf(cur);const id=identityFor(d,{streak:w.current});
const ts=new Date().toISOString();
const entry={id:'e'+Date.now(),ts:ts,day:ts.slice(0,10),picks:cur,dna:d,identity:{id:id.id,name:id.name,icon:id.icon,color:id.color},productUse:usedPick==='yes'};
setEntries(function(es){return [...es,entry];});
setCur({});setStep(0);setUsedPick(null);setStage('done');setMsg('Saved — DNA updated instantly');
try{axios.post(API+'/checkins/entry',{household:'default',brandPref:localStorage.getItem('brandPref')||'Be Bodywise',entry:entry}).catch(function(){});}catch(e){}
};
const again=function(){setStage('ask');setStep(0);setMsg('');};
const edit=function(e){setCur(e.picks||{});setStep(0);setStage('ask');setMsg('Editing '+e.day+' — answers loaded');window.scrollTo({top:0});};
const today=entries.filter(function(e){return e.day===localDay();}).sort(function(a,b){return a.ts<b.ts?-1:1;});
const lastSaved=useMemo(function(){const s=[...entries].sort(function(a,b){return a.ts<b.ts?-1:1;});return s[s.length-1]||null;},[entries]);
return<div style={{display:'grid',gap:12}}>
<div className="card"><h2 style={{fontFamily:'Fraunces,serif',margin:'4px 0'}}>Hey, how are you today?</h2>
<p className="muted">6 quick taps. Your mirror, not a medical test.</p></div>
{stage==='ask'&&<div className="card"><p className="muted">Question {step+1}/{Q.length}</p>
<div style={{height:8,background:'#ECE4D4',borderRadius:99}}><div style={{width:((step+1)/Q.length*100)+'%',height:'100%',background:'#0E3B2E',borderRadius:99}}/></div>
<h3>{q.t}</h3><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{q.o.map(function(o,i){return<button key={o} className="chip" onClick={function(){pick(i);}}>{q.e[i]} {o}</button>;})}</div></div>}
<div className="card" style={{background:'linear-gradient(135deg,#FFF7EA,#FFE7CF)'}}><small className="muted">DID YOU KNOW? • {fact.cat}</small><p><b>{fact.title}</b></p><p className="muted">{fact.why}</p><p className="muted">Source: {fact.source}</p></div>
{stage==='product'&&<><div className="scrim"/><div className="sheet"><h3>Did you use your product today?</h3><p className="muted">One tap feeds your product-use streak.</p>
<div style={{display:'flex',gap:8}}><button className="btn" onClick={function(){confirmUsed('yes');}}>Yes ✓</button><button className="chip" onClick={function(){confirmUsed('no');}}>No</button></div></div></>}
{stage==='save'&&<><div className="scrim"/><div className="sheet"><h3>Save check-in?</h3><p className="muted">{Object.keys(cur).length} answers • product: {usedPick==='yes'?'used today':'not today'}</p>
<div style={{display:'flex',gap:8}}><button className="btn" onClick={save}>Save Check-in</button><button className="chip" onClick={function(){setStage('ask');}}>Review</button></div></div></>}
{stage==='done'&&lastSaved&&function(){const fi=fullId(lastSaved);const an=describeIdentity(fi.id,entries);return<div className="card" style={{borderTop:'6px solid '+fi.color}}><h3><span style={{fontSize:28}}>{fi.icon}</span> <button style={{color:fi.color,background:'none',border:'none',fontSize:'1.1em',fontWeight:800,fontFamily:'Fraunces,serif'}} onClick={function(){setPop({ident:fi,picks:lastSaved.picks});}}>{fi.name} ⓘ</button></h3><Petals dna={lastSaved.dna}/>
<p>{an.line}</p>
<p><b>Tomorrow, try:</b> {an.tip}</p>
<p className="muted">{msg} • Self-reported patterns, not medical advice.</p>
<button className="btn" onClick={again}>Check in again</button></div>;}()}
{stage==='ask'&&live&&function(){const fi=fullId(live);const an=describeIdentity(fi.id,entries);return<div className="card" style={{borderTop:'6px solid '+fi.color}}><h3><span style={{fontSize:28}}>{fi.icon}</span> <button style={{color:fi.color,background:'none',border:'none',fontSize:'1.1em',fontWeight:800,fontFamily:'Fraunces,serif'}} onClick={function(){setPop({ident:fi,picks:live.picks});}}>Live Wellness DNA — {fi.name} ⓘ</button></h3><Petals dna={live.dna||dnaOf(live.picks)}/><p>{an.line}</p><p className="muted">Latest: {live.day} • updates the moment you save. Tap the name for details.</p></div>;}()}
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
<div className="card" style={{background:'linear-gradient(135deg,#FFF7EA,#FFEDD5)'}}><div style={{fontSize:30}}>🔥</div><b>Wellness streak</b><p style={{fontSize:22,margin:'4px 0'}}>{w.current} 🔥 <span className="muted">best {w.best}</span></p><div style={{height:8,background:'#F3E3C8',borderRadius:99}}><div style={{width:Math.min(100,w.current/7*100)+'%',height:'100%',background:'#EA580C',borderRadius:99}}/></div><p className="muted">{w.current===0?'One check-in starts the fire.':w.current<7?(7-w.current)+' days to your 7-day glow!':'Blazing — protect the streak gently.'}</p></div>
<div className="card" style={{background:'linear-gradient(135deg,#ECFDF5,#D1FAE5)'}}><div style={{fontSize:30}}>💧</div><b>Product-use streak</b><p style={{fontSize:22,margin:'4px 0'}}>{p.current} 💧 <span className="muted">best {p.best}</span></p><div style={{height:8,background:'#CDEBD9',borderRadius:99}}><div style={{width:Math.min(100,p.current/7*100)+'%',height:'100%',background:'#059669',borderRadius:99}}/></div><p className="muted">{p.current===0?'Confirm “Used today” to begin.':p.current<7?(7-p.current)+' consistent days to go!':'Routine locked in — nicely consistent.'}</p></div>
</div>
{pop&&<IdentityPopup ident={pop.ident} entries={entries} picks={pop.picks} onClose={function(){setPop(null);}}/>}
</div>;
}
