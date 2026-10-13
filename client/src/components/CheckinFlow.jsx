import {useState} from 'react';import axios from 'axios';import {Q,dnaOf,identityFor} from '../lib/wellness.js';import {PRODUCTS} from '../data/products.js';import {confirmProduct} from '../lib/shelf.js';import Petals from './Visuals.jsx';
const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export default function CheckinFlow(props){
const onSaved=props.onSaved||function(){};
const[step,setStep]=useState(0);const[cur,setCur]=useState({});
const[stage,setStage]=useState('ask');const[usedPids,setUsedPids]=useState([]);const[msg,setMsg]=useState('');
const q=Q[step];
const shelfPids=function(){try{return JSON.parse(localStorage.getItem('shelf2')||'[]');}catch(e){return[];}};
const togglePid=function(pid){setUsedPids(function(s){return s.indexOf(pid)>=0?s.filter(function(x){return x!==pid;}):[...s,pid];});};
const pick=function(i){const np={};Object.keys(cur).forEach(function(k){np[k]=cur[k];});np[q.k]=i;setCur(np);
if(step<Q.length-1){setStep(step+1);}else{setUsedPids([]);setStage('product');}};
const save=function(){
let entries=[];try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch(e){entries=[];}
const d=dnaOf(cur);const id=identityFor(d,{streak:0});
const ts=new Date().toISOString();
const entry={id:'e'+Date.now(),ts:ts,day:ts.slice(0,10),picks:cur,dna:d,identity:{id:id.id,name:id.name,icon:id.icon,color:id.color},productUse:usedPids.length>0,usedProducts:usedPids};
localStorage.setItem('entries',JSON.stringify([...entries,entry]));
usedPids.forEach(function(pid){confirmProduct(pid,ts.slice(0,10));});
setCur({});setStep(0);setUsedPids([]);setStage('done');setMsg('Saved — DNA updated instantly');
try{axios.post(API+'/checkins/entry',{household:'default',brandPref:localStorage.getItem('brandPref')||'Be Bodywise',entry:entry}).catch(function(){});}catch(e){}
onSaved(entry);
};
const again=function(){setStage('ask');setStep(0);setMsg('');};
return<div style={{display:'grid',gap:12}}>
{stage==='ask'&&<div className="card"><p className="muted">Question {step+1}/{Q.length} • under 60 seconds</p>
<div style={{height:8,background:'#EFE9F5',borderRadius:99}}><div style={{width:((step+1)/Q.length*100)+'%',height:'100%',background:'#6F9676',borderRadius:99}}/></div>
<h3>{q.t}</h3><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{q.o.map(function(o,i){return<button key={o} className="chip" onClick={function(){pick(i);}}>{q.e[i]} {o}</button>;})}</div></div>}
{stage==='product'&&<div className="card"><h3>Did you use your products today?</h3><p className="muted">Tap each one you used — tap again to undo. Feeds each product's own streak.</p>
{function(){const items=shelfPids();return items.length?items.map(function(it){const p=PRODUCTS.filter(function(x){return x.id===it.pid;})[0];const on=usedPids.indexOf(it.pid)>=0;
return<button key={it.id} className="chip" style={{display:'block',width:'100%',marginTop:6,background:on?'#6F9676':'#FFFCF6',color:on?'#fff':'#554B60',borderColor:on?'#6F9676':'#D9CCE9'}} onClick={function(){togglePid(it.pid);}}>{p?p.img+' ':''}{p?p.name:it.pid} {on?'✓':''}</button>;}):<p className="muted">No products tracked yet — add some in My Shelf first.</p>}()}
<div style={{display:'flex',gap:8,marginTop:10}}><button className="btn" onClick={function(){setStage('save');}}>Continue</button></div></div>}
{stage==='save'&&<div className="card"><h3>Save check-in?</h3><p className="muted">{Object.keys(cur).length} answers • products used: {usedPids.length?usedPids.length:'none'}</p>
<div style={{display:'flex',gap:8}}><button className="btn" onClick={save}>Save Check-in</button></div>{msg&&<p className="muted">{msg}</p>}</div>}
{stage==='done'&&<div className="card" style={{textAlign:'center'}}><p style={{fontSize:40}}>🌱</p><h3>Saved ✓</h3><p className="muted">{msg}</p><button className="btn" onClick={again}>Check in again</button></div>}
</div>;
}
