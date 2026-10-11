import {useMemo,useState} from 'react';import {VERIFIED,SAMPLE} from '../data/catalog.js';
export default function Discover(){
const[q,setQ]=useState('');const[cat,setCat]=useState('All');const[detail,setDetail]=useState(null);
let shelf=[];try{shelf=JSON.parse(localStorage.getItem('shelf2')||'[]');}catch{shelf=[];}
const have=new Set(shelf.map(s=>s.pid));
const cats=['All',...new Set([...VERIFIED,...SAMPLE].map(p=>p.category))];
const list=[...VERIFIED.map(v=>({...v,verified:true})),...SAMPLE.map(s=>({...s,verified:false}))].filter(p=>(cat==='All'||p.category===cat)&&(p.name+p.description).toLowerCase().includes(q.toLowerCase()));
const rec=list.filter(p=>!have.has(p.id)).slice(0,2);
return<div style={{display:'grid',gap:12}}>
<div className="card"><h3>Discover</h3><p className="muted">Verified catalogue: {VERIFIED.length} connected. Samples labeled DEV SAMPLE — never confuse with verified.</p>
<div style={{display:'flex',gap:8,flexWrap:'wrap'}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" aria-label="Search products"/>{cats.map(c=><button key={c} className={'chip'+(cat===c?' sel':'')} onClick={()=>setCat(c)}>{c}</button>)}</div></div>
{rec.length>0&&<div className="card"><b>For you (skips what you own)</b><p className="muted">{rec.map(r=>r.name).join(' • ')}</p></div>}
{list.map(p=><div key={p.id} className="card"><b>{p.name}</b> <span className="muted">• {p.category} • {p.verified?'VERIFIED':'DEV SAMPLE'}</span><p className="muted">{p.description} • {p.variant} • {p.price}</p>
<div style={{display:'flex',gap:8}}><button className="chip" onClick={()=>setDetail(p)}>Details</button><a href={p.url} target="_blank" rel="noreferrer">Official page ↗</a></div></div>)}
{detail&&<><div className="scrim" onClick={()=>setDetail(null)}/><div className="sheet"><h3>{detail.name}</h3><p className="muted">{detail.verified?'Verified record':'DEV SAMPLE record'}</p><p>{detail.description}</p><p className="muted">Variant: {detail.variant} • Price: {detail.price}</p><a href={detail.url} target="_blank" rel="noreferrer">Buy on official site ↗ (app never charges)</a><br/><button className="btn" onClick={()=>setDetail(null)}>Close</button></div></>}
</div>;
}
