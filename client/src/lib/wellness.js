export const Q=[
{k:'sleep',t:'How did you sleep?',o:['Slept really well','Pretty well','It was okay','Slept poorly'],e:['😴','🙂','😐','🥱'],v:[95,70,45,20]},
{k:'energy',t:'How is your energy?',o:['Full of energy','Feeling good','A little tired','Completely exhausted'],e:['⚡','🔋','🪫','🛋️'],v:[95,70,40,15]},
{k:'mood',t:'How is your mood?',o:['Bright','Okay','Low','Heavy'],e:['😊','🙂','😟','😣'],v:[90,70,45,20]},
{k:'stress',t:'How stressed are you?',o:['Calm','Fine','Loaded','Fried'],e:['🍃','🙂','😮‍💨','🤯'],v:[90,70,40,15]},
{k:'food',t:'How was your food / nutrition?',o:['Clean','Homely','Junk-ish','Skipped'],e:['🥗','🍲','🍕','⏭️'],v:[90,70,40,25]},
{k:'skin',t:'How is your skin today?',o:['Glowing','Okay','Meh','Upset'],e:['✨','🙂','😟','😣'],v:[90,70,45,20]}];
function isHigh(d,k,cut){const v=d[k];return (v === 0 ? 0 : (v || 0)) >= cut;}
function isLow(d,k,cut){const v=d[k];return (v === 0 ? 0 : (v || 0)) < cut;}
export const IDENTITIES=[
{id:'energy-bunny',name:'Energy Bunny',icon:'🐰',color:'#16A34A',test:function(d){return isHigh(d,'energy',75);},blurb:'High energy today — ride the wave gently.'},
{id:'sunshine-soul',name:'Sunshine Soul',icon:'☀️',color:'#D97706',test:function(d){return isHigh(d,'mood',75) && isHigh(d,'energy',60);},blurb:'Positive mood with good energy. Lovely combo.'},
{id:'calm-cloud',name:'Calm Cloud',icon:'☁️',color:'#0284C7',test:function(d){return isHigh(d,'stress',75);},blurb:'Calm and relaxed. Protect this peace.'},
{id:'sleepy-owl',name:'Sleepy Owl',icon:'🦉',color:'#4F46E5',test:function(d){return isLow(d,'sleep',50);},blurb:'Your energy seems low today. Take things gently and focus on habits that help you feel refreshed.'},
{id:'recharging-star',name:'Recharging Star',icon:'⭐',color:'#7C3AED',test:function(d){return isLow(d,'energy',35) && isHigh(d,'sleep',50);},blurb:'Feeling depleted despite rest — recovery mode is productive today.'},
{id:'consistency-champ',name:'Consistency Champ',icon:'🏅',color:'#059669',test:function(d,ctx){return ctx && ctx.streak >= 5 && isHigh(d,'sleep',55) && isHigh(d,'energy',55) && isHigh(d,'mood',55);},blurb:'Steady check-ins and steady signals. Quiet discipline.'}];
export function dnaOf(picks){const m={};for(let i=0;i<Q.length;i++){const q=Q[i];const idx=picks[q.k];if(idx === 0 || idx){m[q.k]=q.v[idx];}}return m;}
export function driversOf(picks){
const out=[];const LBL={sleep:'Sleep',energy:'Energy',mood:'Mood',stress:'Stress',food:'Food',skin:'Skin'};
for(let i=0;i<Q.length;i++){const q=Q[i];const idx=picks[q.k];if(idx === 0 || idx){out.push({key:q.k,label:LBL[q.k],choice:q.o[idx],score:q.v[idx]});}}
out.sort(function(a,b){return a.score-b.score;});return out;
}
export function identityFor(d,ctx){
if(!d || Object.keys(d).length < 3){return{id:'new-leaf',name:'New Leaf',icon:'🌱',color:'#65A30D',blurb:'A fresh reflection — keep checking in.'};}
for(let i=0;i<IDENTITIES.length;i++){const id=IDENTITIES[i];let ok=false;try{ok=id.test(d,ctx);}catch(e){ok=false;}if(ok){return{id:id.id,name:id.name,icon:id.icon,color:id.color,blurb:id.blurb};}}
return{id:'steady-builder',name:'Steady Builder',icon:'🧱',color:'#57534E',blurb:'Building quietly, one day at a time.'};
}
export function weekDist(entries){
const cut=new Date();cut.setDate(cut.getDate()-7);
const dims={};const total={};
entries.forEach(function(e){if(new Date(e.ts)<cut){return;}const p=e.picks||{};Object.keys(p).forEach(function(k){total[k]=(total[k]||0)+1;if(p[k]<=1){dims[k]=(dims[k]||0)+1;}});});
return Object.keys(total).map(function(k){return{key:k,pct:Math.round((dims[k]||0)/total[k]*100)};}).sort(function(a,b){return a.pct-b.pct;});
}
export function localDay(d){const dt=d || new Date();function p(n){return String(n).padStart(2,'0');}return dt.getFullYear() + '-' + p(dt.getMonth()+1) + '-' + p(dt.getDate());}
export function qualifyingWellness(entry){return entry && entry.picks && Object.keys(entry.picks).length >= 4;}
export function streakDays(days){
if(!days || !days.length){return{current:0,best:0};}
const set={};days.forEach(function(x){set[x]=1;});
const sorted=Object.keys(set).sort();
let best=1;let run=1;
for(let i=1;i<sorted.length;i++){const a=new Date(sorted[i-1]);const b=new Date(sorted[i]);const diff=Math.round((b-a)/864e5);if(diff===1){run++;if(run>best){best=run;}}else{if(diff>1){run=1;}}}
let current=0;let cur=new Date();
const today=localDay(cur);
if(!set[today]){cur.setDate(cur.getDate()-1);}
let guard=0;
while(set[localDay(cur)] && guard<400){current++;cur.setDate(cur.getDate()-1);guard++;}
return{current:current,best:best};
}
export function seedHist(){const h=[];const now=new Date();
for(let i=13;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);
const v=function(b){return Math.max(15,Math.min(95,b+((i*7)%9)-4));};
const dd=new Date(d);dd.setHours(9,5,0,0);
h.push({id:'seed-'+i,ts:dd.toISOString(),day:localDay(d),picks:{sleep:i%4,energy:(i+1)%4,mood:i%4,stress:(i%3),food:1,skin:1},note:'',demo:true});}
return h;}
function recentEntries(entries,n){const cut=new Date();cut.setDate(cut.getDate()-n);return entries.filter(function(e){return new Date(e.ts)>=cut;});}
function idxVals(list,key){const out=[];for(let i=0;i<list.length;i++){const p=list[i].picks||{};const v=p[key];if(v===0||v){out.push(v);}}return out;}
function avg(a){if(!a.length){return -1;}let s=0;for(let i=0;i<a.length;i++){s+=a[i];}return s/a.length;}
export function patternBullets(entries){
const r=recentEntries(entries,14);
if(r.length<3){return[];}
const out=[];
const sl=idxVals(r,'sleep');
if(sl.length>=3){let mn=sl[0],mx=sl[0];for(let i=1;i<sl.length;i++){if(sl[i]<mn){mn=sl[i];}if(sl[i]>mx){mx=sl[i];}}
if(mx-mn>=2){out.push('Sleep answers swung across the week — restful nights mixed with rough ones.');}
else if(avg(sl)>=2){out.push('Late or rough nights outnumber restful ones lately.');}
else{out.push('Sleep has been fairly steady across recent check-ins.');}}
const en=idxVals(r,'energy');
if(en.length>=3){const half=Math.floor(en.length/2);const a=en.slice(0,half),b=en.slice(half);
if(avg(b)>avg(a)+0.4){out.push('Energy is trending upward across recent days.');}
else if(avg(a)>avg(b)+0.4){out.push('Energy has been dipping across recent days.');}}
const st=idxVals(r,'stress');let load=0;for(let i=0;i<st.length;i++){if(st[i]>=2){load++;}}
if(st.length>=3&&load>=Math.ceil(st.length/2)){out.push('Loaded or fried stress showed up in most recent check-ins.');}
const days={};r.forEach(function(e){days[e.day]=1;});
const n=Object.keys(days).length;
if(n>=5){out.push('Checked in '+n+' distinct days — a steady rhythm.');}
return out.slice(0,3);
}
export function describeIdentity(id,entries){
const r=recentEntries(entries,14);
if(r.length<3){return{line:'Early days — a few more check-ins and clear patterns will appear here.',tip:'Tonight, try one anchor: same bedtime, screens off 20 minutes before.'};}
const sl=idxVals(r,'sleep');const inconsistent=(function(){if(sl.length<3){return false;}let mn=sl[0],mx=sl[0];for(let i=1;i<sl.length;i++){if(sl[i]<mn){mn=sl[i];}if(sl[i]>mx){mx=sl[i];}}return mx-mn>=2;})();
const n=r.length;
if(id==='calm-cloud'){
if(inconsistent){return{line:'Your recent responses show a calm routine across '+n+' check-ins, though sleep timing wobbles.',tip:'Tomorrow, keep one bedtime and unwind five minutes before it.'};}
return{line:'Your recent responses show a calm routine across '+n+' check-ins with steady sleep.',tip:'Tomorrow, protect it: same wind-down, same bedtime.'};}
if(id==='sleepy-owl'){
if(inconsistent){return{line:'Your check-ins link low energy days to an unsteady sleep routine.',tip:'Tomorrow, fix one thing: same bedtime, screens off 20 minutes before.'};}
return{line:'Low energy is showing up even though sleep looks steady — food and movement may matter more right now.',tip:'Tomorrow, try a daylight walk and regular meals.'};}
if(id==='energy-bunny'){return{line:'High-energy days are clustering — your routine is feeding them.',tip:'Tomorrow, anchor it: morning light and the same bedtime.'};}
if(id==='sunshine-soul'){return{line:'Bright moods are arriving with good energy and calmer days.',tip:'Tomorrow, repeat what worked: protect sleep and one calm hour.'};}
if(id==='recharging-star'){return{line:'Depletion is showing despite rest — recovery itself is the work right now.',tip:'Tomorrow, one tiny anchor only: water plus a ten-minute walk.'};}
if(id==='consistency-champ'){return{line:'Steady check-ins with steady signals — discipline is compounding.',tip:'Tomorrow, keep just the anchor habit; streaks survive ordinary days.'};}
return{line:'Your recent check-ins are building a baseline — patterns sharpen with each day.',tip:'Tomorrow, one anchor: same bedtime.'};
}
