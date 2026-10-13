import {useEffect,useState} from 'react';import {useApp} from '../store.js';import Fairy from './Fairy.jsx';import Profile from './Profile.jsx';
const TABS=[['home','Home'],['calendar','Calendar'],['shelf','Shelf'],['album','Album'],['family','Family'],['discover','Discover']];
export default function Shell({children}){
const{tab,setTab,buddy,setBuddy}=useApp();
const[isMenuOpen,setIsMenuOpen]=useState(false);
useEffect(function(){
if(!isMenuOpen){return;}
function onKey(e){if(e.key==='Escape'){setIsMenuOpen(false);}}
window.addEventListener('keydown',onKey);
return function(){window.removeEventListener('keydown',onKey);};
},[isMenuOpen]);
const go=function(k){setTab(k);setIsMenuOpen(false);};
return<div className="shell">
<div className="top"><button className="menubtn" aria-label="Open navigation menu" aria-expanded={isMenuOpen} onClick={function(){setIsMenuOpen(!isMenuOpen);}}>⋮</button><b>Mosaic Loop</b><span className="muted">wellness first</span><Profile/></div>
<div className={'drawer'+(isMenuOpen?' open':'')} aria-hidden={!isMenuOpen}>
<nav aria-label="Primary">{TABS.map(function(t){const k=t[0],l=t[1];return<button key={k} className={'tabrow'+(tab===k?' on':'')} onClick={function(){go(k);}} tabIndex={isMenuOpen?0:-1}>{l}</button>;})}</nav>
</div>
{isMenuOpen&&<div className="scrim" onClick={function(){setIsMenuOpen(false);}}/>}
<div className="content">{children}</div>
<button className="buddy" aria-label="AI Wellness Friend" onClick={()=>setBuddy(!buddy)}><Fairy size={34}/></button>
</div>;
}
