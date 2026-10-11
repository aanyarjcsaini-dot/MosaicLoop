const r=require('express').Router();const Checkin=require('../models/Checkin');
r.post('/',async(req,res)=>{try{const{brand,picks,dna,household}=req.body;
if(!brand||!picks||!dna)return res.status(400).json({error:'brand,picks,dna required'});
const doc=await Checkin.create({brand,picks,dna,household:household||'default'});res.json(doc);}catch(e){res.status(500).json({error:e.message});}});
r.get('/latest',async(req,res)=>{const doc=await Checkin.findOne({household:req.query.household||'default'}).sort({createdAt:-1});res.json(doc||null);});
module.exports=r;
