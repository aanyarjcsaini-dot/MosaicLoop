import {useEffect,useState} from 'react';import './app.css';import Shell from './components/Shell.jsx';import Buddy from './components/Buddy.jsx';import Rewards from './components/Rewards.jsx';import Home from './pages/Home.jsx';import Calendar from './pages/Calendar.jsx';import Shelf from './pages/Shelf.jsx';import Discover from './pages/Discover.jsx';import Family from './pages/Family.jsx';import Album from './pages/Album.jsx';import {useApp} from './store.js';
export default function App(){
const{tab,buddy,setBuddy}=useApp();
const[welc,setWelc]=useState(true);
useEffect(function(){const t=setTimeout(function(){setWelc(false);},2200);return function(){clearTimeout(t);};},[]);
if(welc){return<div className="shell" style={{justifyContent:'center',alignItems:'center',textAlign:'center',background:'linear-gradient(135deg,#0E3B2E,#1E7250)',color:'#fff',cursor:'pointer'}} onClick={function(){setWelc(false);}}><div style={{fontSize:56}}>🌿</div><h1 style={{fontFamily:'Fraunces,serif'}}>Welcome to Mosaic Loop</h1><p style={{opacity:.85}}>Your mirror, not a medical test. Tap to begin.</p></div>;}
return<Shell>
{tab==='home'&&<Home/>}
{tab==='calendar'&&<Calendar/>}
{tab==='shelf'&&<Shelf/>}
{tab==='album'&&<Album/>}
{tab==='family'&&<><Family/><div style={{marginTop:12}}><Rewards/></div></>}
{tab==='discover'&&<Discover/>}
{buddy&&<><div className="scrim" onClick={()=>setBuddy(false)}/><div className="sheet"><Buddy onClose={()=>setBuddy(false)}/></div></>}
<p className="muted" style={{marginTop:16}}>Self-reported wellness insights, not medical advice.</p>
</Shell>;
}
