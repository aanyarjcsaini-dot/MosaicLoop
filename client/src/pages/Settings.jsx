import {useApp} from '../store.js';
export default function Settings(){
const{profile,signOut}=useApp();
return<div style={{display:'grid',gap:12}}>
<div><h1 className="pagehead">Settings</h1><p className="muted">App preferences. Everything stays on this device unless noted.</p></div>
<div className="card"><h3 className="sec-title">Profile</h3><p>{profile?profile.name+' • '+profile.email:'Guest — sign in from the avatar menu.'}</p></div>
<div className="card"><h3 className="sec-title">Reminders</h3><p className="muted">Restock nudges and album reminders are in-app only for now. Push notifications need a notification service (documented, not faked).</p></div>
<div className="card"><h3 className="sec-title">Demo data</h3><p className="muted">Clear local demo to start fresh.</p><button className="chip" onClick={function(){localStorage.removeItem('hist');localStorage.removeItem('entries');window.location.reload();}}>Reset demo data</button></div>
{profile&&<div className="card"><button className="btn" onClick={signOut}>Sign Out</button></div>}
</div>;
}
