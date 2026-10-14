import {useMemo,useState} from 'react';import {VERIFIED,SAMPLE} from '../data/catalog.js';
function myReviews(){try{return JSON.parse(localStorage.getItem('product-reviews')||'[]');}catch(e){return[];}}
export default function Discover(){
const[q,setQ]=useState('');const[cat,setCat]=useState('All');const[brand,setBrand]=useState('All');const[detail,setDetail]=useState(null);
const[rev,setRev]=useState(myReviews());const[txt,setTxt]=useState('');const[liked,setLiked]=useState(true);
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
{rec.length>0&&<div className="card"><b>For you (skips what you own)</b><p className="muted">{rec.map(r=>r.name).join(' • ')}</p></div>}
{list.map(p=><div key={p.id} className="card"><b>{p.name}</b> <span className="muted">• {p.brand} • {p.category} • {p.verified?'VERIFIED':'DEV SAMPLE'}</span><p className="muted">{p.description} • {p.variant} • {p.price}</p>
<div style={{display:'flex',gap:8}}><button className="chip" onClick={()=>setDetail(p)}>Details</button><a href={p.url} target="_blank" rel="noreferrer">Official page ↗</a></div></div>)}
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
<br/><button className="btn" onClick={()=>setDetail(null)}>Close</button></div></>}
</div>;
}
