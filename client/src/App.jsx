import {useEffect,useState} from 'react';import './app.css';import Shell from './components/Shell.jsx';import Buddy from './components/Buddy.jsx';import Rewards from './components/Rewards.jsx';import Home from './pages/Home.jsx';import Checkin from './pages/Checkin.jsx';import Insights from './pages/Insights.jsx';import Calendar from './pages/Calendar.jsx';import Shelf from './pages/Shelf.jsx';import Discover from './pages/Discover.jsx';import Family from './pages/Family.jsx';import Album from './pages/Album.jsx';import Settings from './pages/Settings.jsx';import {useApp} from './store.js';
export default function App(){
const{tab,buddy,setBuddy}=useApp();
const[welc,setWelc]=useState(true);
useEffect(function(){const t=setTimeout(function(){setWelc(false);},2200);return function(){clearTimeout(t);};},[]);
if(welc){return<div className="shell" style={{justifyContent:'center',alignItems:'center',textAlign:'center',background:'linear-gradient(135deg,#E9E1F5,#FFF5D9)',color:'#554B60',cursor:'pointer',minHeight:'100vh',display:'flex',flexDirection:'column'}} onClick={function(){setWelc(false);}}><div style={{fontSize:56}}>🌿</div><h1>Welcome to Mosaic Loop</h1><p style={{opacity:.75}}>Small steps. Big changes. Tap to begin.</p></div>;}
return<Shell>
{tab==='home'&&<Home/>}
{tab==='checkin'&&<Checkin/>}
{tab==='insights'&&<Insights/>}
{tab==='calendar'&&<Calendar/>}
{tab==='shelf'&&<Shelf/>}
{tab==='album'&&<Album/>}
{tab==='family'&&<><Family/><div style={{marginTop:12}}><Rewards/></div></>}
{tab==='discover'&&<Discover/>}
{tab==='ai'&&<div className="card"><Buddy onClose={function(){setBuddy(false);}}/></div>}
{tab==='settings'&&<Settings/>}
{buddy&&<><div className="scrim" onClick={()=>setBuddy(false)}/><div className="sheet"><Buddy onClose={()=>setBuddy(false)}/></div></>}
<p className="muted" style={{marginTop:16}}>Self-reported wellness insights, not medical advice.</p>
</Shell>;
}
