import {Star} from 'lucide-react';import {useApp} from '../store.js';
function all(){let r=[],f=[];try{r=JSON.parse(localStorage.getItem('product-reviews')||'[]');}catch(e){r=[];}try{f=JSON.parse(localStorage.getItem('feedback')||'[]');}catch(e){f=[];}return{r:r,f:f};}
export default function Reviews(){
const{setTab}=useApp();const d=all();
return<div style={{display:'grid',gap:20}}>
<div><h1 className="pagehead">Honest Reviews</h1><p className="muted">Real people, real reviews. Written by verified owners only — never invented.</p></div>
<div className="card" style={{background:'#DCCEFF'}}><b><Star size={16}/> Your reviews ({d.r.length})</b>
{d.r.length?d.r.map(function(x){return<p key={x.id} className="muted">• {x.liked?'👍':'💬'} <b>{x.pid}</b> — {x.comment} <span className="cap">({x.ts.slice(0,10)})</span></p>;}):<p className="muted">None yet — own a product to review it in Discover.</p>}</div>
<div className="card"><b>Restock feedback ({d.f.length})</b>
{d.f.length?d.f.slice(-8).map(function(x){return<p key={x.id} className="muted">• <b>{x.pid}</b> [{x.mode}] {(x.reasons||[]).join(', ')}{x.comment?' — “'+x.comment+'”':''}</p>;}):<p className="muted">No feedback yet — it appears after restock decisions in Shelf.</p>}</div>
<button className="btn" onClick={function(){setTab('discover');}}>Browse products to review</button>
</div>;
}
