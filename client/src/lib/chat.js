// Rule brain with real app context. Single swap point: callLLM(messages,ctx).
function ctx(){
let entries=[],items=[],fb=[],album=[];
try{entries=JSON.parse(localStorage.getItem('entries')||'[]');}catch(e){entries=[];}
try{items=JSON.parse(localStorage.getItem('shelf2')||'[]');}catch(e){items=[];}
try{fb=JSON.parse(localStorage.getItem('feedback')||'[]');}catch(e){fb=[];}
try{album=JSON.parse(localStorage.getItem('album')||'[]');}catch(e){album=[];}
const sorted=entries.slice().sort(function(a,b){return a.ts<b.ts?-1:1;});
const last=sorted[sorted.length-1]||null;
return{entries:last?{ts:last.ts,day:last.day,picks:last.picks,identity:last.identity}:null,
counts:{checkins:entries.length,confirmedUses:items.reduce(function(a,i){return a+((i.confirmations||[]).length);},0),feedback:fb.length,albums:album.length,photos:album.reduce(function(a,x){return a+((x.photos||[]).length);},0)}};
}
function signalOf(text){
const l=text.toLowerCase();
if(l.indexOf('sleep')>=0||l.indexOf('insomnia')>=0||l.indexOf('awake')>=0){return'sleep';}
if(l.indexOf('stress')>=0||l.indexOf('anxious')>=0||l.indexOf('overthink')>=0||l.indexOf('worry')>=0||l.indexOf('pressure')>=0){return'stress';}
if(l.indexOf('eat')>=0||l.indexOf('food')>=0||l.indexOf('diet')>=0||l.indexOf('appetite')>=0){return'food';}
if(l.indexOf('skin')>=0||l.indexOf('pimple')>=0||l.indexOf('acne')>=0||l.indexOf('breakout')>=0||l.indexOf('rash')>=0){return'skin';}
if(l.indexOf('hair')>=0||l.indexOf('hairfall')>=0||l.indexOf('shed')>=0||l.indexOf('bald')>=0){return'hair';}
if(l.indexOf('tired')>=0||l.indexOf('exhaust')>=0||l.indexOf('energy')>=0||l.indexOf('fatigue')>=0||l.indexOf('drained')>=0){return'energy';}
if(l.indexOf('sad')>=0||l.indexOf('mood')>=0||l.indexOf('low')>=0||l.indexOf('down')>=0){return'mood';}
return'general';
}
const CAUSES={
energy:['Poor sleep','Stress or overthinking','Irregular eating habits','Changes in my body or routine','Something else'],
sleep:['Late screen time','Stress or overthinking','Food or caffeine timing','Changes in my body or routine','Something else'],
stress:['Work or exams','Family things','Sleep debt','Something else'],
food:['Skipped meals','Junk phases','Low appetite','Something else'],
skin:['A new product','Stress or less sleep','Food changes','Something in my routine','Something else'],
hair:['A stressful phase','A new product','Diet change','Something else'],
mood:['Less sleep','Stress load','Routine change','Something else'],
general:['Poor sleep','Stress or overthinking','Irregular eating habits','Changes in my body or routine','Something else']};
const FOLLOW={
'Poor sleep':'How many nights has this lasted — days, weeks, or longer?',
'Stress or overthinking':'What is weighing most — work, family, or sleep itself?',
'Late screen time':'What time do you usually put the phone away?',
'Sleep debt':'Want me to pull your 7-day sleep pattern from check-ins?',
'A new product':'Which product, and how long have you used it? I can open its Honest Check.'};
export async function chatReply(q){
const c=ctx();const l=q.toLowerCase();
if(['marry','marriage','wedding','election','politics','stock','crypto','job offer','exam result'].some(function(k){return l.indexOf(k)>=0;})){
return{options:[],text:'I stay in wellness only — sleep, mood, energy, food, skin, hair, stress. Tell me how you feel today?'};}
if(['severe','bleed','chest pain','depress','suicid','bald patch','heavy hairfall'].some(function(k){return l.indexOf(k)>=0;})){
return{options:['See a doctor'],text:'That sounds heavy — I will not guess. A fixed-price consult (no per-minute meter) with free follow-up fits here. I noted your recent '+(c.entries?('check-in on '+c.entries.day):'logs')+' for them.'};}
if(l.indexOf('album')>=0||l.indexOf('photo')>=0||l.indexOf('progress pic')>=0||l.indexOf('compare')>=0){
const n=c.counts.albums,ph=c.counts.photos;
return{options:['Add This Week’s Photos','How do I compare?'],text:n?('Your album holds '+n+' '+(n===1?'entry':'entries')+' and '+ph+' private '+(ph===1?'photo':'photos')+'. Open Album → tap any two thumbnails → Compare for a dated side-by-side. I never judge the photos — archive only.'):'Your album is empty — open the Album tab, pick skin or hair, and add this week’s photos. Same light, same angle, no filters.'};}
const s=signalOf(q);
if(l.indexOf('why')>=0&&(l.indexOf('owl')>=0||l.indexOf('bunny')>=0||l.indexOf('today')>=0)){
const p=c.entries?(c.entries.picks||{}):{};const bits=[];
if(p.sleep===0||p.sleep){bits.push('sleep='+['deep','okay','late','rough'][p.sleep]);}
if(p.energy===0||p.energy){bits.push('energy='+['full','half','low','empty'][p.energy]);}
return{options:[],text:bits.length?('From your log ('+c.entries.day+'): '+bits.join(', ')+'. Records, not guesses. Want the 7-day trend?'):'No check-in today yet — log once and I will ground it.'};}
const opts=CAUSES[s]||CAUSES.general;
return{options:opts,text:'What do you think could be causing it? Pick what fits — or just tell me more.'};
}
const KNOWLEDGE={
'Poor sleep':'What research consistently shows: a fixed wake time anchors sleep better than a fixed bedtime, morning daylight resets the body clock, and caffeine after midday plus late screens delay sleep onset. Which of these fits your week?',
'Stress or overthinking':'What helps most people: a 5-minute wind-down before bed, writing tomorrow’s list out of your head, and daylight movement. Avoidance (doomscrolling) usually feeds it. What is weighing most — work, family, or sleep itself?',
'Late screen time':'Blue-enriched light in the last hour suppresses melatonin and pushes sleep later. A practical fix researchers suggest: dim screens and switch to audio or paper 30–60 minutes before bed. What time do you usually put the phone away?',
'Food or caffeine timing':'Heavy late meals and afternoon caffeine fragment sleep, and skipped meals reliably crash next-day energy. Regular meal times plus a caffeine cutoff around noon is the standard advice. How regular are your meals?',
'Sleep debt':'Sleep debt repays slowly — one early night rarely fixes a week. The evidence-backed approach: shift bedtime earlier by 15 minutes every few nights. Want me to pull your 7-day sleep pattern from check-ins?',
'A new product':'New actives need 4–6 weeks for skin and about 3 months for hair routines; irritation in week one is a stop signal, not a phase. Which product, and how long have you used it? I can open its Honest Check.',
'Skipped meals':'Skipped meals reliably produce afternoon crashes and cravings. Anchoring two consistent meals matters more than any superfood. Which meals slip most often?',
'Work or exams':'Time pressure raises evening cortisol, which delays sleep and tightens the next day. Short breaks between sessions protect both focus and rest. What does your day look like?',
'Stress load':'Cumulative load shows up as broken sleep first. A short daily decompression ritual beats one big weekend reset. What has been heaviest lately?'};
export async function chatFollow(choice){
if(KNOWLEDGE[choice]){return{options:['Days','Weeks','Months','Not sure'],text:KNOWLEDGE[choice]};}
const q=(FOLLOW[choice]||'How long has this lasted — days, weeks, or longer?')+' Your logs ('+ctx().counts.checkins+' check-ins) stay in view as we talk.';
return{options:['Days','Weeks','Months','Not sure'],text:q};
}
// export async function callLLM(messages,c){ /* real LLM here */ }
