import {useApp} from '../store.js';import Fairy from './Fairy.jsx';
const TABS=[['home','Home'],['calendar','Calendar'],['shelf','Shelf'],['album','Album'],['family','Family'],['discover','Discover']];
export default function Shell({children}){
const{tab,setTab,buddy,setBuddy}=useApp();
return<div className="shell">
<div className="top"><b>Mosaic Loop</b><span className="muted">wellness first</span></div>
<div className="content">{children}</div>
<button className="buddy" aria-label="AI Wellness Friend" onClick={()=>setBuddy(!buddy)}><Fairy size={34}/></button>
<nav className="tabs" aria-label="Primary">{TABS.map(([k,l])=><button key={k} className={'tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}>{l}</button>)}</nav>
</div>;
}
