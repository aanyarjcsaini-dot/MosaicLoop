import {useMemo,useState} from 'react';import {Flame,Droplets} from 'lucide-react';import {dnaOf,identityFor,qualifyingWellness,streakDays,IDENTITIES} from '../lib/wellness.js';import {dailyFact} from '../lib/facts.js';import Petals,{Ring} from '../components/Visuals.jsx';import IdentityPopup from '../components/IdentityPopup.jsx';import {useApp} from '../store.js';
function readEntries(){try{return JSON.parse(localStorage.getItem('entries')||'[]');}catch(e){return[];}}
export default function Home(){
const[entries]=useState(readEntries);const[pop,setPop]=useState(null);
const fact=useMemo(dailyFact,[]);
const{profile,setTab}=useApp();
const hr=new Date().getHours();
const tod=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
const nm=profile&&profile.name?profile.name.split(' ')[0]:null;
const today=new Date().toISOString().slice(0,10);
const doneToday=entries.some(function(e){return e.day===today&&qualifyingWellness(e);});
const sorted=[...entries].sort(function(a,b){return a.ts<b.ts?-1:1;});
const live=sorted[sorted.length-1]||null;
const wDays=[...new Set(entries.filter(qualifyingWellness).map(function(e){return e.day;}))].sort();
let shelfDays=[];try{shelfDays=JSON.parse(localStorage.getItem('shelf2')||'[]').flatMap(function(it){return it.confirmations||[];});}catch(e){shelfDays=[];}
const pDays=[...new Set(entries.filter(function(e){return e.productUse;}).map(function(e){return e.day;}).concat(shelfDays))].sort();
const w=streakDays(wDays),p=streakDays(pDays);
const fi=live?function(){const f=IDENTITIES.filter(function(x){return live.identity&&x.id===live.identity.id;})[0];return f||identityFor(live.dna||dnaOf(live.picks||{}),{streak:w.current});}():null;
return<div style={{display:'grid',gap:20}}>
<div><h1 className="pagehead">{tod}{nm?', '+nm:''},<br/>You're doing amazing!</h1><p className="muted">Small steps. Big changes.</p></div>
<div className="card" style={{background:'#E9E1F5',borderColor:'#D9CCE9'}}><b>{doneToday?'Today’s check-in is done ✓':'Hey, how are you today?'}</b><p className="muted" style={{margin:'4px 0 8px'}}>{doneToday?'Your DNA is fresh. Peek at Insights for the story.':'6 quick taps. Your mirror, not a medical test.'}</p><button className="btn" onClick={function(){setTab('checkin');}}>{doneToday?'Review Insights':'Start check-in'}</button></div>
<div className="card" style={{background:'linear-gradient(135deg,#FFF7EA,#FFE7CF)'}}><small className="muted">DID YOU KNOW? • {fact.cat}</small><p><b>{fact.title}</b></p><p className="muted">{fact.why}</p><p className="muted">Source: {fact.source}</p></div>
{fi?<div className="card"><h3 className="sec-title">Live Wellness DNA</h3><div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap'}}><div style={{maxWidth:180}}><Petals dna={live.dna||dnaOf(live.picks||{})}/></div><div style={{flex:1,minWidth:180}}><p style={{fontSize:20,margin:'0 0 4px'}}><span style={{fontSize:26}}>{fi.icon}</span> <b style={{color:fi.color,fontFamily:'Sora'}}>{fi.name}</b></p><button className="chip" onClick={function(){setPop({ident:fi,picks:live.picks});}}>Why this? ⓘ</button></div></div></div>
:<div className="card"><p className="muted">No DNA yet — one check-in grows it here.</p></div>}
<div className="grid2">
<div className="card"><b><Flame size={16}/> {w.current}-day rhythm</b><p className="muted" style={{margin:'2px 0'}}>best {w.best}</p></div>
<div className="card"><b><Droplets size={16}/> {p.current}-day routine</b><p className="muted" style={{margin:'2px 0'}}>best {p.best}</p></div>
</div>
{pop&&<IdentityPopup ident={pop.ident} entries={entries} picks={pop.picks} onClose={function(){setPop(null);}}/>}
</div>;
}
