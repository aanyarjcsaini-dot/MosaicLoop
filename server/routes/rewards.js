const r=require('express').Router();const Grant=require('../models/Grant');
r.post('/grant',async(req,res)=>{try{const{household='default',ruleId,points=0}=req.body;
if(!ruleId)return res.status(400).json({error:'ruleId required'});
const dup=await Grant.findOne({household,ruleId});if(dup)return res.json({ok:true,duplicate:true});
await Grant.create({household,ruleId,points});res.json({ok:true});}catch(e){res.status(500).json({error:e.message});}});
r.get('/history',async(req,res)=>{res.json(await Grant.find({household:req.query.household||'default'}).sort({createdAt:-1}));});
module.exports=r;
