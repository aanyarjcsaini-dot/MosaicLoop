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
{id:'energy-bunny',name:'Energy Bunny',test:function(d){return isHigh(d,'energy',75);},blurb:'High energy today — ride the wave gently.'},
{id:'sunshine-soul',name:'Sunshine Soul',test:function(d){return isHigh(d,'mood',75) && isHigh(d,'energy',60);},blurb:'Positive mood with good energy. Lovely combo.'},
{id:'calm-cloud',name:'Calm Cloud',test:function(d){return isHigh(d,'stress',75);},blurb:'Calm and relaxed. Protect this peace.'},
{id:'sleepy-owl',name:'Sleepy Owl',test:function(d){return isLow(d,'sleep',50);},blurb:'Your energy seems low today. Take things gently and focus on habits that help you feel refreshed.'},
{id:'recharging-star',name:'Recharging Star',test:function(d){return isLow(d,'energy',35) && isHigh(d,'sleep',50);},blurb:'Feeling depleted despite rest — recovery mode is productive today.'},
{id:'consistency-champ',name:'Consistency Champ',test:function(d,ctx){return ctx && ctx.streak >= 5 && isHigh(d,'sleep',55) && isHigh(d,'energy',55) && isHigh(d,'mood',55);},blurb:'Steady check-ins and steady signals. Quiet discipline.'}];
export function dnaOf(picks){const m={};for(let i=0;i<Q.length;i++){const q=Q[i];const idx=picks[q.k];if(idx === 0 || idx){m[q.k]=q.v[idx];}}return m;}
export function driversOf(picks){
const out=[];const LBL={sleep:'Sleep',energy:'Energy',mood:'Mood',stress:'Stress',food:'Food',skin:'Skin'};
for(let i=0;i<Q.length;i++){const q=Q[i];const idx=picks[q.k];if(idx === 0 || idx){out.push({key:q.k,label:LBL[q.k],choice:q.o[idx],score:q.v[idx]});}}
out.sort(function(a,b){return a.score-b.score;});return out;
}
export function identityFor(d,ctx){
if(!d || Object.keys(d).length < 3){return{id:'new-leaf',name:'New Leaf',blurb:'A fresh reflection — keep checking in.'};}
for(let i=0;i<IDENTITIES.length;i++){const id=IDENTITIES[i];let ok=false;try{ok=id.test(d,ctx);}catch(e){ok=false;}if(ok){return{id:id.id,name:id.name,blurb:id.blurb};}}
return{id:'steady-builder',name:'Steady Builder',blurb:'Building quietly, one day at a time.'};
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
