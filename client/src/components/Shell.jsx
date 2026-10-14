import {useEffect,useState} from 'react';import {Home,ShoppingBag,ChartNoAxesColumnIncreasing,UsersRound,Images,Settings,Menu,X,CalendarDays,Compass,Camera,Star,MoreHorizontal} from 'lucide-react';import {useApp} from '../store.js';import {Sparkles} from 'lucide-react';import Profile from './Profile.jsx';
const MAIN=[['home','Home',Home],['insights','Wellness Insights',ChartNoAxesColumnIncreasing],['calendar','Calendar',CalendarDays],['shelf','My Shelf',ShoppingBag],['album','Album',Images],['family','Family & Friends',UsersRound],['discover','Discover',Compass],['reviews','Honest Reviews',Star],['settings','Settings',Settings]];
const PILL=[['home','Home',Home],['insights','Insights',ChartNoAxesColumnIncreasing],['calendar','Calendar',CalendarDays],['shelf','Shelf',ShoppingBag]];
function Mark(){
return<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="11" cy="11" r="8" fill="#B9A3FF"/><circle cx="23" cy="11" r="8" fill="#C6F36B"/><circle cx="11" cy="23" r="8" fill="#6C7CFF"/><circle cx="23" cy="23" r="8" fill="#FFB99B"/><circle cx="17" cy="17" r="4" fill="#FFFFFF"/></svg>;
}
export default function Shell(props){
const children=props.children;
const{tab,setTab,buddy,setBuddy,sideOpen,setSideOpen,sideCollapsed,setSideCollapsed}=useApp();
const[more,setMore]=useState(false);
const[mobile,setMobile]=useState(function(){return typeof window!=='undefined'&&window.matchMedia?window.matchMedia('(max-width:1023px)').matches:false;});
useEffect(function(){if(!window.matchMedia){return;}const q=window.matchMedia('(max-width:1023px)');
function onCh(e){setMobile(e.matches);if(e.matches){setSideOpen(false);}}q.addEventListener('change',onCh);
return function(){q.removeEventListener('change',onCh);};},[setSideOpen]);
const desktop=!mobile;
useEffect(function(){
function onKey(e){if(e.key==='Escape'){setSideOpen(false);setMore(false);}}
window.addEventListener('keydown',onKey);
return function(){window.removeEventListener('keydown',onKey);};
},[setSideOpen]);
const toggle=function(){if(desktop){setSideCollapsed(!sideCollapsed);}else{setSideOpen(!sideOpen);}};
const go=function(k){setTab(k);setSideOpen(false);setMore(false);};
const items=function(list){return list.map(function(t){const k=t[0],l=t[1],Icon=t[2];const on=tab===k;
return<button key={k} className={'navitem'+(on?' on':'')} aria-current={on?'page':undefined} title={l} onClick={function(){go(k);}}><Icon size={20} strokeWidth={2}/><span>{l}</span></button>;});};
const camera=function(){try{sessionStorage.setItem('album-autoadd','1');}catch(e){}go('album');};
return<div className="shell">
{desktop&&<aside className={'side'+(sideCollapsed?' collapsed':'')} aria-label="Main navigation">
<div className="brandmark"><Mark/><b>Mosaic Loop</b></div>
{items(MAIN)}
</aside>}
{desktop&&sideOpen&&<div className="backdrop" onClick={function(){setSideOpen(false);}}/>}
<div className={'main'+(sideCollapsed&&desktop?' wide':'')}>
<div className="top">{desktop&&<button className="menubtn" aria-label="Toggle navigation" aria-expanded={!sideCollapsed} onClick={toggle}><Menu size={20}/></button>}<b style={{fontFamily:'Montserrat',fontWeight:800}}>Mosaic Loop</b><span className="muted">wellness first</span><Profile/></div>
<div className="content">{children}</div>
</div>
<button className="buddy" aria-label="AI Wellness Friend" onClick={function(){setBuddy(!buddy);}}><Sparkles size={26}/></button>
<button className="camerafab" aria-label="Capture progress photo" onClick={camera}><Camera size={24}/></button>
<nav className="pillnav" aria-label="Primary">
{PILL.map(function(t){const k=t[0],l=t[1],Icon=t[2];const on=tab===k;
return<button key={k} className={on?'on':''} aria-label={l} aria-current={on?'page':undefined} onClick={function(){go(k);}}><Icon size={22} strokeWidth={on?2.4:2}/></button>;})}
<button aria-label="More destinations" onClick={function(){setMore(!more);}}><MoreHorizontal size={22}/></button>
</nav>
{more&&<><div className="scrim" onClick={function(){setMore(false);}}/><div className="sheet"><h3>More</h3><div className="moregrid">
{[['album','Album',Images],['family','Family & Friends',UsersRound],['discover','Discover',Compass],['reviews','Honest Reviews',Star],['settings','Settings',Settings]].map(function(t){const k=t[0],l=t[1],Icon=t[2];
return<button key={k} className="chip" style={{display:'flex',alignItems:'center',gap:8}} onClick={function(){go(k);}}><Icon size={18}/> {l}</button>;})}
</div><button className="btn" style={{marginTop:10}} onClick={function(){setMore(false);}}>Close</button></div></>}
</div>;
}
