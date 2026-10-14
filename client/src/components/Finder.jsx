import {useEffect,useState} from 'react';import {SKIN_TAP,HAIR_TAP,SKINS,matchTaps} from '../data/finder.js';import {useApp} from '../store.js';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export default function Finder(props){
const onClose=props.onClose;const{setBuddy}=useApp();
const[step,setStep]=useState(0);const[sel,setSel]=useState({});
const[products,setProducts]=useState(null);const[err,setErr]=useState('');
useEffect(function(){fetch(API+'/products').then(function(r){return r.json();}).then(setProducts).catch(function(){setErr('Could not load the product list. Try the official site directly.');});},[]);
if(err){return<div className="card"><p>{err}</p><button className="chip" onClick={onClose}>Close</button></div>;}
if(!products){return<div className="card"><p className="muted">Loading products…</p></div>;}
const qs=[{k:'skin',t:SKIN_TAP.t,opts:SKIN_TAP.opts},{k:'hair',t:HAIR_TAP.t,opts:HAIR_TAP.opts},{k:'skinType',t:'And your skin type?',opts:SKINS}];
if(step<3){const q=qs[step];
return<div><p className="muted">Tap-in {step+1}/3 — {q.t}</p>
<div style={{display:'grid',gap:8}}>{q.opts.map(function(o){return<button key={o.id} className="chip" style={{textAlign:'left'}} onClick={function(){const n=Object.assign({},sel);n[q.k]=o.id;setSel(n);setStep(step+1);}}>{o.label}</button>;})}</div>
<div style={{display:'flex',gap:8,marginTop:8}}>{step>0&&<button className="chip" onClick={function(){setStep(step-1);}}>Back</button>}<button className="chip" onClick={onClose}>Close</button></div></div>;}
const allGood=sel.skin==='clear'&&sel.hair==='healthy';
const hits=allGood?[]:matchTaps(sel.skin,sel.hair,sel.skinType,products);
const addShelf=function(pid){try{const sh=JSON.parse(localStorage.getItem('shelf2')||'[]');
if(!sh.some(function(x){return x.pid===pid;})){sh.push({id:'s'+Date.now(),pid:pid,startDate:new Date().toISOString().slice(0,10),perDayOverride:null,expectedOverride:null,confirmations:[],snoozeUntil:null,lastPrompt:null,muted:false,status:'open',interested:true});localStorage.setItem('shelf2',JSON.stringify(sh));localStorage.setItem('shelf',JSON.stringify(sh));}}catch(e){}};
const askAi=function(){try{localStorage.setItem('ai-context',JSON.stringify({concern:'skin:'+sel.skin+', hair:'+sel.hair,skin:sel.skinType,from:'finder'}));}catch(e){}onClose();setBuddy(true);};
return<div>
<h3>{allGood?'Looking good':'Best matches for you'}</h3>
{allGood&&<div className="card"><p>Clear skin and healthy hair — nothing to fix here.</p><p className="muted">Keep the routine that got you here. Browse the catalogue if you are just curious.</p><a className="btn" href="https://bebodywise.com/shop/all" target="_blank" rel="noreferrer">View on official site</a></div>}
{!allGood&&hits.length===0&&<div className="card"><p>No strong match in the current list for these notes.</p><p className="muted">That is an honest answer — a wider catalogue lives on the official site.</p><a className="btn" href="https://bebodywise.com/shop/all" target="_blank" rel="noreferrer">View on official site</a></div>}
{hits.map(function(h){const p=h.p;return<div key={p.sku} className="card" style={{marginTop:8}}><b>{p.name}</b> <span className="muted">• {p.brand}</span>
<p className="muted">Meant for: {(p.concerns||[]).join(', ')||'—'}</p>
<p className="muted">Why this matched: {h.why}</p>
<p>How to use: {p.howToUse||'Check the official product page.'}</p>
<p className="muted">Typical window: {p.typicalResultWindowWeeks?('week '+p.typicalResultWindowWeeks.min+' to '+p.typicalResultWindowWeeks.max+' ('+p.typicalResultWindowWeeks.source+'), varies by person'):('No typical window available for this product.')}</p>
<p className="muted">Key ingredients: {p.keyIngredients?p.keyIngredients.map(function(k){return k.name;}).join(', '):'Check the official product page.'}</p>
{p.keyIngredients&&<details><summary>Ingredients, explained</summary>{p.keyIngredients.map(function(k){return<p key={k.name} className="muted"><b>{k.name}:</b> {k.does}<br/>{k.caution} General information, not medical advice.</p>;})}</details>}
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><a className="btn" href={p.sourceUrl} target="_blank" rel="noreferrer">View on official site</a><button className="chip" onClick={function(){addShelf(p.sku);}}>Add to my Shelf</button></div></div>;})}
<div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}><button className="chip" onClick={function(){setStep(0);setSel({});}}>Start over</button><button className="chip" onClick={askAi}>Not sure? Ask AI Friend</button><button className="chip" onClick={onClose}>Close</button></div>
</div>;
}
