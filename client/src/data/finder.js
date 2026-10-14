export const SKIN_TAP={id:'skin',t:'How has your skin been lately?',
opts:[{id:'clear',label:'Clear and calm'},{id:'breakouts',label:'Breaks out sometimes'},{id:'rough',label:'Rough or red often'},{id:'unsure',label:'Not sure'}]};
export const HAIR_TAP={id:'hair',t:'How have your hair and scalp been lately?',
opts:[{id:'healthy',label:'Strong and healthy'},{id:'shedding',label:'Shedding more than usual'},{id:'dandruff',label:'Dandruff or itch'},{id:'unsure',label:'Not sure'}]};
export const SKINS=[{id:'sensitive',label:'Sensitive'},{id:'normal',label:'Normal'},{id:'unsure',label:'Not sure'}];
export const CONCERNS=[
{id:'underarm-odour',label:'Underarm odour'},
{id:'underarm-darkness',label:'Underarm darkness / pigmentation'},
{id:'body-acne',label:'Body acne'},
{id:'strawberry-skin',label:'Strawberry skin / rough texture'},
{id:'hair-scalp',label:'Hair / scalp concerns'},
{id:'other',label:'Something else'}];
export const DURATIONS=[{id:'new',label:'Under 2 weeks'},{id:'weeks',label:'2 to 8 weeks'},{id:'months',label:'2+ months'}];
function concernsFor(skin,hair){
const out=[];
if(skin==='breakouts'){out.push('body-acne');}
if(skin==='rough'){out.push('strawberry-skin');}
if(skin==='unsure'){out.push('body-acne','strawberry-skin');}
if(hair==='shedding'||hair==='dandruff'){out.push('hair-scalp');}
if(hair==='unsure'){out.push('hair-scalp');}
return out;
}
export function matchTaps(skin,hair,sensitivity,products){
const want=concernsFor(skin,hair);
const hits=products.filter(function(p){return(p.concerns||[]).some(function(c){return want.indexOf(c)>=0;});});
const ranked=hits.map(function(p){
let note='Matches your '+skin+' skin notes';
if((p.concerns||[]).indexOf('hair-scalp')>=0&&(hair==='shedding'||hair==='dandruff')){note='Matches your '+hair+' hair notes';}
return{p:p,s:(skin==='unsure'||hair==='unsure')?1:2,why:note+' and '+sensitivity+' skin. Check the official page before deciding.'};});
return ranked.sort(function(a,b){return b.s-a.s;}).slice(0,3);
}
export function match(concern,duration,skin,products){
if(concern==='other'){return[];}
const scored=products.filter(function(p){return(p.concerns||[]).indexOf(concern)>=0;}).map(function(p){
let s=1;if(duration==='months'&&p.typicalResultWindowWeeks){s+=1;}
return{p:p,s:s,why:'Matches '+concern.split('-').join(' ')+(duration==='months'?' with a longer history':'')+' and '+skin+' skin. Check the official page before deciding.'};});
return scored.sort(function(a,b){return b.s-a.s;}).slice(0,3);
}
