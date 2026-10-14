export const CONCERNS=[
{id:'underarm-odour',label:'Underarm odour'},
{id:'underarm-darkness',label:'Underarm darkness / pigmentation'},
{id:'body-acne',label:'Body acne'},
{id:'strawberry-skin',label:'Strawberry skin / rough texture'},
{id:'hair-scalp',label:'Hair / scalp concerns'},
{id:'other',label:'Something else'}];
export const DURATIONS=[{id:'new',label:'Under 2 weeks'},{id:'weeks',label:'2 to 8 weeks'},{id:'months',label:'2+ months'}];
export const SKINS=[{id:'sensitive',label:'Sensitive'},{id:'normal',label:'Normal'},{id:'unsure',label:'Not sure'}];
export function match(concern,duration,skin,products){
if(concern==='other'){return[];}
const scored=products.filter(function(p){return(p.concerns||[]).indexOf(concern)>=0;}).map(function(p){
let s=1;if(duration==='months'&&p.typicalResultWindowWeeks){s+=1;}
return{p:p,s:s,why:'Matches '+concern.split('-').join(' ')+(duration==='months'?' with a longer history':'')+' and '+skin+' skin. Check the official page before deciding.'};});
return scored.sort(function(a,b){return b.s-a.s;}).slice(0,3);
}
