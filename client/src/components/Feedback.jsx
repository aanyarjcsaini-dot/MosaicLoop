import {useState} from 'react';
export default function Feedback(props){
const mode=props.mode,pid=props.pid,onDone=props.onDone;
const OPTS=mode==='restock'
?['Easy to use','Fits my routine','I like the texture or feel','Convenient packaging','Good overall experience','I noticed a benefit','Other']
:['I still have enough product left','The product did not meet my expectations','The price is too high','I want to try another product','I do not need it right now','Other'];
const[sel,setSel]=useState([]);const[txt,setTxt]=useState('');const[other,setOther]=useState('');
const toggle=function(o){setSel(function(s){return s.indexOf(o)>=0?s.filter(function(x){return x!==o;}):[...s,o];});};
const done=function(){
const reasons=sel.filter(function(o){return o!=='Other';});
if(sel.indexOf('Other')>=0&&other.trim()){reasons.push('Other: '+other.trim());}
else if(sel.indexOf('Other')>=0){reasons.push('Other');}
const fb={id:'fb'+Date.now(),pid:pid,mode:mode,reasons:reasons,comment:txt,ts:new Date().toISOString()};
try{const all=JSON.parse(localStorage.getItem('feedback')||'[]');
const dup=all.some(function(f){return f.pid===pid&&f.mode===mode&&JSON.stringify(f.reasons)===JSON.stringify(reasons)&&f.comment===txt;});
if(!dup){all.push(fb);localStorage.setItem('feedback',JSON.stringify(all));}}catch(e){}
try{fetch((import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'/reviews/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fb)}).catch(function(){});}catch(e){}
onDone(fb);};
return<div><h3>{mode==='restock'?'What are you loving about this product?':'What influenced your decision?'}</h3>
<p className="muted">Optional — skip anytime. Passing is not dissatisfaction.</p>
<div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{OPTS.map(function(o){return<button key={o} className={'chip'+(sel.indexOf(o)>=0?' sel':'')} onClick={function(){toggle(o);}}>{o}</button>;})}</div>
{sel.indexOf('Other')>=0&&<input value={other} onChange={function(e){setOther(e.target.value);}} placeholder="Your reason…" aria-label="Other reason" style={{width:'100%',marginTop:8}}/>}
<textarea value={txt} onChange={function(e){setTxt(e.target.value);}} placeholder="Optional written feedback or review…" aria-label="Optional feedback" style={{width:'100%',marginTop:8}}/>
<div style={{display:'flex',gap:8,marginTop:8}}><button className="btn" onClick={done}>Continue</button><button className="chip" onClick={function(){onDone(null);}}>Skip</button></div></div>;
}
