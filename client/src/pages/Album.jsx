import {useEffect,useState} from 'react';import {Camera,Bell,BellOff} from 'lucide-react';import {CATS,catLabel,load,saveAll,setup,saveSetup,compress,milestones,insights} from '../lib/album.js';import {logDay,dayKey} from '../lib/shelf.js';
const TIPS=['Same lighting each week','Same angle and distance','No filters — originals only','Tie hair back for skin shots'];
export default function Album(){
const[entries,setEntries]=useState(load);const[st,setSt]=useState(setup);
const[filter,setFilter]=useState('all');const[detail,setDetail]=useState(null);
const[form,setForm]=useState(null);const[cmp,setCmp]=useState([]);const[slide,setSlide]=useState(50);const[err,setErr]=useState('');
const[rem,setRem]=useState(function(){try{return localStorage.getItem('album-rem')!=='0';}catch(e){return true;}});
const flipRem=function(){const v=!rem;setRem(v);try{localStorage.setItem('album-rem',v?'1':'0');}catch(e){}};
const wkNo=function(day){const all=entries.map(function(e){return e.day;}).sort();if(!all.length){return 1;}const first=new Date(all[0]);const d=new Date(day);return Math.floor((d-first)/6048e5)+1;};
const autoMile=function(span,label){const sorted=entries.slice().sort(function(a,b){return a.day<b.day?-1:1;});if(!sorted.length){return null;}
const first=sorted[0];const last=sorted[sorted.length-1];
if(first.id===last.id||((new Date(last.day)-new Date(first.day))/864e5)<span){return null;}
const same=sorted.filter(function(e){return e.cat===last.cat;});if(same.length<2){return null;}
const a=same[0],b=same[same.length-1];if(((new Date(b.day)-new Date(a.day))/864e5)<span){return null;}
return{a:a,b:b,label:label};};
const persist=function(list){try{saveAll(list);setEntries(list);}catch(e){setErr('Storage is full — delete an old entry to free space. Photos stay on this device only.');}};
const startSetup=function(cats,skip){const s={cats:cats,skipped:!!skip,at:new Date().toISOString()};saveSetup(s);setSt(s);};
if(!st){return<div className="card"><h3>Progress Album 📸</h3><p className="muted">Weekly photos to watch hair and skin over time. Private by design — never public, never shared with Family unless you explicitly allow it later.</p>
<p><b>What do you want to track?</b></p>{CATS.map(function(c){return<label key={c.id} style={{display:'block',margin:'6px 0'}}><input type="checkbox" defaultChecked={c.id==='skin'||c.id==='hair'} data-cat={c.id}/> {c.label}</label>;})}
<div style={{display:'flex',gap:8,marginTop:8}}><button className="btn" onClick={function(){const boxes=document.querySelectorAll('[data-cat]:checked');const cats=[];for(let i=0;i<boxes.length;i++){cats.push(boxes[i].getAttribute('data-cat'));}startSetup(cats.length?cats:['skin'],false);}}>Start tracking</button><button className="chip" onClick={function(){startSetup(['skin','hair'],true);}}>Skip for now</button></div></div>;}
const allowed=st.cats||['skin','hair'];
const shown=entries.filter(function(e){return filter==='all'||e.cat===filter;}).sort(function(a,b){return b.day.localeCompare(a.day);});
const ms=milestones(entries);const ins=insights(entries);
const next=function(){if(!entries.length){return'This week';}const last=entries.slice().sort(function(a,b){return b.day.localeCompare(a.day);})[0];const d=new Date(last.day);d.setDate(d.getDate()+7);return d.toISOString().slice(0,10);};
const openAdd=function(){setErr('');setForm({id:null,cat:allowed[0],day:dayKey(),note:'',photos:[],keep:[]});};
useEffect(function(){try{if(sessionStorage.getItem('album-autoadd')==='1'){sessionStorage.removeItem('album-autoadd');openAdd();}}catch(e){}},[]);
const onFiles=function(ev){const files=ev.target.files;if(!files||!files.length){return;}
const jobs=[];for(let i=0;i<files.length&&i<3;i++){jobs.push(compress(files[i]));}
Promise.all(jobs).then(function(urls){setForm(function(f){return Object.assign({},f,{photos:f.photos.concat(urls).slice(0,3)});});}).catch(function(e){setErr(e.message);});};
const saveForm=function(){
if(!form.photos.length&&!(form.keep&&form.keep.length)){setErr('Add at least one photo.');return;}
const entry={id:form.id||('a'+Date.now()),day:form.day,cat:form.cat,note:form.note,photos:form.photos.length?form.photos:form.keep,createdTs:new Date().toISOString()};
const list=form.id?entries.map(function(e){return e.id===form.id?entry:e;}):[...entries,entry];
persist(list);logDay(form.day,'photo: '+catLabel(form.cat)+' (album — not a check-in)');setForm(null);};
const del=function(id){if(!window.confirm('Delete this entry and its photos?')){return;}persist(entries.filter(function(e){return e.id!==id;}));setDetail(null);};
const toggleCmp=function(e,pi){const key=e.id+':'+pi;setCmp(function(c){if(c.indexOf(key)>=0){return c.filter(function(k){return k!==key;});}const n=[...c,key];return n.slice(-2);});};
const cmpPhotos=cmp.map(function(k){const parts=k.split(':');const e=entries.filter(function(x){return x.id===parts[0];})[0];return e?{e:e,url:e.photos[Number(parts[1])]}:null;}).filter(Boolean);
return<div style={{display:'grid',gap:12}}>
{err&&<div className="card" style={{background:'#FFE3EF'}}>{err}</div>}
<div className="card"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}><div><h3 style={{margin:0}}>Progress Album</h3><p className="muted" style={{margin:0}}>Next check-in: {next()} • private to this device</p></div><div style={{display:'flex',gap:8,alignItems:'center'}}><button aria-label="Take or upload photo" onClick={openAdd} style={{width:56,height:56,borderRadius:99,background:'#6F9676',color:'#fff',border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}><Camera size={24}/></button><button className="btn" onClick={openAdd}>Add This Week’s Photos</button></div></div>
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap',alignItems:'center'}}><button className={'chip'+(filter==='all'?' sel':'')} onClick={function(){setFilter('all');}}>All</button>{allowed.map(function(c){return<button key={c} className={'chip'+(filter===c?' sel':'')} onClick={function(){setFilter(c);}}>{catLabel(c)}</button>;})}<button className="chip" onClick={flipRem}><Bell size={14}/> {rem?'Reminders on':'Reminders off'}</button></div>
{rem&&next()!=='This week'&&next()<=dayKey()&&<p style={{marginTop:8}}>📸 Weekly photo due — tap 📷 to log it. (In-app reminder; push needs notification setup.)</p>}</div>
<div className="card"><b>Milestones</b>{ms.length?ms.map(function(m){return<div key={m.id}>{m.done?'🏅':'○'} {m.label}{m.prog?' • '+m.prog:''}</div>;}):<p className="muted">No entries yet.</p>}<p className="muted">Weeks: {ins.weeks} • Photos: {ins.photos} • Since first: {ins.elapsed}d • Latest: {ins.latest||'—'} • Comparable pairs: {ins.pairs}</p><p className="muted">Factual activity only — photos alone never prove improvement (lighting and angles vary).</p></div>
{[['m1','1-month',30],['m2','2-month',60]].map(function(m){const a=autoMile(m[2],m[1]);if(!a){return null;}
return<div key={m[0]} className="card" style={{background:'linear-gradient(135deg,#FFE3EF,#DCCEFF)'}}><b>🏅 {m[1]} milestone — {catLabel(a.b.cat)}</b><p className="muted">First: {a.a.day} → Latest: {a.b.day} • originals, dated</p>
<div style={{display:'flex',gap:8}}><img src={a.a.photos[0]} alt="first" style={{width:'48%',borderRadius:12}}/><img src={a.b.photos[0]} alt="latest" style={{width:'48%',borderRadius:12}}/></div>
<button className="chip" style={{marginTop:8}} onClick={function(){setCmp([a.a.id+':0',a.b.id+':0']);window.scrollTo({top:0});}}>Open slider compare</button></div>;})}
{cmpPhotos.length===2&&<div className="card"><b>Before ↔ After • {catLabel(cmpPhotos[0].e.cat)} • {cmpPhotos[0].e.day} vs {cmpPhotos[1].e.day}</b>
<div style={{position:'relative',maxWidth:420}}><img src={cmpPhotos[1].url} alt="After" style={{width:'100%',borderRadius:12,display:'block'}}/><div style={{position:'absolute',top:0,left:0,width:slide+'%',overflow:'hidden'}}><img src={cmpPhotos[0].url} alt="Before" style={{width:'100%',maxWidth:420,borderRadius:12,display:'block'}}/></div>
<input type="range" min="0" max="100" value={slide} onChange={function(e){setSlide(Number(e.target.value));}} aria-label="Comparison slider" style={{width:'100%'}}/></div>
<p className="muted">Originals only — never retouched. <button onClick={function(){setCmp([]);}}>Clear</button></p></div>}
{shown.length?function(){const groups={};shown.forEach(function(e){const w='Week '+wkNo(e.day);groups[w]=groups[w]||[];groups[w].push(e);});
return Object.keys(groups).sort(function(a,b){return Number(b.split(' ')[1])-Number(a.split(' ')[1]);}).map(function(w){return<div key={w}><p className="muted" style={{margin:'8px 0 0'}}><b>{w}</b></p>{groups[w].map(function(e){return<div key={e.id} className="card" style={{marginTop:6}}><b>{e.day}</b> <span className="muted">• {catLabel(e.cat)}{e.note?' • “'+e.note.slice(0,40)+'”':''}</span>
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>{e.photos.map(function(p,pi){const k=e.id+':'+pi;return<img key={pi} src={p} alt={catLabel(e.cat)+' '+e.day} onClick={function(){setDetail({e:e,pi:pi});}} style={{width:96,height:96,objectFit:'cover',borderRadius:12,cursor:'pointer',outline:cmp.indexOf(k)>=0?'3px solid #6F9676':'none'}}/>;})}</div>
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><button className="chip" onClick={function(){toggleCmp(e,0);if(e.photos[1]){toggleCmp(e,1);}}}>Compare</button><button className="chip" onClick={function(){setForm({id:e.id,cat:e.cat,day:e.day,note:e.note||'',photos:[],keep:e.photos});}}>Edit</button><button className="chip" onClick={function(){del(e.id);}}>Delete</button></div></div>;})}</div>;})}:<div className="card"><p className="muted">No entries yet. Tap 📷 to add this week.</p></div>}
{form&&<><div className="scrim" onClick={function(){setForm(null);}}/><div className="sheet"><h3>{form.id?'Edit entry':'New weekly entry'}</h3>
<p className="muted">Tips: {TIPS.join(' • ')}</p>
<div style={{display:'flex',gap:8,flexWrap:'wrap'}}><select value={form.cat} onChange={function(e){setForm(Object.assign({},form,{cat:e.target.value}));}} aria-label="Category">{allowed.map(function(c){return<option key={c} value={c}>{catLabel(c)}</option>;})}</select>
<input type="date" value={form.day} onChange={function(e){setForm(Object.assign({},form,{day:e.target.value}));}} aria-label="Photo date"/></div>
<label className="chip" style={{display:'block',marginTop:8}}>📷 Upload / Take photo (up to 3)<input type="file" accept="image/*" multiple onChange={onFiles} style={{display:'block',marginTop:6}}/></label>
<div style={{display:'flex',gap:8,marginTop:8}}>{(form.keep||[]).concat(form.photos).map(function(p,i){return<img key={i} src={p} alt="preview" style={{width:72,height:72,objectFit:'cover',borderRadius:10}}/>;})}</div>
<textarea value={form.note} onChange={function(e){setForm(Object.assign({},form,{note:e.target.value}));}} placeholder="Optional note…" aria-label="Note" style={{width:'100%',marginTop:8}}/>
<div style={{display:'flex',gap:8,marginTop:8}}><button className="btn" onClick={saveForm}>Save entry</button><button className="chip" onClick={function(){setForm(null);}}>Cancel</button></div>
<p className="muted">Private: stored on this device only for now. Deleting removes photos.</p></div></>}
{detail&&<><div className="scrim" onClick={function(){setDetail(null);}}/><div className="sheet"><img src={detail.e.photos[detail.pi]} alt="detail" style={{width:'100%',borderRadius:14}}/><p><b>{catLabel(detail.e.cat)}</b> • {detail.e.day}{detail.e.note?' • “'+detail.e.note+'”':''}</p>
<div style={{display:'flex',gap:8}}><button className="chip" onClick={function(){setForm({id:detail.e.id,cat:detail.e.cat,day:detail.e.day,note:detail.e.note||'',photos:[],keep:detail.e.photos});setDetail(null);}}>Edit / replace</button><button className="chip" onClick={function(){del(detail.e.id);}}>Delete</button><button className="chip" onClick={function(){setDetail(null);}}>Close</button></div></div></>}
</div>;
}
