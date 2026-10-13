import {useState} from 'react';import {CATS,catLabel,load,saveAll,setup,saveSetup,compress,milestones,insights} from '../lib/album.js';import {logDay,dayKey} from '../lib/shelf.js';
const TIPS=['Same lighting each week','Same angle and distance','No filters — originals only','Tie hair back for skin shots'];
export default function Album(){
const[entries,setEntries]=useState(load);const[st,setSt]=useState(setup);
const[filter,setFilter]=useState('all');const[detail,setDetail]=useState(null);
const[form,setForm]=useState(null);const[cmp,setCmp]=useState([]);const[slide,setSlide]=useState(50);const[err,setErr]=useState('');
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
{err&&<div className="card" style={{background:'#FDECEC'}}>{err}</div>}
<div className="card"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}><div><h3 style={{margin:0}}>Progress Album</h3><p className="muted" style={{margin:0}}>Next check-in: {next()} • private to this device</p></div><button className="btn" onClick={openAdd}>Add This Week’s Photos</button></div>
<div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}><button className={'chip'+(filter==='all'?' sel':'')} onClick={function(){setFilter('all');}}>All</button>{allowed.map(function(c){return<button key={c} className={'chip'+(filter===c?' sel':'')} onClick={function(){setFilter(c);}}>{catLabel(c)}</button>;})}</div></div>
<div className="card"><b>Milestones</b>{ms.length?ms.map(function(m){return<div key={m.id}>{m.done?'🏅':'○'} {m.label}{m.prog?' • '+m.prog:''}</div>;}):<p className="muted">No entries yet.</p>}<p className="muted">Weeks: {ins.weeks} • Photos: {ins.photos} • Since first: {ins.elapsed}d • Latest: {ins.latest||'—'} • Comparable pairs: {ins.pairs}</p><p className="muted">Factual activity only — photos alone never prove improvement (lighting and angles vary).</p></div>
{cmpPhotos.length===2&&<div className="card"><b>Before ↔ After • {catLabel(cmpPhotos[0].e.cat)} • {cmpPhotos[0].e.day} vs {cmpPhotos[1].e.day}</b>
<div style={{position:'relative',maxWidth:420}}><img src={cmpPhotos[1].url} alt="After" style={{width:'100%',borderRadius:12,display:'block'}}/><div style={{position:'absolute',top:0,left:0,width:slide+'%',overflow:'hidden'}}><img src={cmpPhotos[0].url} alt="Before" style={{width:'100%',maxWidth:420,borderRadius:12,display:'block'}}/></div>
<input type="range" min="0" max="100" value={slide} onChange={function(e){setSlide(Number(e.target.value));}} aria-label="Comparison slider" style={{width:'100%'}}/></div>
<p className="muted">Originals only — never retouched. <button onClick={function(){setCmp([]);}}>Clear</button></p></div>}
{shown.length?shown.map(function(e){return<div key={e.id} className="card"><b>Week of {e.day}</b> <span className="muted">• {catLabel(e.cat)}{e.note?' • “'+e.note.slice(0,40)+'”':''}</span>
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>{e.photos.map(function(p,pi){const k=e.id+':'+pi;return<img key={pi} src={p} alt={catLabel(e.cat)+' '+e.day} onClick={function(){setDetail({e:e,pi:pi});}} style={{width:96,height:96,objectFit:'cover',borderRadius:12,cursor:'pointer',outline:cmp.indexOf(k)>=0?'3px solid #0E3B2E':'none'}}/>;})}</div>
<div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}><button className="chip" onClick={function(){toggleCmp(e,0);if(e.photos[1]){toggleCmp(e,1);}}}>Compare</button><button className="chip" onClick={function(){setForm({id:e.id,cat:e.cat,day:e.day,note:e.note||'',photos:[],keep:e.photos});}}>Edit</button><button className="chip" onClick={function(){del(e.id);}}>Delete</button></div></div>;}):<div className="card"><p className="muted">No entries yet. Tap a photo to compare two — select any two thumbnails via Compare.</p></div>}
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
