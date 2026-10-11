import {useState} from 'react';import {REVIEWS,SKU_INFO} from '../data/reviews.js';
export default function Discover(){
const[code,setCode]=useState('');const[hit,setHit]=useState(null);
return<div style={{display:'grid',gap:12}}>
<div className="card"><h3>Honest Check — SKU transparency</h3><p className="muted">Enter batch (try SL2411). Nutrition-label feel, not sales.</p>
<div style={{display:'flex',gap:8}}><input value={code} onChange={e=>setCode(e.target.value)} placeholder="SL2411" aria-label="SKU code"/><button className="btn" onClick={()=>setHit(SKU_INFO[code.trim()]||null)}>Verify</button></div>
{hit? <div style={{marginTop:8}}><b>{hit.product}</b><p className="muted">Ingredients: {hit.ingredients}<br/>Use: {hit.use}<br/>Duration: {hit.duration}<br/>Precautions: {hit.precautions}<br/>Auth: {hit.auth}</p></div> : code&&<p className="muted">No SAMPLE record for {code}.</p>}</div>
{REVIEWS.map(r=><div key={r.sku} className="card"><b>{r.name}</b> <span className="muted">★{r.rating} • {r.count} • SAMPLE DATA</span>
<p><b>Liked:</b> {r.liked.join(' • ')}</p><p><b>Didn't like:</b> {r.didnt.join(' • ')}</p><p className="muted">Expect: {r.expect}</p></div>)}
</div>;
}
