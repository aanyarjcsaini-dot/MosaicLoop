import {useState} from 'react';import {PRODUCTS,RESTOCK_WHY_OUT,PASS_WHY} from '../data/products.js';import {shelf,saveShelf,finishInfo,logDay} from '../lib/shelf.js';import {Ring} from '../components/Visuals.jsx';
export default function Shelf(){
const[s,setS]=useState(shelf());const[ask,setAsk]=useState(null);const[ins,setIns]=useState(JSON.parse(localStorage.getItem('restock-ins')||'[]'));
const use1=i=>{const n=[...s];const p=PRODUCTS.find(x=>x.id===n[i].pid);n[i].used=Math.min(p.pack,n[i].used+p.perDay);saveShelf(n);setS(n);};
const decide=(i,path,why)=>{const n=[...s];const ni={...ins,items:[...(ins.items||[]),{pid:n[i].pid,path,why,t:new Date().toISOString()}]};setIns(ni);localStorage.setItem('restock-ins',JSON.stringify(ni));
if(path==='restock'){n[i].used=0;}saveShelf(n);setS(n);setAsk(null);logDay(new Date().toISOString().slice(0,10),`${path}: ${PRODUCTS.find(x=>x.id===n[i].pid).name} (${why})`);};
return<div style={{display:'grid',gap:12}}>
{s.map((it,i)=>{const p=PRODUCTS.find(x=>x.id===it.pid);const f=finishInfo({...p,...it});const pct=1-(p.pack-(p.pack-it.used))/p.pack;const left=p.pack-it.used;
return<div key={i} className="card"><div style={{display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:34}}>{p.img}</div><div><b>{p.name}</b><br/><span className="muted">{p.brand} • {left} {p.unit} left • ends {f.finish}</span></div><div style={{marginLeft:'auto'}}><Ring pct={Math.max(0,left/p.pack)} label={`${f.daysLeft}d`}/></div></div>
<div style={{display:'flex',gap:8,marginTop:8}}><button className="chip" onClick={()=>use1(i)}>+1 day</button><button className="btn" onClick={()=>setAsk(i)}>Ready to restock?</button></div>
{f.daysLeft<=7&&<p className="muted">Gentle nudge: finishing soon. No BUY NOW spam.</p>}
{ask===i&&<><div className="scrim" onClick={()=>setAsk(null)}/><div className="sheet"><h3>Ready to restock?</h3><p className="muted">{p.name} • {p.use}</p><div style={{display:'flex',gap:8}}><button className="btn" onClick={()=>setAsk('r'+i)}>RESTOCK</button><button className="chip" onClick={()=>setAsk('p'+i)}>PASS THIS TIME</button></div>
{String(ask).startsWith('r')&&<div><p>What made you come back?</p><div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{RESTOCK_WHY_OUT.map(w=><button key={w} className="chip" onClick={()=>decide(i,'restock',w)}>{w}</button>)}</div></div>}
{String(ask).startsWith('p')&&<div><p>Why passing?</p><div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{PASS_WHY.map(w=><button key={w} className="chip" onClick={()=>decide(i,'pass',w)}>{w}</button>)}</div></div>}
</div></>}</div>;})}
<div className="card"><b>Restock insights (stored)</b>{(ins.items||[]).slice(-4).map((x,i)=><p key={i} className="muted">• {x.pid} → {x.path}: {x.why}</p>)||<p className="muted">None yet.</p>}</div>
<p className="muted">Sample product facts — verify against official info.</p>
</div>;
}
