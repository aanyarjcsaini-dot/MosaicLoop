import {useEffect,useMemo,useState} from 'react';import {VERIFIED,SAMPLE} from '../data/catalog.js';import ProductArt from '../components/ProductArt.jsx';import Finder from '../components/Finder.jsx';
function myReviews(){try{return JSON.parse(localStorage.getItem('product-reviews')||'[]');}catch(e){return[];}}
function TrustBlock(props){
const pid=props.pid;const[info,setInfo]=useState(null);const[tried,setTried]=useState(false);
useEffect(function(){let on=true;fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/products').then(function(r){return r.json();}).then(function(all){if(!on){return;}const hit=all.filter(function(p){return p.sku===pid||p.name===pid;})[0]||null;setInfo(hit);setTried(true);}).catch(function(){if(on){setTried(true);}});return function(){on=false;};},[pid]);
let mine=[];try{mine=JSON.parse(localStorage.getItem('product-reviews')||'[]').filter(function(x){return x.pid===pid;});}catch(e){mine=[];}
return<div style={{marginTop:8,borderTop:'1px solid #EBD9F5',paddingTop:8}}><b>Before you buy</b>
{!tried&&<p className="muted">Loading product facts…</p>}
{tried&&!info&&<p className="muted">No verified fact sheet for this product yet. Check the official product page.</p>}
{tried&&info&&<div><p>Key ingredients: {info.keyIngredients?info.keyIngredients.map(function(k){return k.name;}).join(', '):'Check the official product page.'}</p>
{info.keyIngredients&&<details><summary>Ingredients, explained</summary>{info.keyIngredients.map(function(k){return<p key={k.name} className="muted"><b>{k.name}:</b> {k.does}<br/>{k.caution} General information, not medical advice.</p>;})}</details>}
<p className="muted">Patch-test note: try a small area first, especially for sensitive skin. General information, not medical advice.</p>
<p className="muted">Typical window: {info.typicalResultWindowWeeks?('week '+info.typicalResultWindowWeeks.min+' to '+info.typicalResultWindowWeeks.max+' ('+info.typicalResultWindowWeeks.source+'), varies by person'):('No typical window available for this product.')}</p>
<p className="muted">Owner reviews in this app: {mine.length}{mine.length===0?' (zero so far — counts only, no sample average shown)':''}.</p></div>}
<button className="chip" onClick={props.onFinder}>Is this right for me?</button></div>;
}
export default function Discover(){
const[q,setQ]=useState('');const[cat,setCat]=useState('All');const[brand,setBrand]=useState('All');const[detail,setDetail]=useState(null);
const[rev,setRev]=useState(myReviews());const[txt,setTxt]=useState('');const[liked,setLiked]=useState(true);
const[sku,setSku]=useState('');const[skuHit,setSkuHit]=useState(null);const[skuTried,setSkuTried]=useState(false);
const[find,setFind]=useState(false);
const checkSku=function(){const v=sku.trim().toUpperCase();setSkuTried(true);
const hit=[...VERIFIED,...SAMPLE].filter(function(p){return(p.sku||'').toUpperCase()===v||p.id.toUpperCase()===v;})[0]||null;setSkuHit(hit);};
useEffect(function(){try{const pre=localStorage.getItem('sku-prefill');if(pre){localStorage.removeItem('sku-prefill');setSku(pre);setTimeout(function(){const v=pre.trim().toUpperCase();setSkuTried(true);const hit=[...VERIFIED,...SAMPLE].filter(function(p){return(p.sku||'').toUpperCase()===v||p.id.toUpperCase()===v;})[0]||null;setSkuHit(hit);},50);}}catch(e){}},[]);
let shelf=[];try{shelf=JSON.parse(localStorage.getItem('shelf2')||'[]');}catch{shelf=[];}
const have=new Set(shelf.map(s=>s.pid));
const cats=['All',...new Set([...VERIFIED,...SAMPLE].map(p=>p.category))];
const brands=['All',...new Set([...VERIFIED,...SAMPLE].map(p=>p.brand))];
const list=[...VERIFIED.map(v=>({...v,verified:true})),...SAMPLE.map(s=>({...s,verified:false}))].filter(p=>(cat==='All'||p.category===cat)&&(brand==='All'||p.brand===brand)&&(p.name+p.description).toLowerCase().includes(q.toLowerCase()));
const rec=list.filter(p=>!have.has(p.id)).slice(0,2);
return<div style={{display:'grid',gap:12}}>
<div className="card"><h3>Discover</h3><p className="muted">Verified catalogue: {VERIFIED.length} connected. Samples labeled DEV SAMPLE — never confuse with verified.</p>
<div style={{display:'flex',gap:8,flexWrap:'wrap'}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" aria-label="Search products"/>{cats.map(c=><button key={c} className={'chip'+(cat===c?' sel':'')} onClick={()=>setCat(c)}>{c}</button>)}</div>
<div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}}>{brands.map(b=><button key={b} className={'chip'+(brand===b?' sel':'')} onClick={()=>setBrand(b)}>{b}</button>)}</div></div>
<div className="card" style={{background:'linear-gradient(135deg,#E6E0FF,#EFFBDB)'}}><h3>Find your product match</h3><p className="muted">3 quick questions, honest matches only — never a sales push.</p><button className="btn" onClick={function(){setFind(true);}}>Start Product Finder</button></div>
{find&&<><div className="scrim" onClick={function(){setFind(false);}}/><div className="sheet"><Finder onClose={function(){setFind(false);}}/></div></>}
<div className="card"><h3>SKU Checker</h3><p className="muted">Enter a product SKU to verify it against the local catalogue. Live database lookup needs an official feed (documented, not simulated).</p>
<div style={{display:'flex',gap:8}}><input value={sku} onChange={e=>setSku(e.target.value)} placeholder="e.g. BB-BIO-30" aria-label="SKU number"/><button className="btn" onClick={checkSku}>Check SKU</button></div>
{skuTried&&(skuHit?<div style={{display:'flex',gap:12,alignItems:'center',marginTop:8}}><ProductArt kind={skuHit.art} c={skuHit.artc}/><div><b>{skuHit.name}</b><br/><span className="muted">{skuHit.brand} • {skuHit.variant} • {skuHit.price}</span><br/><a href={skuHit.url} target="_blank" rel="noreferrer">Official page ↗</a></div></div>:<p className="muted">No match for “{sku.trim()}” in the local catalogue.</p>)}</div>
{rec.length>0&&<div className="card"><b>For you (skips what you own)</b><p className="muted">{rec.map(r=>r.name).join(' • ')}</p></div>}
{list.map(p=><div key={p.id} className="card" style={{display:'flex',gap:12,alignItems:'center'}}><ProductArt kind={p.art} c={p.artc}/><div style={{flex:1}}><b>{p.name}</b> <span className="muted">• {p.brand} • {p.category} • {p.verified?'VERIFIED':'DEV SAMPLE'}</span><p className="muted">{p.description} • {p.variant} • {p.price}</p>
<div style={{display:'flex',gap:8}}><button className="chip" onClick={()=>setDetail(p)}>Details</button><a href={p.url} target="_blank" rel="noreferrer">Official page ↗</a></div></div></div>)}
{detail&&<><div className="scrim" onClick={()=>setDetail(null)}/><div className="sheet"><h3>{detail.name}</h3><p className="muted">{detail.verified?'Verified record':'DEV SAMPLE record'}</p><p>{detail.description}</p><p className="muted">Variant: {detail.variant} • Price: {detail.price}</p><a href={detail.url} target="_blank" rel="noreferrer">Buy on official site ↗ (app never charges)</a>
<div style={{marginTop:8,borderTop:'1px solid #EBD9F5',paddingTop:8}}><b>Honest review {have.has(detail.id)?'(verified — you own this)':'(own it to review)'}</b>
<div style={{display:'flex',gap:6,margin:'6px 0'}}><button className={'chip'+(liked?' sel':'')} onClick={()=>setLiked(true)}>I liked it</button><button className={'chip'+(!liked?' sel':'')} onClick={()=>setLiked(false)}>Could be better</button></div>
<textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="What stood out?" aria-label="Review text" style={{width:'100%'}}/>
<button className="btn" disabled={!have.has(detail.id)||!txt.trim()} onClick={()=>{
const r={id:'r'+Date.now(),pid:detail.id,liked:liked,comment:txt.trim(),ts:new Date().toISOString()};
const all=[r,...rev];setRev(all);localStorage.setItem('product-reviews',JSON.stringify(all));setTxt('');
try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/reviews/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pid:detail.id,mode:'review',reasons:[liked?'liked':'criticism'],comment:r.comment,ts:r.ts})}).catch(()=>{});}catch(e){}
}}>Submit verified review</button>
{rev.filter(function(x){return x.pid===detail.id;}).map(function(x){return<p key={x.id} className="muted">• {x.liked?'👍':'💬'} {x.comment}</p>;})}</div>
<TrustBlock pid={detail.id} onFinder={function(){setDetail(null);setFind(true);}} />
<br/><button className="btn" onClick={()=>setDetail(null)}>Close</button></div></>}
</div>;
}
