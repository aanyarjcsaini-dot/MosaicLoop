const r=require('express').Router();const Feedback=require('../models/Feedback');
r.post('/feedback',async(req,res)=>{try{const{pid,mode,reasons=[],reasonCodes=[],packagingIssue='',batch='',comment='',ts,purchaseRef=''}=req.body;
if(!pid||!mode)return res.status(400).json({error:'pid, mode required'});
const dup=await Feedback.findOne({pid,mode,reasons,comment,ts});if(dup)return res.json({ok:true,duplicate:true});
const doc=await Feedback.create({pid,mode,reasons,reasonCodes,packagingIssue,batch,comment,ts,purchaseRef});res.json({ok:true,doc});}catch(e){res.status(500).json({error:e.message});}});
r.get('/by-product',async(req,res)=>{const list=await Feedback.find({pid:req.query.pid||''}).sort({createdAt:-1}).limit(50);res.json(list);});
r.get('/summary',async(req,res)=>{
if(req.query.key!==(process.env.ADMIN_KEY||'demo-key'))return res.status(403).json({error:'bad key'});
const rows=await Feedback.aggregate([{$group:{_id:{sku:'$pid',reason:'$reasons'},count:{$sum:1}}},{$sort:{count:-1}}]);
res.json({demo:true,note:'Demo summary. Real data only, no samples mixed in.',rows});});
module.exports=r;
