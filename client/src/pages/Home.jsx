import {useEffect,useMemo,useState} from 'react';import axios from 'axios';import {useApp} from '../store.js';import {Q,seedDemo,insight,streak} from '../lib/wellness.js';import Petals,{Ring} from '../components/Visuals.jsx';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
const BRANDS=[{n:'Be Bodywise',d:'Women: hair, skin, sleep'},{n:'Little Joys',d:'Kids + moms nutrition'},{n:'Man Matters',d:'Men: hair, beard, performance'},{n:'Root Labs',d:'Unisex Ayurveda'}];
export default function Home(){
const{brand,setBrand}=useApp();
const[picks,setPicks]=useState(JSON.parse(localStorage.getItem('picks')||'{}'));
const[step,setStep]=useState(0);const[done,setDone]=useState(false);
const[hist,setHist]=useState(JSON.parse(localStorage.getItem('hist')||'null')||seedDemo());
const[msg,setMsg]=useState('');
useEffect(()=>{localStorage.setItem('hist',JSON.stringify(hist));},[hist]);
useEffect(()=>{if(!localStorage.getItem('hist'))setHist(seedDemo());},[]);
const dna=useMemo(()=>{const e=Object.keys(picks).length>=6?Object.fromEntries(Q.filter(q=>picks[q.k]!=null).map(q=>[q.k,q.v[picks[q.k]]])):null;return e;},[picks]);
if(!brand)return<div><h2>Welcome 🌿</h2><p className="muted">Wellness first. Which Mosaic brand do you use?</p><div style={{display:'grid',gap:10}}>{BRANDS.map(b=><button key={b.n} className="chip" onClick={()=>setBrand(b.n)}><b>{b.n}</b><br/><span className="muted">{b.d}</span></button>)}</div></div>;
const q=Q[step];
const pick=(i)=>{const np={...picks,[q.k]:i};setPicks(np);localStorage.setItem('picks',JSON.stringify(np));
if(step<Q.length-1)setStep(step+1);else{setDone(true);const d=Object.fromEntries(Q.map(qq=>[qq.k,qq.v[np[qq.k]??1]]));
const today=new Date().toISOString().slice(0,10);setHist(h=>{const f=h.filter(x=>x.date!==today||!x.self);return[...f,{...d,date:today,self:true}];});
axios.post(`${API}/checkins`,{brand,picks:np,dna:d,household:'default'}).then(()=>setMsg('Saved ✓')).catch(()=>setMsg('Saved locally ✓'));}};
const s=streak(hist);const pct=Math.min(1,s/30);
return<div style={{display:'grid',gap:12}}>
<div className="card"><b>{brand}</b> <button onClick={()=>setBrand('')} aria-label="Change brand">switch</button>
<h2 style={{fontFamily:'Fraunces, serif',margin:'8px 0'}}>Hey, how are you today?</h2>
{!done?<><p className="muted">Question {step+1}/{Q.length} • under 60 seconds</p><div style={{height:8,background:'#ECE4D4',borderRadius:99}}><div style={{width:`${(step+1)/Q.length*100}%`,height:'100%',background:'#0E3B2E',borderRadius:99,transition:'width .3s'}}/></div>
<h3>{q.t}</h3><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{q.o.map((o,i)=><button key={o} className="chip" onClick={()=>pick(i)}>{o}</button>)}</div>
<div style={{display:'flex',gap:8,marginTop:8}}><button disabled={step===0} onClick={()=>setStep(step-1)}>Back</button><button onClick={()=>setDone(true)}>Skip to DNA</button></div></>
:<><p className="muted">Today complete. {msg}</p><button className="btn" onClick={()=>{setDone(false);setStep(0);}}>Reflect again</button></>}</div>
{dna&&<div className="card"><h3>Your Wellness DNA</h3><Petals dna={dna}/><p><b>{insight(dna,hist)}</b></p><p className="muted">Self-reported patterns, not medical advice.</p></div>}
<div className="card" style={{display:'flex',gap:14,alignItems:'center'}}><Ring pct={pct} label={`${s}/30`}/><div><b>{s}-day streak</b><p className="muted">30 days → trial from another Mosaic brand. Consistency, not spending.</p></div></div>
<div className="card"><b>On your shelf</b><p className="muted">3 demo products • 1 finishing in 6 days. Full shelf next phase.</p><button onClick={()=>{localStorage.removeItem('hist');setHist(seedDemo());}}>Reset demo</button></div>
</div>;
}
