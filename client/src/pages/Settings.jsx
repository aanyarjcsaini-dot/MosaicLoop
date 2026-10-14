import {useState} from 'react';import {useApp} from '../store.js';
export default function Settings(){
const{profile,signOut}=useApp();
const[key,setKey]=useState('');const[rows,setRows]=useState(null);const[err,setErr]=useState('');
const load=function(){setErr('');fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/reviews/summary?key='+encodeURIComponent(key||'demo-key')).then(function(r){if(!r.ok){throw new Error('bad key');}return r.json();}).then(function(j){setRows(j.rows||[]);}).catch(function(){setErr('Could not load. Check the key and connection.');});};
return<div style={{display:'grid',gap:12}}>
<div><h1 className="pagehead">Settings</h1><p className="muted">App preferences. Everything stays on this device unless noted.</p></div>
<div className="card"><h3 className="sec-title">Profile</h3><p>{profile?profile.name+' • '+profile.email:'Guest — sign in from the avatar menu.'}</p></div>
<div className="card"><h3 className="sec-title">Reminders</h3><p className="muted">Restock nudges and album reminders are in-app only for now. Push notifications need a notification service and are the production path.</p></div>
<div className="card"><h3 className="sec-title">Feedback summary (demo)</h3><p className="muted">Real aggregated counts by product and reason. Needs the admin key (default demo-key).</p>
<div style={{display:'flex',gap:8}}><input value={key} onChange={function(e){setKey(e.target.value);}} placeholder="Admin key" aria-label="Admin key" type="password"/><button className="btn" onClick={load}>Load</button></div>
{err&&<p className="muted">{err}</p>}
{rows&&rows.map(function(r,i){return<p key={i} className="muted">• {(r._id&&r._id.sku)||'?'} / {((r._id&&r._id.reason)||[]).join(', ')||'—'}: {r.count}</p>;})}</div>
<div className="card"><h3 className="sec-title">Demo data</h3><p className="muted">Clear local demo to start fresh.</p><button className="chip" onClick={function(){localStorage.removeItem('hist');localStorage.removeItem('entries');window.location.reload();}}>Reset demo data</button></div>
{profile&&<div className="card"><button className="btn" onClick={signOut}>Sign Out</button></div>}
</div>;
}
