import {useEffect,useState} from 'react';import {useApp} from '../store.js';import Fairy from './Fairy.jsx';
const TABS=[['home','Home'],['calendar','Calendar'],['shelf','Shelf'],['album','Album'],['family','Family'],['discover','Discover']];
export default function Shell({children}){
const{tab,setTab,buddy,setBuddy}=useApp();
const[open,setOpen]=useState(false);
useEffect(function(){
if(!open){return;}
function onKey(e){if(e.key==='Escape'){setOpen(false);}}
window.addEventListener('keydown',onKey);
return function(){window.removeEventListener('keydown',onKey);};
},[open]);
const go=function(k){setTab(k);setOpen(false);};
return<div className="shell">
<div className="top"><button className="menubtn" aria-label="Open navigation menu" aria-expanded={open} onClick={function(){setOpen(!open);}}>⋮</button><b>Mosaic Loop</b><span className="muted">wellness first</span></div>
<div className={'drawer'+(open?' open':'')} aria-hidden={!open}>
<nav aria-label="Primary">{TABS.map(function(t){const k=t[0],l=t[1];return<button key={k} className={'tabrow'+(tab===k?' on':'')} onClick={function(){go(k);}} tabIndex={open?0:-1}>{l}</button>;})}</nav>
</div>
{open&&<div className="scrim" onClick={function(){setOpen(false);}}/>}
<div className="content">{children}</div>
<button className="buddy" aria-label="AI Wellness Friend" onClick={()=>setBuddy(!buddy)}><Fairy size={34}/></button>
</div>;
}
