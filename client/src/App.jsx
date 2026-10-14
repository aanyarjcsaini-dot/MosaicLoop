import {useEffect,useState} from 'react';import './app.css';import Shell from './components/Shell.jsx';import Buddy from './components/Buddy.jsx';import Rewards from './components/Rewards.jsx';import Home from './pages/Home.jsx';import Insights from './pages/Insights.jsx';import Calendar from './pages/Calendar.jsx';import Shelf from './pages/Shelf.jsx';import Discover from './pages/Discover.jsx';import Family from './pages/Family.jsx';import Album from './pages/Album.jsx';import Reviews from './pages/Reviews.jsx';import Settings from './pages/Settings.jsx';import {useApp} from './store.js';import {Crew} from './components/Blobs.jsx';
export default function App(){
const{tab,buddy,setBuddy}=useApp();
const[welc,setWelc]=useState(true);
useEffect(function(){const t=setTimeout(function(){setWelc(false);},2200);return function(){clearTimeout(t);};},[]);
if(welc){return<div className="shell" style={{justifyContent:'center',alignItems:'center',textAlign:'center',background:'linear-gradient(135deg,#FFE3EF,#DCCEFF)',color:'#49334F',cursor:'pointer',minHeight:'100vh',display:'flex',flexDirection:'column',padding:24}} onClick={function(){setWelc(false);}}><Crew n={5} s={64}/><h1 style={{fontSize:40,margin:'12px 0 4px'}}>Welcome to<br/>Mosaic Loop</h1><p style={{opacity:.75,maxWidth:340}}>Your friendly companion for better habits, balanced days and a healthier, happier you.</p><button className="btn" style={{marginTop:8}} onClick={function(e){e.stopPropagation();setWelc(false);}}>Get Started →</button></div>;}
return<Shell>
{tab==='home'&&<Home/>}
{tab==='insights'&&<Insights/>}
{tab==='calendar'&&<Calendar/>}
{tab==='shelf'&&<Shelf/>}
{tab==='album'&&<Album/>}
{tab==='family'&&<><Family/><div style={{marginTop:12}}><Rewards/></div></>}
{tab==='discover'&&<Discover/>}
{tab==='reviews'&&<Reviews/>}
{tab==='settings'&&<Settings/>}
{buddy&&<><div className="scrim" onClick={()=>setBuddy(false)}/><div className="sheet"><Buddy onClose={()=>setBuddy(false)}/></div></>}
<p className="muted" style={{marginTop:16}}>Self-reported wellness insights, not medical advice.</p>
</Shell>;
}
