import {useState} from 'react';import {Star} from 'lucide-react';import {useApp} from '../store.js';
function all(){let r=[],f=[];try{r=JSON.parse(localStorage.getItem('product-reviews')||'[]');}catch(e){r=[];}try{f=JSON.parse(localStorage.getItem('feedback')||'[]');}catch(e){f=[];}return{r:r,f:f};}
const SAMPLES=[
{pid:'bb-biotin-30',stars:5,text:'Shedding visibly less by month three. Tasty enough to keep up.',by:'SAMPLE reviewer A'},
{pid:'bb-biotin-30',stars:4,text:'Good routine product, but needs patience — nothing in month one.',by:'SAMPLE reviewer B'},
{pid:'bb-rollon',stars:5,text:'Odour gone within two weeks of daily use.',by:'SAMPLE reviewer C'},
{pid:'bb-rollon',stars:3,text:'Works, though the ball sticks a little near the end.',by:'SAMPLE reviewer D'},
{pid:'bb-sleep',stars:4,text:'Evenings feel calmer; pairing it with a fixed bedtime helped.',by:'SAMPLE reviewer E'},
{pid:'mm-minox',stars:4,text:'Early shedding phase was scary, then baby hairs by month four.',by:'SAMPLE reviewer F'},
{pid:'mm-perf',stars:3,text:'Subtle change in stamina after a month. Pricey for what it is.',by:'SAMPLE reviewer G'},
{pid:'lj-dha',stars:5,text:'My kid actually asks for them. Milk battles are over.',by:'SAMPLE reviewer H'},
{pid:'lj-nutri',stars:4,text:'Mixes well and tastes mild. Wish the pack were bigger.',by:'SAMPLE reviewer I'},
{pid:'rl-shil',stars:4,text:'Noticeable morning energy after two weeks of consistent use.',by:'SAMPLE reviewer J'},
{pid:'rl-mag',stars:5,text:'Sleep feels deeper; no grogginess in the morning.',by:'SAMPLE reviewer K'},
{pid:'bb-sleep',stars:3,text:'Mild effect for me — works best with no screens before bed.',by:'SAMPLE reviewer L'}];
export default function Reviews(){
const{setTab}=useApp();const d=all();const[q,setQ]=useState('');
const ql=q.trim().toLowerCase();
const shown=SAMPLES.filter(function(s){return !ql||s.pid.toLowerCase().indexOf(ql)>=0||s.text.toLowerCase().indexOf(ql)>=0;});
return<div style={{display:'grid',gap:20}}>
<div><h1 className="pagehead">Honest Reviews</h1><p className="muted">How the feature works, shown with clearly labelled sample entries. Yours appear only after you write them.</p></div>
<div className="card"><b>Search reviews</b><div style={{display:'flex',gap:8,marginTop:8}}><input value={q} onChange={function(e){setQ(e.target.value);}} placeholder="Product name or id…" aria-label="Search reviews"/></div></div>
<div className="card" style={{background:'#E6E0FF'}}><b><Star size={16}/> Sample reviews ({shown.length}) — SAMPLE DATA, not real testimonials</b>
{shown.length?shown.map(function(s,i){return<p key={i} className="muted">• {'★'.repeat(s.stars)}☆ <b>{s.pid}</b> — {s.text} <span className="cap">({s.by})</span></p>;}):<p className="muted">No samples match “{q.trim()}”. Try another product.</p>}</div>
<div className="card"><b><Star size={16}/> Your reviews ({d.r.length})</b>
{d.r.length?d.r.map(function(x){return<p key={x.id} className="muted">• {x.liked?'👍':'💬'} <b>{x.pid}</b> — {x.comment} <span className="cap">({x.ts.slice(0,10)})</span></p>;}):<p className="muted">None yet — own a product to review it in Discover.</p>}</div>
<div className="card"><b>Restock feedback ({d.f.length})</b>
{d.f.length?d.f.slice(-8).map(function(x){return<p key={x.id} className="muted">• <b>{x.pid}</b> [{x.mode}] {(x.reasons||[]).join(', ')}{x.comment?' — “'+x.comment+'”':''}</p>;}):<p className="muted">No feedback yet — it appears after restock decisions in Shelf.</p>}</div>
<button className="btn" onClick={function(){setTab('discover');}}>Browse products to review</button>
</div>;
}
