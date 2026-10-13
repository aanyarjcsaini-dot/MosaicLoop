import {useEffect,useRef,useState} from 'react';import {useApp} from '../store.js';import {identityFor,dnaOf} from '../lib/wellness.js';
function myIdentity(){try{const es=JSON.parse(localStorage.getItem('entries')||'[]');if(!es.length){return null;}
const l=es.slice().sort(function(a,b){return a.ts<b.ts?-1:1;}).pop();return identityFor(l.dna||dnaOf(l.picks||{}),{streak:0});}catch(e){return null;}}
function uid(){return' ml-'+Math.random().toString(36).slice(2,8).toUpperCase();}
export default function Profile(){
const{profile,signIn,signOut,setTab}=useApp();
const[open,setOpen]=useState(false);
const[nm,setNm]=useState('');const[em,setEm]=useState('');const[err,setErr]=useState('');
const box=useRef(null);
useEffect(function(){
if(!open){return;}
function out(e){if(box.current&&!box.current.contains(e.target)){setOpen(false);}}
function key(e){if(e.key==='Escape'){setOpen(false);}}
document.addEventListener('mousedown',out);document.addEventListener('keydown',key);
return function(){document.removeEventListener('mousedown',out);document.removeEventListener('keydown',key);};
},[open]);
const initial=(profile&&profile.name?profile.name[0]:'?').toUpperCase();
const goIn=function(){
if(!nm.trim()||em.indexOf('@')<0){setErr('Enter a name and a valid email.');return;}
signIn(nm,em);setNm('');setEm('');setErr('');setOpen(false);
};
return<div ref={box} style={{position:'relative',marginLeft:'auto'}}>
<button className="avatar" aria-label="Profile and account" aria-expanded={open} onClick={function(){setOpen(!open);}}>{profile?initial:'👤'}</button>
{open&&<div className="pside open" role="dialog" aria-label="Account">
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b>Account</b><button aria-label="Close account panel" onClick={function(){setOpen(false);}}>✕</button></div>
<div style={{display:'flex',gap:12,alignItems:'center',marginTop:8}}><div className="avatar big">{profile?initial:'👤'}</div>
<div>{profile?<div><b>{profile.name}</b><br/><span className="muted">@{profile.username}</span><br/><span className="muted">ID {profile.uid}</span></div>:<div><b>Guest</b><br/><span className="muted">Not signed in</span></div>}</div></div>
{profile?<div style={{marginTop:8}}><p className="muted">Login: {profile.email} • Passwords are never shown.</p>
{function(){const id=myIdentity();return id?<p><span style={{fontSize:20}}>{id.icon}</span> <b style={{color:id.color}}>{id.name}</b> <span className="muted">• current vibe</span></p>:<p className="muted">Check in once to grow your wellness identity.</p>;}()}
<div style={{display:'grid',gap:6,margin:'8px 0'}}><button className="chip" onClick={function(){setOpen(false);}}>My Profile ✓</button><button className="chip" onClick={function(){setOpen(false);setTab('family');}}>Family & Friends →</button><button className="chip" onClick={function(){setOpen(false);setTab('settings');}}>App Preferences →</button></div>
<button className="btn" style={{width:'100%'}} onClick={function(){signOut();setOpen(false);}}>Sign Out</button></div>
:<div style={{display:'grid',gap:8,marginTop:8}}><input value={nm} onChange={function(e){setNm(e.target.value);}} placeholder="Full name" aria-label="Full name"/><input value={em} onChange={function(e){setEm(e.target.value);}} placeholder="Email" aria-label="Email" inputMode="email"/>{err&&<span className="muted">{err}</span>}
<button className="btn" onClick={goIn}>Sign In</button><span className="muted">Local profile for now — server sign-in plugs into these same Sign In/Out buttons.</span></div>}
</div>}
</div>;
}
