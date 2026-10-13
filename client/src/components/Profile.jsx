import {useEffect,useRef,useState} from 'react';import {useApp} from '../store.js';
export default function Profile(){
const{profile,signIn,signOut}=useApp();
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
<button className="avatar" aria-label="Profile menu" aria-expanded={open} onClick={function(){setOpen(!open);}}>{profile?initial:'👤'}</button>
{open&&<div className="profilemenu" role="menu">
<div style={{display:'flex',gap:10,alignItems:'center'}}><div className="avatar big">{profile?initial:'👤'}</div>
<div>{profile?<div><b>{profile.name}</b><br/><span className="muted">{profile.email}</span></div>:<div><b>Guest</b><br/><span className="muted">Not signed in</span></div>}</div></div>
{profile?<><p className="muted">Signed in on this device. Passwords are never shown.</p><button className="btn" style={{width:'100%'}} onClick={function(){signOut();setOpen(false);}}>Sign Out</button></>
:<><div style={{display:'grid',gap:8,marginTop:8}}><input value={nm} onChange={function(e){setNm(e.target.value);}} placeholder="Name" aria-label="Name"/><input value={em} onChange={function(e){setEm(e.target.value);}} placeholder="Email" aria-label="Email" inputMode="email"/>{err&&<span className="muted">{err}</span>}
<button className="btn" onClick={goIn}>Sign In</button><span className="muted">Local profile for now — server sign-in plugs in here.</span></div></>}
</div>}
</div>;
}
