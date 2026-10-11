const r=require('express').Router();const Feedback=require('../models/Feedback');
r.post('/feedback',async(req,res)=>{try{const{pid,mode,reasons=[],comment='',ts,purchaseRef=''}=req.body;
if(!pid||!mode)return res.status(400).json({error:'pid, mode required'});
const dup=await Feedback.findOne({pid,mode,reasons,comment,ts});if(dup)return res.json({ok:true,duplicate:true});
const doc=await Feedback.create({pid,mode,reasons,comment,ts,purchaseRef});res.json({ok:true,doc});}catch(e){res.status(500).json({error:e.message});}});
r.get('/by-product',async(req,res)=>{const list=await Feedback.find({pid:req.query.pid||''}).sort({createdAt:-1}).limit(50);res.json(list);});
module.exports=r;
