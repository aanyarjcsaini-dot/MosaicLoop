const r=require('express').Router();
const ALLOW=['sleep','mood','energy','nutrition','skin','hair','activity','stress','hydration'];
r.post('/',(req,res)=>{const q=(req.body.q||'').toLowerCase();
if(['marry','marriage','election','politics','stock','crypto'].some(k=>q.includes(k)))return res.json({reply:'Wellness only — ask sleep/mood/energy/nutrition/skin/hair/activity/stress/hydration.'});
if(['severe','bleed','chest','depress','suicid'].some(k=>q.includes(k)))return res.json({reply:'Severe — see doctor ₹299 fixed, free follow-up. I noted signals.',escalate:true});
res.json({reply:'Noted '+ALLOW.filter(k=>q.includes(k)).join(', ')+'. Tell me sleep/stress/energy pattern?'});});
module.exports=r;
