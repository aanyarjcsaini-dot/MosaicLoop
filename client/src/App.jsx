import {useEffect,useState} from 'react';import axios from 'axios';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
const BRANDS=[{n:'Be Bodywise',d:'Women: hair, skin, sleep'},{n:'Little Joys',d:'Kids + moms nutrition'},{n:'Man Matters',d:'Men: hair, beard, performance'},{n:'Root Labs',d:'Unisex Ayurveda'}];
const CATS=[{t:'Hair Care',s:'Fall | Growth | Dandruff'},{t:'Body Care',s:'Acne | Odour | Dry Skin'},{t:'Health & Fitness',s:'Sleep | Stress'},{t:'Sun Protection',s:'UV Shield'},{t:'Face Care',s:'Tone | Wrinkle'},{t:'Offers',s:'Limited deals'}];
const BEST=[{n:'Biotin Hair Gummies (30)',c:'Stage 1 Hair Loss',p:499,mrp:549,r:4.6},{n:'Hair Growth Serum 25ml',c:'Thinning',p:569,mrp:599,r:4.7},{n:'Hair Growth Pack (2)',c:'Stage 2 Loss',p:949,mrp:1448,r:4.6}];
const Q=[{k:'sleep',t:'Sleep?',o:['😴 Deep','🙂 Okay','🌙 Late','🥱 Rough'],v:[90,70,45,20]},{k:'mood',t:'Mood?',o:['😊 Bright','🙂 Okay','😟 Low','😣 Heavy'],v:[90,70,45,20]},{k:'energy',t:'Energy?',o:['⚡ Full','🔋 Half','🪫 Low','🛋️ Empty'],v:[90,65,35,15]},{k:'food',t:'Food?',o:['🥗 Clean','🍲 Home','🍕 Junk','⏭️ Skip'],v:[90,70,40,25]},{k:'skin',t:'Skin?',o:['✨ Glow','🙂 Okay','😟 Meh','😣 Upset'],v:[90,70,45,20]},{k:'hair',t:'Hair?',o:['💇 Strong','🙂 Okay','😟 Shed','😣 Break'],v:[90,70,45,20]},{k:'move',t:'Move?',o:['🏃 Hard','🚶 Walk','🧍 Meh','💻 Desk'],v:[90,65,35,15]},{k:'stress',t:'Stress?',o:['🍃 Calm','🙂 Fine','😮‍💨 Loaded','🤯 Fried'],v:[90,70,40,15]},{k:'water',t:'Water?',o:['💧 Lots','🥤 Some','☕ Little','🏜️ Dry'],v:[90,70,40,20]},{k:'overall',t:'Overall?',o:['🌟 Great','🙂 Okay','😕 Meh','😞 Low'],v:[90,70,45,20]}];
const dots=v=>v>=75?'●●●●○':v>=55?'●●●○○':v>=35?'●●○○○':'●○○○○';
export default function App(){
const[brand,setBrand]=useState(localStorage.getItem('brand')||'');
const[picks,setPicks]=useState(JSON.parse(localStorage.getItem('picks')||'{}'));
const[saved,setSaved]=useState(null);
useEffect(()=>{if(brand)localStorage.setItem('brand',brand);},[brand]);
if(!brand)return<div style={page}><div style={top}>Mosaic Loop</div><h1>Which Mosaic brand do you use?</h1><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{BRANDS.map(b=><button key={b.n} onClick={()=>setBrand(b.n)} style={card}><b>{b.n}</b><br/><small style={{color:'#6B7280'}}>{b.d}</small></button>)}</div></div>;
const dna=Object.keys(picks).length>=6?Object.fromEntries(Q.filter(q=>picks[q.k]!=null).map(q=>[q.k,q.v[picks[q.k]]])):null;
const save=async()=>{try{const r=await axios.post(`${API}/checkins`,{brand,picks,dna,household:'default'});setSaved(r.data);}catch{setSaved({local:true});}localStorage.setItem('picks',JSON.stringify(picks));};
return<div style={page}>
<div style={top}><b>Mosaic Loop</b><span style={{fontSize:12,color:'#6B7280'}}>Shop by concern • Build kit • Honest Reports</span><span>🔍 👤 🛒</span></div>
<div style={hero}><div><h1 style={{margin:0}}>Every body works wonders.</h1><p>We work to keep it that way — {brand} <button onClick={()=>{setBrand('');localStorage.removeItem('brand');}}>switch</button></p></div><div style={{fontSize:12}}>1/7 • wellness hero</div></div>
<h3>Shop by concern</h3><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10}}>{CATS.map(c=><div key={c.t} style={card}><b>{c.t}</b><br/><small style={{color:'#6B7280'}}>{c.s}</small></div>)}</div>
<h3>Wellness check-in — 10 quick taps</h3><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10}}>{Q.map(q=><div key={q.k} style={card}><b>{q.t}</b><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:8}}>{q.o.map((o,i)=><button key={o} onClick={()=>setPicks(p=>({...p,[q.k]:i}))} style={{...chip,borderColor:picks[q.k]===i?'#0E3B2E':'#ECE8DE',background:picks[q.k]===i?'#E7F5EC':'#fff'}}>{o}</button>)}</div></div>)}</div>
{dna&&<div style={{...card,marginTop:12}}><h3>Your Wellness DNA</h3>{Object.entries(dna).map(([k,v])=><div key={k}>{k} {dots(v)}</div>)}<p><small>Patterns only, not diagnosis.</small></p><button onClick={save} style={btn}>Save check-in</button>{saved&&<span> Saved ✓</span>}</div>}
<h3>Best sellers</h3><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10}}>{BEST.map(p=><div key={p.n} style={card}><small style={{color:'#6B7280'}}>{p.c}</small><br/><b>{p.n}</b><br/>₹{p.p} <s style={{color:'#6B7280'}}>₹{p.mrp}</s> ★{p.r}<br/><button style={btn}>ADD</button></div>)}</div>
<h3>Happy customers, honest reviews</h3><div style={card}><small>Verified buyers only. Restock moment asks review — fixes 0.2% gap.</small></div>
</div>;}
const page={background:'#fff',color:'#111',minHeight:'100vh',padding:20,fontFamily:'Plus Jakarta Sans',maxWidth:1100,margin:'0 auto'};
const top={display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #ECE8DE',paddingBottom:12};
const hero={background:'#F7F5F0',borderRadius:20,padding:24,margin:'16px 0',display:'flex',justifyContent:'space-between'};
const card={background:'#fff',border:'1px solid #ECE8DE',borderRadius:20,padding:14};
const chip={border:'1px solid #ECE8DE',borderRadius:99,padding:'8px 6px',background:'#fff',fontSize:12};
const btn={background:'#0E3B2E',color:'#fff',borderRadius:99,padding:'10px 18px',border:'none',fontWeight:800,marginTop:8};
