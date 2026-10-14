export function trialInfo(product,confirmCount,elapsedDays){
if(!product||!product.typicalResultWindowWeeks){return{known:false};}
const minD=product.typicalResultWindowWeeks.min*7,maxD=product.typicalResultWindowWeeks.max*7;
return{known:true,minW:product.typicalResultWindowWeeks.min,maxW:product.typicalResultWindowWeeks.max,
source:product.typicalResultWindowWeeks.source,confirmed:confirmCount,elapsed:elapsedDays,
left:Math.max(0,maxD-confirmCount),done:elapsedDays>=maxD,
consistency:elapsedDays>0?Math.round(confirmCount/Math.max(1,elapsedDays)*100):0};
}
export function trialLine(product,confirmCount,elapsedDays){
const t=trialInfo(product,confirmCount,elapsedDays);
if(!t.known){return'No typical window available for this product.';}
return'Many people notice changes around week '+t.minW+' to '+t.maxW+' with regular use (typical, varies by person). You are at day '+elapsedDays+' with '+confirmCount+' confirmed uses.';
}
