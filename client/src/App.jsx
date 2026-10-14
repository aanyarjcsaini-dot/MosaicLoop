import {useEffect,useState} from 'react';import './app.css';import Shell from './components/Shell.jsx';import Buddy from './components/Buddy.jsx';import Rewards from './components/Rewards.jsx';import Home from './pages/Home.jsx';import Insights from './pages/Insights.jsx';import Calendar from './pages/Calendar.jsx';import Shelf from './pages/Shelf.jsx';import Discover from './pages/Discover.jsx';import Family from './pages/Family.jsx';import Album from './pages/Album.jsx';import Reviews from './pages/Reviews.jsx';import Settings from './pages/Settings.jsx';import {useApp} from './store.js';import Logo from './components/Logo.jsx';
export default function App(){
const{tab,buddy,setBuddy}=useApp();
const[welc,setWelc]=useState(true);
useEffect(function(){const t=setTimeout(function(){setWelc(false);},2200);return function(){clearTimeout(t);};},[]);
if(welc){return<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#FFFFFF',padding:20,cursor:'pointer'}} onClick={function(){setWelc(false);}}><div style={{position:'relative',width:'100%',maxWidth:400,overflow:'hidden',borderRadius:28,padding:'40px 28px',textAlign:'center',background:'#FFFFFF',border:'1px solid #E3DCFF'}}><div style={{position:'absolute',top:-40,right:-40,width:140,height:140,borderRadius:'50%',background:'#C6F36B',opacity:.35}}/><div style={{position:'absolute',bottom:-50,left:-50,width:160,height:160,borderRadius:'50%',background:'#FFB99B',opacity:.3}}/><div style={{position:'absolute',top:60,left:-30,width:90,height:90,borderRadius:'50%',background:'#B9A3FF',opacity:.25}}/><div style={{textAlign:'left'}}><Logo s={30}/></div><h1 style={{fontSize:30,margin:'18px 0 6px'}}>Welcome to Mosaic Loop</h1><p style={{opacity:.7,maxWidth:300,margin:'0 auto'}}>Understand your body. Build better habits. Feel like you.</p><button className="btn" style={{marginTop:18,background:'#171747',minWidth:200}} onClick={function(e){e.stopPropagation();setWelc(false);}}>Get Started →</button></div></div>;}
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
