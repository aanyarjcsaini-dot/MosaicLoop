import {useEffect,useState} from 'react';import axios from 'axios';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
const BRANDS=[{n:'Be Bodywise',d:'women: hair, skin, sleep'},{n:'Little Joys',d:'kids + moms nutrition'},{n:'Man Matters',d:'men: hair, beard, performance'},{n:'Root Labs',d:'unisex Ayurveda'}];
const Q=[{k:'sleep',t:'Sleep?',o:['😴 Deep','🙂 Okay','🌙 Late','🥱 Rough'],v:[90,70,45,20]},{k:'mood',t:'Mood?',o:['😊 Bright','🙂 Okay','😟 Low','😣 Heavy'],v:[90,70,45,20]},{k:'energy',t:'Energy?',o:['⚡ Full','🔋 Half','🪫 Low','🛋️ Empty'],v:[90,65,35,15]},{k:'food',t:'Food?',o:['🥗 Clean','🍲 Home','🍕 Junk','⏭️ Skip'],v:[90,70,40,25]},{k:'skin',t:'Skin?',o:['✨ Glow','🙂 Okay','😟 Meh','😣 Upset'],v:[90,70,45,20]},{k:'hair',t:'Hair?',o:['💇 Strong','🙂 Okay','😟 Shed','😣 Break'],v:[90,70,45,20]},{k:'move',t:'Move?',o:['🏃 Hard','🚶 Walk','🧍 Meh','💻 Desk'],v:[90,65,35,15]},{k:'stress',t:'Stress?',o:['🍃 Calm','🙂 Fine','😮‍💨 Loaded','🤯 Fried'],v:[90,70,40,15]},{k:'water',t:'Hydration?',o:['💧 Lots','🥤 Some','☕ Little','🏜️ Dry'],v:[90,70,40,20]},{k:'overall',t:'Overall?',o:['🌟 Great','🙂 Okay','😕 Meh','😞 Low'],v:[90,70,45,20]}];
const dots=v=>v>=75?'●●●●○':v>=55?'●●●○○':v>=35?'●●○○○':'●○○○○';
export default function App(){
const[brand,setBrand]=useState(localStorage.getItem('brand')||'');
const[picks,setPicks]=useState(JSON.parse(localStorage.getItem('picks')||'{}'));
const[saved,setSaved]=useState(null);
useEffect(()=>{if(brand)localStorage.setItem('brand',brand);},[brand]);
if(!brand)return<div style={s}><h1>Which Mosaic brand do you use?</h1><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>{BRANDS.map(b=><button key={b.n} onClick={()=>setBrand(b.n)} style={c}><b>{b.n}</b><br/><small>{b.d}</small></button>)}</div></div>;
const dna=Object.keys(picks).length>=6?Object.fromEntries(Q.filter(q=>picks[q.k]!=null).map(q=>[q.k,q.v[picks[q.k]]])):null;
const save=async()=>{const body={brand,picks,dna,household:'default'};try{const r=await axios.post(`${API}/checkins`,body);setSaved(r.data);}catch{setSaved({local:true});}localStorage.setItem('picks',JSON.stringify(picks));};
return<div style={s}><p><b>{brand}</b> <button onClick={()=>{setBrand('');localStorage.removeItem('brand');}}>switch</button></p>
<h1>Hey, how are you today?</h1><p>10 quick taps, no medical scores.</p>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10}}>{Q.map(q=><div key={q.k} style={c}><b>{q.t}</b><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:8}}>{q.o.map((o,i)=><button key={o} onClick={()=>setPicks(p=>({...p,[q.k]:i}))} style={{...c,borderColor:picks[q.k]===i?'#5CFFB1':'#244034'}}>{o}</button>)}</div></div>)}</div>
{dna&&<div style={{...c,marginTop:12}}><h3>Your Wellness DNA</h3>{Object.entries(dna).map(([k,v])=><div key={k}>{k} {dots(v)} {v}</div>)}<p><small>Patterns only, not diagnosis. Energy improving with sleep = progress.</small></p><button onClick={save} style={b}>Save check-in → calendar next</button>{saved&&<p>Saved ✓</p>}</div>}</div>;
}
const s={background:'#08120E',color:'#EAF5EE',minHeight:'100vh',padding:24,fontFamily:'Plus Jakarta Sans'};
const c={background:'#0F1F18',border:'1px solid #244034',color:'#EAF5EE',borderRadius:18,padding:12};
const b={background:'#5CFFB1',color:'#08120E',fontWeight:800,borderRadius:99,padding:'10px 18px',border:'none',marginTop:8};
