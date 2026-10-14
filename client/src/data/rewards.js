// Configurable rewards. Points have no monetary value (no redemption policy).
export const REWARDS=[
{id:'wellness-7',type:'digital',kind:'badge',name:'7-Day Rhythm',habit:'wellness',required:7,points:50,image:'🌿',instructions:'Complete qualifying check-ins 7 days in a row.'},
{id:'wellness-10-trial',type:'trial',kind:'trial',name:'Wellness Trial Pack',habit:'wellness',required:10,points:0,image:'🎁',trialFor:{'Be Bodywise':'Little Joys Kids DHA Trial','default':'Be Bodywise Sleep Trial'},availability:'subject to stock',instructions:'Unlocks a trial from another Mosaic brand.'},
{id:'product-10',type:'digital',kind:'badge',name:'10-Day Routine',habit:'product',required:10,points:80,image:'💧',instructions:'Confirm “Used today” 10 days in a row.'},
{id:'product-14-trial',type:'trial',kind:'trial',name:'Routine Trial Pack',habit:'product',required:14,points:0,image:'🎁',trialFor:{'Be Bodywise':'Man Matters Hair Trial','default':'Little Joys DHA Trial'},availability:'subject to stock',instructions:'Unlocks a trial from another Mosaic brand.'}];
// Goal-completion medals. Thresholds configurable here — never hard-coded in UI.
export const MEDALS=[
{id:'medal-first',name:'First Steps',need:1,icon:'🥉',desc:'Complete any 1 goal in a day.'},
{id:'medal-double',name:'Double Down',need:2,icon:'🥈',desc:'Complete any 2 goals in a day.'},
{id:'medal-hattrick',name:'Hat-trick',need:3,icon:'🥇',desc:'Complete any 3 goals in a day.'}];
// Streak challenges. metric: checkinWeek | goalStreak | productStreak.
export const CHALLENGES=[
{id:'checkin-3',label:'Check in 3 days in a week',metric:'checkinWeek',need:3},
{id:'goal-3',label:'Complete goals 3 days in a row',metric:'goalStreak',need:3},
{id:'routine-7',label:'Keep a product routine 7 days',metric:'productStreak',need:7}];
// Coupons are SAMPLES supplied by no live integration — never presented as redeemable.
export const COUPONS=[
{id:'cpn-sleep',brand:'Be Bodywise',title:'Sleep Trial Pack',code:'SAMPLE-SLP-7',status:'sample',challenge:'goal-3',detail:'Free 7-night trial pack.',expiry:'No expiry (sample)'},
{id:'cpn-bw10',brand:'Be Bodywise',title:'10% Welcome Voucher',code:'SAMPLE-BW-10',status:'sample',challenge:'checkin-3',detail:'10% off one body-care order.',expiry:'No expiry (sample)'},
{id:'cpn-bwmini',brand:'Be Bodywise',title:'Body Care Mini Kit',code:'SAMPLE-BW-MINI',status:'sample',challenge:'routine-7',detail:'Free mini kit with next routine milestone.',expiry:'No expiry (sample)'}];
