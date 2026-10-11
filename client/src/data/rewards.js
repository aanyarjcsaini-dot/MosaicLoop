// Configurable rewards. Points have no monetary value (no redemption policy).
export const REWARDS=[
{id:'wellness-7',type:'digital',kind:'badge',name:'7-Day Rhythm',habit:'wellness',required:7,points:50,image:'🌿',instructions:'Complete qualifying check-ins 7 days in a row.'},
{id:'wellness-10-trial',type:'trial',kind:'trial',name:'Wellness Trial Pack',habit:'wellness',required:10,points:0,image:'🎁',trialFor:{'Be Bodywise':'Little Joys Kids DHA Trial','default':'Be Bodywise Sleep Trial'},availability:'subject to stock',instructions:'Unlocks a trial from another Mosaic brand.'},
{id:'product-10',type:'digital',kind:'badge',name:'10-Day Routine',habit:'product',required:10,points:80,image:'💧',instructions:'Confirm “Used today” 10 days in a row.'},
{id:'product-14-trial',type:'trial',kind:'trial',name:'Routine Trial Pack',habit:'product',required:14,points:0,image:'🎁',trialFor:{'Be Bodywise':'Man Matters Hair Trial','default':'Little Joys DHA Trial'},availability:'subject to stock',instructions:'Unlocks a trial from another Mosaic brand.'}];
