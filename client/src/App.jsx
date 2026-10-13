import './app.css';import Shell from './components/Shell.jsx';import Buddy from './components/Buddy.jsx';import Rewards from './components/Rewards.jsx';import Home from './pages/Home.jsx';import Calendar from './pages/Calendar.jsx';import Shelf from './pages/Shelf.jsx';import Discover from './pages/Discover.jsx';import Family from './pages/Family.jsx';import Album from './pages/Album.jsx';import {useApp} from './store.js';
export default function App(){
const{tab,buddy,setBuddy}=useApp();
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
