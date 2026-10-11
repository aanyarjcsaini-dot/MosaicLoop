import {useState} from 'react';import {chatReply} from '../lib/chat.js';
export default function Buddy({onClose}){
const[log,setLog]=useState([{w:'ai',t:'Hey — wellness only. Try: tired, bad sleep, breaking out.'}]);
const[inp,setInp]=useState('');const[busy,setBusy]=useState(false);
const send=async()=>{const q=inp.trim();if(!q||busy)return;setInp('');setLog(l=>[...l,{w:'you',t:q}]);setBusy(true);
const r=await chatReply(q,log);setLog(l=>[...l,{w:'ai',t:r.text,chips:r.chips}]);setBusy(false);};
return<div><div id="chatlog" style={{display:'grid',gap:8,maxHeight:280,overflow:'auto'}}>{log.map((m,i)=><div key={i} className="card" style={{background:m.w==='ai'?'#F7F5F0':'#E3F3E9'}}><b>{m.w==='ai'?'✦':'You'}:</b> {m.t}{m.chips?.length&&<div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>{m.chips.map(c=><span key={c} className="chip">{c}</span>)}</div>}</div>)}{busy&&<p className="muted">typing…</p>}</div>
<div style={{display:'flex',gap:8,marginTop:8}}><input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="I'm tired, sleep bad, breaking out…" aria-label="Ask AI friend" style={{flex:1}}/><button className="btn" onClick={send}>Ask</button></div>
<button onClick={onClose} style={{marginTop:8}}>Close</button></div>;
}
