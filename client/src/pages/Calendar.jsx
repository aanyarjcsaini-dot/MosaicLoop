import {useState} from 'react';import {logs} from '../lib/shelf.js';import {IDENTITIES} from '../lib/wellness.js';import IdentityPopup from '../components/IdentityPopup.jsx';
export default function Calendar(){
const[cur,setCur]=useState(()=>{const d=new Date();d.setDate(1);return d;});
const[day,setDay]=useState(null);const[pop,setPop]=useState(null);
function fullId(e){const f=IDENTITIES.filter(function(x){return e.identity&&x.id===e.identity.id;})[0];return f||{id:'info',name:(e.identity&&e.identity.name)||'Check-in',icon:'💠',color:'#554B60',blurb:'Your recorded reflection.'};}
const y=cur.getFullYear(),m=cur.getMonth();
const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
const L=logs();let entries=[];try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch{entries=[];}
const byDay={};entries.forEach(e=>{byDay[e.day]=byDay[e.day]||[];byDay[e.day].push(e);});
const kFor=d=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
return<div style={{display:'grid',gap:12}}>
<div className="card"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><button onClick={()=>setCur(new Date(y,m-1,1))}>‹</button><b>{cur.toLocaleString('default',{month:'long',year:'numeric'})}</b><button onClick={()=>setCur(new Date(y,m+1,1))}>›</button></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6,marginTop:10}}>{['S','M','T','W','T','F','S'].map(d=><div key={d} className="muted" style={{textAlign:'center'}}>{d}</div>)}
{Array.from({length:first}).map((_,i)=><div key={'e'+i}/>)}
{Array.from({length:days}).map((_,di)=>{const d=di+1;const k=kFor(d);const shop=L[k]||[];const ids=(byDay[k]||[]).map(e=>e.identity?.name).filter(Boolean);const ev=[...shop,...ids];const today=k===new Date().toISOString().slice(0,10);
return<button key={k} className="chip" style={{minHeight:64,borderColor:today?'#6F9676':'',background:ev.length?'#E9E1F5':'#FFFCF6'}} onClick={()=>setDay(k)}><b>{d}</b><br/><small>{ids.slice(0,2).join(' • ')||ev.slice(0,2).map(e=>e.includes('bought')?'🛍️':'💭').join(' ')}</small></button>;})}</div></div>
{day&&<><div className="scrim" onClick={()=>setDay(null)}/><div className="sheet"><h3>{day}</h3>
{((byDay[day])||[]).map(e=>{const fi=fullId(e);return<p key={e.ts}>• {new Date(e.ts).toLocaleTimeString()} — <button style={{color:fi.color,background:'none',border:'none',fontWeight:800}} onClick={()=>setPop({ident:fi,picks:e.picks})}>{fi.icon} {fi.name}</button>{e.productUse?' • ✓ used':''}</p>;})}
{((L[day])||[]).map(e=><p key={e}>• {e}</p>)}
<button className="btn" onClick={()=>setDay(null)}>Close</button></div></>}
{pop&&<IdentityPopup ident={pop.ident} entries={entries} picks={pop.picks} onClose={function(){setPop(null);}}/>}
</div>;
}
