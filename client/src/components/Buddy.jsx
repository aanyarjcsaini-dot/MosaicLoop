import {useEffect,useRef,useState} from 'react';import {chatReply,chatFollow} from '../lib/chat.js';import Fairy from './Fairy.jsx';
import {useApp} from '../store.js';
export default function Buddy(onClose){
const close=onClose.onClose||onClose;
const{aiSeen,setAiSeen}=useApp();
const[log,setLog]=useState([{w:'ai',t:'Hi, I’m your AI Wellness Friend! What are you feeling today?'}]);
const[inp,setInp]=useState('');const entered=aiSeen;const setEntered=setAiSeen;
const box=useRef(null);const input=useRef(null);
useEffect(function(){if(input.current){input.current.focus();}},[]);
const[busy,setBusy]=useState(false);const[live,setLive]=useState('idle');const rec=useRef(null);const stage=useRef('feel');
useEffect(function(){const el=box.current;if(el){el.scrollTop=el.scrollHeight;}},[log,busy]);
const send=async function(text){const q=(typeof text==='string'?text:inp).trim();if(!q||busy){return;}setInp('');setLog(function(l){return [...l,{w:'you',t:q}];});setBusy(true);
try{
let r;
if(stage.current==='feel'){r=await chatReply(q);stage.current='cause';}
else if(stage.current==='cause'){r=await chatFollow(q);stage.current='when';}
else{r={options:['Review my trends','Check product usage','Explore rewards'],text:'Noted — I will keep this with your logs. Want trends, usage, or rewards next?'};stage.current='feel';}
setLog(function(l){return [...l,{w:'ai',t:r.text,options:r.options||[]}];});
}catch(e){setLog(function(l){return [...l,{w:'ai',t:'Network hiccup — your logs are safe. Try again.'}]});}setBusy(false);};
const voiceNote=function(){
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR){setLog(function(l){return [...l,{w:'ai',t:'Voice needs browser speech support — type for now.'}]});return;}
try{const r=new SR();r.lang='en-IN';r.interimResults=false;setLive('listening');
r.onresult=function(e){const t=e.results[0][0].transcript;setLive('idle');send(t);};
r.onerror=function(){setLive('error');};r.onend=function(){setLive(function(s){return s==='listening'?'idle':s;});};r.start();rec.current=r;}catch(e){setLive('error');}};
const liveTalk=function(){
if(!('speechSynthesis' in window)){setLog(function(l){return [...l,{w:'ai',t:'Live voice needs speech support here — voice notes work instead.'}]});return;}
setLive('speaking');const u=new SpeechSynthesisUtterance('I am listening. How are you feeling today?');
u.onend=function(){setLive('idle');};window.speechSynthesis.speak(u);voiceNote();};
return<div>
{!entered?<div onClick={function(){setEntered(true);setTimeout(function(){if(input.current){input.current.focus();}},60);}} style={{textAlign:'center',padding:'12px 4px',cursor:'pointer'}}><Fairy size={96} wave={true}/><h3>Hey there! I'm happy you're here.</h3><p className="muted">Your little wellness corner is ready whenever you are.</p><p><b>Tap again to start our chat</b></p></div>
:<><div style={{display:'flex',gap:8,alignItems:'center'}}><Fairy size={30}/><div><b>AI Wellness Friend</b></div></div>
<div ref={box} style={{display:'grid',gap:8,maxHeight:260,overflow:'auto',marginTop:8}}>{log.map(function(m,i){return<div key={i} className="card" style={{background:m.w==='ai'?'#F7F5F0':'#E3F3E9'}}><b>{m.w==='ai'?'✦':'You'}:</b> {m.t}{m.options&&m.options.length>0&&<div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>{m.options.map(function(c){return<button key={c} className="chip" onClick={function(){send(c);}}>{c}</button>;})}</div>}</div>;})}{busy&&<p className="muted">thinking…</p>}</div>
<div style={{display:'flex',gap:8,marginTop:8}}><input ref={input} value={inp} onChange={function(e){setInp(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter'){send();}}} placeholder="Say it your way…" aria-label="Message" style={{flex:1}}/><button className="btn" onClick={function(){send();}}>Send</button></div>
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><button className="chip" onClick={voiceNote}>🎙️ Voice note{live==='listening'?' (listening…)':''}</button><button className="chip" onClick={liveTalk}>🔊 Live talk{live==='speaking'?' (speaking…)':''}</button><button className="chip" onClick={close}>Close</button></div>
{live==='error'&&<p className="muted">Mic denied or unsupported — text still works.</p>}
</>}</div>;
}
