import {useState} from 'react';
export default function Feedback({mode,pid,onDone}){
const OPTS=mode==='restock'
?['Easy to use','Fits my routine','Like texture/feel','Convenient packaging','Good overall','Noticed a benefit','Other']
:['Not the results I expected','Doesn’t fit routine','Texture/fragrance/application','Packaging/usability','Price/value','I still have enough','Try something different','Other'];
const[sel,setSel]=useState([]);const[txt,setTxt]=useState('');
const toggle=o=>setSel(s=>s.includes(o)?s.filter(x=>x!==o):[...s,o]);
const done=()=>{const fb={id:'fb'+Date.now(),pid,mode,reasons:sel,comment:txt,ts:new Date().toISOString()};
const all=JSON.parse(localStorage.getItem('feedback')||'[]');
if(!all.some(f=>f.pid===pid&&f.mode===mode&&JSON.stringify(f.reasons)===JSON.stringify(sel)&&f.comment===txt))all.push(fb);
localStorage.setItem('feedback',JSON.stringify(all));
try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/reviews/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fb)}).catch(()=>{});}catch{}
onDone(fb);};
return<div><h3>{mode==='restock'?'What are you loving about this product?':'What could be better about your experience?'}</h3>
<p className="muted">Optional — skip anytime. Passing is not dissatisfaction.</p>
<div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{OPTS.map(o=><button key={o} className={'chip'+(sel.includes(o)?' sel':'')} onClick={()=>toggle(o)}>{o}</button>)}</div>
<textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Optional detail…" aria-label="Optional feedback" style={{width:'100%',marginTop:8}}/>
<div style={{display:'flex',gap:8,marginTop:8}}><button className="btn" onClick={done}>Continue</button><button className="chip" onClick={()=>onDone(null)}>Skip</button></div></div>;
}
