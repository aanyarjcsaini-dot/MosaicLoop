import './app.css';import Shell from './components/Shell.jsx';import Home from './pages/Home.jsx';import Stub from './pages/Stub.jsx';import {useApp} from './store.js';
export default function App(){
const{tab,buddy,setBuddy}=useApp();
return<Shell>
{tab==='home'&&<Home/>}
{tab==='calendar'&&<Stub title="Calendar" body="Month + week dots, deliveries, restock reminders. Migrated from prototype next."/>}
{tab==='shelf'&&<Stub title="Shelf" body="Product cards with days-left rings from official usage. Next."/>}
{tab==='family'&&<Stub title="Family Circle" body="Parent/partner/sibling/child mini-DNA. Next."/>}
{tab==='discover'&&<Stub title="Discover" body="Honest Reviews (SAMPLE DATA) + SKU check + trial rewards. Next."/>}
{buddy&&<><div className="scrim" onClick={()=>setBuddy(false)}/><div className="sheet"><h3>AI Wellness Friend</h3><p className="muted">Wellness only. Full chat lands in phase 6. Try server POST /api/chat for the rule mock.</p><button className="btn" onClick={()=>setBuddy(false)}>Close</button></div></>}
<p className="muted" style={{marginTop:16}}>Self-reported wellness insights, not medical advice.</p>
</Shell>;
}
