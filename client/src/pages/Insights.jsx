import {useState} from 'react';import {Flame,Droplets} from 'lucide-react';import {dnaOf,identityFor,describeIdentity,patternBullets,weekDist,qualifyingWellness,streakDays,IDENTITIES} from '../lib/wellness.js';import {productUseDays} from '../lib/shelf.js';import Petals,{Ring} from '../components/Visuals.jsx';import IdentityPopup from '../components/IdentityPopup.jsx';
function readEntries(){try{return JSON.parse(localStorage.getItem('entries')||'[]');}catch(e){return[];}}
const LBL={sleep:'Sleep',energy:'Energy',mood:'Mood',stress:'Stress',food:'Food',skin:'Skin'};
export default function Insights(){
const[entries]=useState(readEntries);const[pop,setPop]=useState(null);
const sorted=[...entries].sort(function(a,b){return a.ts<b.ts?-1:1;});
const live=sorted[sorted.length-1]||null;
const wDays=[...new Set(entries.filter(qualifyingWellness).map(function(e){return e.day;}))].sort();
let shelfDays=[];try{shelfDays=JSON.parse(localStorage.getItem('shelf2')||'[]').flatMap(function(it){return it.confirmations||[];});}catch(e){shelfDays=[];}
const pDays=[...new Set(entries.filter(function(e){return e.productUse;}).map(function(e){return e.day;}).concat(shelfDays))].sort();
const w=streakDays(wDays),p=streakDays(pDays);
const fi=live?function(){const f=IDENTITIES.filter(function(x){return live.identity&&x.id===live.identity.id;})[0];return f||identityFor(live.dna||dnaOf(live.picks||{}),{streak:w.current});}():null;
const an=fi?describeIdentity(fi.id,entries):null;
const dist=weekDist(entries);
const hist=[...entries].sort(function(a,b){return b.ts.localeCompare(a.ts);}).slice(0,14);
return<div style={{display:'grid',gap:12}}>
<div><h1 className="pagehead">Wellness Insights</h1><p className="muted">Your patterns, explained. Self-reported — never medical advice.</p></div>
{fi?<div className="card" style={{borderTop:'6px solid '+fi.color}}><h2><span style={{fontSize:30}}>{fi.icon}</span> <button style={{color:fi.color,background:'none',border:'none',fontSize:'1em',fontWeight:800,fontFamily:'Sora'}} onClick={function(){setPop({ident:fi,picks:live.picks});}}>{fi.name}</button></h2><Petals dna={live.dna||dnaOf(live.picks||{})}/><p>{an.line}</p><p><b>Tomorrow, try:</b> {an.tip}</p></div>
:<div className="card"><p className="muted">No check-ins yet — visit Check-in to begin your story.</p></div>}
<div className="grid2">
<div className="card"><b><Flame size={18}/> Wellness streak</b><p style={{fontSize:24,margin:'4px 0'}}>{w.current} <span className="muted">best {w.best}</span></p><div style={{height:8,background:'#F3E8D2',borderRadius:99}}><div style={{width:Math.min(100,w.current/7*100)+'%',height:'100%',background:'#6F9676',borderRadius:99}}/></div><p className="muted">{w.current<7?(7-w.current)+' days to your 7-day glow!':'Blazing — protect it gently.'}</p></div>
<div className="card"><b><Droplets size={18}/> Product-use streak</b><p style={{fontSize:24,margin:'4px 0'}}>{p.current} <span className="muted">best {p.best}</span></p><div style={{height:8,background:'#DDEBD9',borderRadius:99}}><div style={{width:Math.min(100,p.current/7*100)+'%',height:'100%',background:'#6F9676',borderRadius:99}}/></div><p className="muted">{p.current<7?(7-p.current)+' consistent days to go!':'Routine locked in.'}</p></div>
</div>
<div className="card"><h3 className="sec-title">Last 7 days — share of your best answers</h3>
{dist.length?dist.map(function(d){return<div key={d.key} style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}><span style={{width:70,fontSize:13}}>{LBL[d.key]||d.key}</span><div style={{flex:1,height:10,background:'#EFE9F5',borderRadius:99}}><div style={{width:d.pct+'%',height:'100%',background:'#6F9676',borderRadius:99}}/></div><span style={{fontSize:13,width:38}}>{d.pct}%</span></div>;}):<p className="muted">Check in a few days to grow this chart.</p>}</div>
<div className="card"><h3 className="sec-title">History</h3>{hist.length?hist.map(function(e){return<div key={e.ts} className="muted" style={{borderTop:'1px solid #EFE9F5',padding:'6px 0'}}>{e.day} {new Date(e.ts).toLocaleTimeString()} • {(e.identity&&e.identity.name)||'—'}{e.productUse?' • ✓ used':''}</div>;}):<p className="muted">Nothing yet.</p>}</div>
{pop&&<IdentityPopup ident={pop.ident} entries={entries} picks={pop.picks} onClose={function(){setPop(null);}}/>}
</div>;
}
