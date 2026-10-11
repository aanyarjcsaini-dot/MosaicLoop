const r=require('express').Router();const Checkin=require('../models/Checkin');
r.post('/entry',async(req,res)=>{try{const{household='default',brandPref='Be Bodywise',entry}=req.body;
if(!entry||!entry.ts||!entry.day||!entry.picks)return res.status(400).json({error:'entry ts/day/picks required'});
let doc=await Checkin.findOne({household});if(!doc)doc=await Checkin.create({household,brandPref,entries:[entry]});
else{const i=doc.entries.findIndex(e=>e.ts===entry.ts);if(i>=0)doc.entries[i]=entry;else doc.entries.push(entry);doc.updatedAt=new Date();await doc.save();}
res.json({ok:true,count:doc.entries.length});}catch(e){res.status(500).json({error:e.message});}});
// legacy single-checkin post kept
r.post('/',async(req,res)=>{try{const{brand='Be Bodywise',picks={},dna={},household='default'}=req.body;
const entry={ts:new Date().toISOString(),day:new Date().toISOString().slice(0,10),picks,dna,identity:req.body.identity||null,note:'',productUse:false};
let doc=await Checkin.findOne({household});if(!doc)doc=await Checkin.create({household,brandPref:brand,entries:[entry]});else{doc.entries.push(entry);await doc.save();}
res.json(doc);}catch(e){res.status(500).json({error:e.message});}});
r.get('/latest',async(req,res)=>{const doc=await Checkin.findOne({household:req.query.household||'default'});res.json(doc||null);});
module.exports=r;
