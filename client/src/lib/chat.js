// Rule brain with real app context. Single swap point: callLLM(messages,ctx).
import {identityFor} from './wellness.js';
export function context(){
let entries=[],items=[],fb=[];
try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch{entries=[];}
try{items=JSON.parse(localStorage.getItem('shelf2')||'[]');}catch{items=[];}
try{fb=JSON.parse(localStorage.getItem('feedback')||'[]');}catch{fb=[];}
const last=[...entries].sort((a,b)=>a.ts<b.ts?-1:1).pop()||null;
return{entries:last?{ts:last.ts,day:last.day,picks:last.picks,identity:last.identity,note:last.note}:null,
counts:{checkins:entries.length,confirmedUses:items.flatMap(i=>i.confirmations||[]).length,feedback:fb.length},
shelf:items.map(i=>({pid:i.pid,start:i.startDate,conf:(i.confirmations||[]).length}))};
}
const ALLOW=['sleep','mood','energy','nutrition','skin','hair','activity','stress','hydration'];
export const QUICK_FEEL=['Happy','Tired','Stressed','Calm','Energetic','Something else'];
export const QUICK_HELP=['Understand my DNA','Review trends','Track habits','Check product usage','Find a product','When to restock','Explore rewards','Something else'];
export async function chatReply(q,hist=[]){
const ctx=context();const l=q.toLowerCase();
if(['marry','marriage','wedding','election','politics','stock','crypto','job offer'].some(k=>l.includes(k)))
return{chips:[],text:`Wellness only — I can use your actual logs for sleep, mood, energy, nutrition, skin, hair, activity, stress, hydration.`};
if(['severe','bleed','chest pain','depress','suicid','bald patch','heavy hairfall'].some(k=>l.includes(k)))
return{chips:['See doctor'],text:`That sounds heavy — I won't diagnose. Fixed ₹299 consult, free follow-up. I noted your recent ${ctx.entries?'check-in '+ctx.entries.day:'logs'} for them.`,escalate:true};
if(l.includes('why')&&(l.includes('sleepy owl')||l.includes('owl')||l.includes('today'))){
const p=ctx.entries?.picks||{};const bits=[];if(p.sleep!=null)bits.push(`sleep=${['deep','okay','late','rough'][p.sleep]}`);if(p.energy!=null)bits.push(`energy=${['full','half','low','empty'][p.energy]}`);
return{chips:['Sleep ↓','Energy ↓'],text:bits.length?`Sleepy Owl today from your log (${ctx.entries.day}): ${bits.join(', ')}. Records, not guess. Want a 7-day trend?`:`No check-in yet today — log once and I'll ground it.`};}
const found=ALLOW.filter(k=>l.includes(k));
if(found.length)return{chips:found.slice(0,4).map(k=>k+' •'),text:`From your ${ctx.counts.checkins} check-ins / ${ctx.counts.confirmedUses} confirmed uses: ${found.join(', ')} noted. ${followUp(found)} (estimates labeled, history real).`};
return{chips:QUICK_FEEL.slice(0,4),text:`I can read your DNA, trends, shelf, restock and rewards — all from your logs. What: DNA, trends, habits, usage, product, restock, rewards?`};
}
function followUp(f){
if(f.includes('sleep'))return'Last 3 nights — late, broken, short?';
if(f.includes('stress'))return'Driver — work, exams, travel, food?';
return'What changed — travel, work, food, routine?';
}
// export async function callLLM(messages,ctx){ /* real LLM here */ }
