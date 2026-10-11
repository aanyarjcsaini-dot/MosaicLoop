import {useRef,useState} from 'react';import {chatReply,QUICK_FEEL,QUICK_HELP} from '../lib/chat.js';import Fairy from './Fairy.jsx';
export default function Buddy({onClose}){
const[log,setLog]=useState([{w:'ai',t:'Hey — tap a feeling or type freely. Voice note or live talk supported where your browser allows.'}]);
const[inp,setInp]=useState('');const[busy,setBusy]=useState(false);const[live,setLive]=useState('idle');const rec=useRef(null);
const send=async(text)=>{const q=(text||inp).trim();if(!q||busy)return;setInp('');setLog(l=>[...l,{w:'you',t:q}]);setBusy(true);
try{const r=await chatReply(q,log);setLog(l=>[...l,{w:'ai',t:r.text,chips:r.chips}]);}catch{setLog(l=>[...l,{w:'ai',t:'Network hiccup — your logs are safe. Try again.'}]);}setBusy(false);};
const voiceNote=()=>{
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR){setLog(l=>[...l,{w:'ai',t:'Voice transcription needs microphone + browser speech support. Type for now — live voice doc lists requirements.'}]);return;}
try{const r=new SR();r.lang='en-IN';r.interimResults=false;setLive('listening');
r.onresult=e=>{const t=e.results[0][0].transcript;setLive('idle');setLog(l=>[...l,{w:'you',t:'🎙️ '+t}]);send(t);};
r.onerror=()=>{setLive('error');setLog(l=>[...l,{w:'ai',t:'Mic/transcription failed — check permission and try text.'}]);};
r.onend=()=>setLive(s=>s==='listening'?'idle':s);r.start();rec.current=r;}catch{setLive('error');}
};
const liveTalk=()=>{
if(!('speechSynthesis' in window)){setLog(l=>[...l,{w:'ai',t:'Live voice needs speech synthesis + recognition (see doc). Voice notes work now.'}]);return;}
setLive('speaking');const u=new SpeechSynthesisUtterance('I am listening. Tell me about sleep, energy, or stress.');
u.onend=()=>setLive('idle');window.speechSynthesis.speak(u);voiceNote();};
return<div>
<div style={{display:'flex',gap:8,alignItems:'center'}}><Fairy size={40}/><b>AI Wellness Friend</b><span className="muted">wellness only</span></div>
<div style={{display:'flex',gap:6,flexWrap:'wrap',margin:'8px 0'}}>{QUICK_FEEL.map(q=><button key={q} className="chip" onClick={()=>send(q)}>{q}</button>)}</div>
<div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{QUICK_HELP.map(q=><button key={q} className="chip" onClick={()=>send(q)}>{q}</button>)}</div>
<div style={{display:'grid',gap:8,maxHeight:240,overflow:'auto',marginTop:8}}>{log.map((m,i)=><div key={i} className="card" style={{background:m.w==='ai'?'#F7F5F0':'#E3F3E9'}}><b>{m.w==='ai'?'✦':'You'}:</b> {m.t}{m.chips?.length&&<div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>{m.chips.map(c=><button key={c} className="chip" onClick={()=>send(c)}>{c}</button>)}</div>}</div>)}{busy&&<p className="muted">processing…</p>}</div>
<div style={{display:'flex',gap:8,marginTop:8}}><input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type anything…" aria-label="Message" style={{flex:1}}/><button className="btn" onClick={()=>send()}>Send</button></div>
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><button className="chip" onClick={voiceNote}>🎙️ Voice note {live==='listening'?'(listening…)':''}</button><button className="chip" onClick={liveTalk}>🔊 Live talk {live==='speaking'?'(speaking…)':''}</button><button className="chip" onClick={onClose}>Close</button></div>
{live==='error'&&<p className="muted">Mic denied or unsupported — text still works.</p>}
</div>;
}
