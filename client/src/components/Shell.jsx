import {useEffect} from 'react';import {Home,ShoppingBag,ChartNoAxesColumnIncreasing,UsersRound,Images,Settings,Menu,X,CalendarDays,Compass} from 'lucide-react';import {useApp} from '../store.js';import Fairy from './Fairy.jsx';import Profile from './Profile.jsx';
const MAIN=[['home','Home',Home],['insights','Wellness Insights',ChartNoAxesColumnIncreasing],['calendar','Calendar',CalendarDays],['shelf','My Shelf',ShoppingBag],['album','Album',Images],['family','Family & Friends',UsersRound],['discover','Discover',Compass],['settings','Settings',Settings]];
function Mark(){
return<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="11" cy="11" r="8" fill="#E9E1F5"/><circle cx="23" cy="11" r="8" fill="#FFF5D9" stroke="#D9CCE9"/><circle cx="11" cy="23" r="8" fill="#D8B8CA"/><circle cx="23" cy="23" r="8" fill="#A8BCA4"/><circle cx="17" cy="17" r="4" fill="#FFFCF6"/></svg>;
}
export default function Shell(props){
const children=props.children;
const{tab,setTab,buddy,setBuddy,sideOpen,setSideOpen,sideCollapsed,setSideCollapsed}=useApp();
const desktop=typeof window!=='undefined'&&window.matchMedia?window.matchMedia('(min-width:1024px)').matches:true;
useEffect(function(){
function onKey(e){if(e.key==='Escape'){setSideOpen(false);}}
window.addEventListener('keydown',onKey);
return function(){window.removeEventListener('keydown',onKey);};
},[setSideOpen]);
const toggle=function(){if(desktop){setSideCollapsed(!sideCollapsed);}else{setSideOpen(!sideOpen);}};
const go=function(k){setTab(k);setSideOpen(false);};
const items=function(list){return list.map(function(t){const k=t[0],l=t[1],Icon=t[2];const on=tab===k;
return<button key={k} className={'navitem'+(on?' on':'')} aria-current={on?'page':undefined} title={l} onClick={function(){go(k);}}><Icon size={20} strokeWidth={2}/><span>{l}</span></button>;});};
return<div className="shell">
<aside className={'side'+(sideCollapsed&&desktop?' collapsed':'')+(sideOpen&&!desktop?' open':'')} aria-label="Main navigation">
<div className="brandmark"><Mark/><b>Mosaic Loop</b></div>
{items(MAIN)}
</aside>
{sideOpen&&!desktop&&<div className="backdrop" onClick={function(){setSideOpen(false);}}/>}
<div className={'main'+(sideCollapsed&&desktop?' wide':'')}>
<div className="top"><button className="menubtn" aria-label="Toggle navigation" aria-expanded={desktop?!sideCollapsed:sideOpen} onClick={toggle}>{(!desktop&&sideOpen)?<X size={20}/>:<Menu size={20}/>}</button><b style={{fontFamily:'Sora'}}>Mosaic Loop</b><span className="muted">wellness first</span><Profile/></div>
<div className="content">{children}</div>
</div>
<button className="buddy" aria-label="AI Wellness Friend" onClick={function(){setBuddy(!buddy);}}><Fairy size={32}/></button>
</div>;
}
