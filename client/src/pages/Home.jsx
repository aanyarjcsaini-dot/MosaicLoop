import {useEffect,useMemo,useState} from 'react';import axios from 'axios';import {useApp} from '../store.js';import {Q,dnaOf,driversOf,identityFor,localDay,qualifyingWellness,streakDays,seedHist} from '../lib/wellness.js';import {dailyFact} from '../lib/facts.js';import Petals,{Ring} from '../components/Visuals.jsx';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
function load(){try{return JSON.parse(localStorage.getItem('entries')||'null')||seedHist();}catch(e){return seedHist();}}
export default function Home(){
const entries0=load();const[entries,setEntries]=useState(entries0);
const tabGo=useApp(function(s){return s.setTab;});
const[step,setStep]=useState(0);const[cur,setCur]=useState({});
const[stage,setStage]=useState('ask');const[usedPick,setUsedPick]=useState(null);
const[msg,setMsg]=useState('');const fact=useMemo(dailyFact,[]);
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
const entry={id:'e'+Date.now(),ts:ts,day:ts.slice(0,10),picks:cur,dna:d,identity:{id:id.id,name:id.name},productUse:usedPick==='yes'};
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
<div className="card" style={{background:'linear-gradient(135deg,#FFF7EA,#FFE7CF)'}}><small className="muted">DID YOU KNOW? • {fact.cat}</small><p><b>{fact.title}</b></p><p className="muted">{fact.why}</p><p className="muted">Source: {fact.source}</p></div>
<div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}><div><b>Progress Album 📸</b><p className="muted" style={{margin:0}}>{function(){try{const a=JSON.parse(localStorage.getItem('album')||'[]');if(!a.length){return'Weekly photos, private to you';}const l=a.slice().sort(function(x,y){return x.day<y.day?-1:1;});const last=l[l.length-1];return'Latest: '+last.day+' • '+l.length+' '+(l.length===1?'entry':'entries');}catch(e){return'Weekly photos, private to you';}}()}</p></div><button className="btn" onClick={function(){tabGo('album');}}>Open</button></div>
{stage==='ask'&&<div className="card"><p className="muted">Question {step+1}/{Q.length}</p>
<div style={{height:8,background:'#ECE4D4',borderRadius:99}}><div style={{width:((step+1)/Q.length*100)+'%',height:'100%',background:'#0E3B2E',borderRadius:99}}/></div>
<h3>{q.t}</h3><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{q.o.map(function(o,i){return<button key={o} className="chip" onClick={function(){pick(i);}}>{q.e[i]} {o}</button>;})}</div></div>}
{stage==='product'&&<><div className="scrim"/><div className="sheet"><h3>Did you use your product today?</h3><p className="muted">One tap feeds your product-use streak.</p>
<div style={{display:'flex',gap:8}}><button className="btn" onClick={function(){confirmUsed('yes');}}>Yes ✓</button><button className="chip" onClick={function(){confirmUsed('no');}}>No</button></div></div></>}
{stage==='save'&&<><div className="scrim"/><div className="sheet"><h3>Save check-in?</h3><p className="muted">{Object.keys(cur).length} answers • product: {usedPick==='yes'?'used today':'not today'}</p>
<div style={{display:'flex',gap:8}}><button className="btn" onClick={save}>Save Check-in</button><button className="chip" onClick={function(){setStage('ask');}}>Review</button></div></div></>}
{stage==='done'&&lastSaved&&<div className="card"><h3>Live Wellness DNA — {lastSaved.identity.name}</h3><Petals dna={lastSaved.dna}/>
<p><b>{(function(){const x=identityFor(lastSaved.dna,{streak:w.current});return x.blurb;})()}</b></p>
<p className="muted">Why: {(driversOf(lastSaved.picks).slice(0,2).map(function(d){return d.label+' “'+d.choice+'”';})).join(' + ')} shaped this most.</p>
<p className="muted">{msg} • Self-reported patterns, not medical advice.</p>
<button className="btn" onClick={again}>Check in again</button></div>}
{stage==='ask'&&live&&<div className="card"><h3>Live Wellness DNA — {live.identity?live.identity.name:'—'}</h3><Petals dna={live.dna||dnaOf(live.picks)}/><p className="muted">Latest: {live.day} • updates the moment you save.</p></div>}
<div className="card" style={{display:'flex',gap:16,flexWrap:'wrap'}}><div><b>Wellness streak</b><p>{w.current}d now • best {w.best}d</p></div><div><b>Product-use streak</b><p>{p.current}d now • best {p.best}d</p></div><Ring pct={Math.min(1,w.current/7)} label={w.current+'/7'}/></div>
<div className="card"><h3>Today — {today.length} {today.length===1?'identity':'identities'}</h3>{today.map(function(e){return<div key={e.ts} style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid #ECE4D4',padding:'6px 0'}}><span>{new Date(e.ts).toLocaleTimeString()} • <b>{e.identity?e.identity.name:'Check-in'}</b>{e.productUse?' • ✓ used':''}</span><button onClick={function(){edit(e);}}>Edit</button></div>;})}</div>
<div className="card"><h3>History</h3>{[...entries].sort(function(a,b){return b.ts.localeCompare(a.ts);}).slice(0,6).map(function(e){return<div key={e.ts} className="muted">{e.day} {new Date(e.ts).toLocaleTimeString()} • {e.identity?e.identity.name:'—'}</div>;})}</div>
</div>;
}
