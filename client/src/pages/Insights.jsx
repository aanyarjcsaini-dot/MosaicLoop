import {useState} from 'react';import {qualifyingWellness} from '../lib/wellness.js';import {evaluateMedals} from '../lib/rewards.js';
function readEntries(){try{return JSON.parse(localStorage.getItem('entries')||'[]');}catch(e){return[];}}
function last7(list){const c=new Date();c.setDate(c.getDate()-7);return list.filter(function(e){return new Date(e.ts)>=c;});}
function report(list){
const r=last7(list);
if(r.filter(qualifyingWellness).length<3){return{ready:false,text:'Not much to go on yet — complete a few more check-ins and your personal report will appear here.'};}
const dims={sleep:0,energy:0,mood:0,stress:0,food:0,skin:0};const low={sleep:0,energy:0,mood:0};
const keys=Object.keys(dims);
for(let ji=0;ji<r.length;ji++){const p=r[ji].picks||{};for(let ki=0;ki<keys.length;ki++){const k=keys[ki];const v=p[k];const has=(v===0||v===1||v===2||v===3);if(!has){continue;}dims[k]++;if((k==='sleep'||k==='energy'||k==='mood')&&v>=2){low[k]++;}}}
const topics=[];if(dims.sleep>=2){topics.push('sleep');}if(dims.stress>=2){topics.push('stress management');}if(dims.energy>=2){topics.push('energy');}if(dims.mood>=2){topics.push('mood');}
const worst=Object.keys(low).sort(function(a,b){return low[b]-low[a];})[0];
let tip='Try maintaining a consistent bedtime and taking a short break during the day.';
if(worst==='sleep'){tip='Try a fixed bedtime and screens off 20 minutes before sleep.';}
else if(worst==='energy'){tip='Try a short daylight walk and regular meals tomorrow.';}
else if(worst==='mood'){tip='Try five minutes reflecting on your mood before bed.';}
const t=topics.length?topics.join(' and '):'general wellbeing';
return{ready:true,text:'You checked in '+r.length+' times this week, mostly about '+t+'. '+(low[worst]>=2?'Lower '+worst+' answers showed up more than once — rest and recovery may be worth prioritising. ':'Patterns look fairly steady. ')+tip};
}
const GOALS=[
{id:'walk',t:'Take a 10-minute walk',why:'sleep,energy'},
{id:'water',t:'Drink water at regular intervals',why:'energy'},
{id:'break',t:'Take a short break between work or study',why:'stress,mood'},
{id:'bedtime',t:'Follow a consistent bedtime routine',why:'sleep'},
{id:'checkin',t:"Complete today's wellness check-in",why:'rhythm'},
{id:'mood',t:'Spend five minutes reflecting on your mood',why:'mood'},
{id:'skincare',t:'Gentle evening cleanse + moisturize',why:'skin'},
{id:'product',t:'Confirm today’s product use',why:'routine'}];
function pickGoals(list){
const r=last7(list);
const low={sleep:0,energy:0,mood:0,stress:0,skin:0};
r.forEach(function(e){const p=e.picks||{};['sleep','energy','mood','stress','skin'].forEach(function(k){if((p[k]===0||p[k])&&p[k]>=2){low[k]++;}});});
const today=new Date().toISOString().slice(0,10);
const doneToday=list.some(function(e){return e.day===today;});
let shelf=[];try{shelf=JSON.parse(localStorage.getItem('shelf2')||'[]');}catch(e){shelf=[];}
const score=function(g){
if(g.id==='checkin'){return doneToday?-1:100;}
if(g.id==='bedtime'){return 60+low.sleep*15;}
if(g.id==='break'){return 55+low.stress*15;}
if(g.id==='walk'){return 50+low.energy*12;}
if(g.id==='mood'){return 45+low.mood*12;}
if(g.id==='skincare'){return 48+low.skin*15;}
if(g.id==='product'){return shelf.length?48:-1;}
return 40;};
const ranked=GOALS.map(function(g){return{g:g,s:score(g)};}).filter(function(x){return x.s>=0;}).sort(function(a,b){return b.s-a.s;});
let picked=ranked.filter(function(x){return x.s>=45;}).slice(0,6).map(function(x){return x.g;});
if(picked.length<2){
['walk','water'].forEach(function(id){if(picked.length<3){const g=GOALS.filter(function(x){return x.id===id;})[0];if(g&&picked.indexOf(g)<0){picked.push(g);}}});}
return picked;
}
export default function Insights(){
const[list]=useState(readEntries);
const[done,setDone]=useState(function(){try{return JSON.parse(localStorage.getItem('goals')||'{}');}catch(e){return{};}});
const rep=report(list);const goals=pickGoals(list);
const today=new Date().toISOString().slice(0,10);
const td=done[today]||{};
const toggle=function(id){const n=Object.assign({},done);n[today]=Object.assign({},td);if(n[today][id]){delete n[today][id];}else{n[today][id]=1;}setDone(n);localStorage.setItem('goals',JSON.stringify(n));
const count=Object.keys(n[today]).length;const fresh=evaluateMedals(count);if(fresh.length){setCheer(fresh);}};
const[cheer,setCheer]=useState([]);
const ndone=goals.filter(function(g){return td[g.id];}).length;
return<div style={{display:'grid',gap:12}}>
<div><h1 className="pagehead">Wellness Insights</h1><p className="muted">Your week, explained. Analytical — never medical advice.</p></div>
<div className="card" style={{background:'linear-gradient(135deg,#E6E0FF,#EFFBDB)'}}><h3 className="sec-title">Your 7-day report</h3><p>{rep.text}</p></div>
{cheer.length>0&&<div className="card pop" style={{background:'linear-gradient(135deg,#EFFBDB,#E6E0FF)',textAlign:'center'}}><h3>🏅 Medal earned!</h3>{cheer.map(function(m){return<p key={m.id}><b>{m.icon} {m.name}</b> — {m.desc}</p>;})}<button className="chip" onClick={function(){setCheer([]);}}>Nice!</button></div>}
<div className="card"><h3 className="sec-title">Today's Goals ({ndone}/{goals.length})</h3>
<div style={{height:8,background:'#E4E2F5',borderRadius:99,margin:'6px 0'}}><div style={{width:(goals.length?ndone/goals.length*100:0)+'%',height:'100%',background:'#6C7CFF',borderRadius:99}}/></div>
{goals.map(function(g){const on=!!td[g.id];return<button key={g.id} className="chip" style={{display:'block',width:'100%',marginTop:6,textAlign:'left',background:on?'#C6F36B':'#fff',borderColor:on?'#5FA832':'#E3DCFF'}} onClick={function(){toggle(g.id);}}>{on?'✓ ':'○ '}{g.t}</button>;})}
<p className="muted">Completions are saved daily and shape tomorrow's goals.</p></div>
</div>;
}
