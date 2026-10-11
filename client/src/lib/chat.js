// Rule mock now. Swap callLLM() with real API later — single function.
const ALLOW=['sleep','mood','energy','nutrition','skin','hair','activity','stress','hydration'];
export async function chatReply(q,hist=[]){
const l=q.toLowerCase();
if(['marry','marriage','wedding','election','politics','stock','crypto','job offer'].some(k=>l.includes(k)))
return{chips:[],text:`I stay in wellness only — sleep, mood, energy, nutrition, skin, hair, activity, stress, hydration. I can't help with that one.`};
if(['severe','bleed','chest pain','depress','suicid','bald patch','heavy hairfall'].some(k=>l.includes(k)))
return{chips:['See doctor'],text:`That sounds heavy — I won't guess. Please see a doctor (fixed ₹299, free follow-up). I noted sleep/stress for them.`,escalate:true};
const found=ALLOW.filter(k=>l.includes(k));
const chips=found.slice(0,4).map(k=>`${k[0].toUpperCase()+k.slice(1)} ${k==='skin'||k==='hair'?'↑':'↓'}`);
return{chips,text:chips.length?`Noted ${chips.join(' • ')}. ${followUp(found)}`:`Got it — in wellness I go deep. Tell me about sleep, stress, energy, hair, skin or food?`};
}
function followUp(f){
if(f.includes('sleep'))return'How were your last 3 nights — late, broken, or short?';
if(f.includes('stress'))return'What is driving it most — work, exams, travel, food?';
if(f.includes('hair')||f.includes('skin'))return'How long has this lasted — days or weeks?';
return'What changed recently — travel, work, food, routine?';
}
// export async function callLLM(messages){ /* plug real LLM here */ }
