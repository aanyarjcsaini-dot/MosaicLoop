const r=require('express').Router();const Order=require('../models/Order');
// Manual order linking (verified later via sync). Dedupe by orderRef.
r.post('/link',async(req,res)=>{try{const{household='default',orderRef,productId,qty=1}=req.body;
if(!orderRef||!productId)return res.status(400).json({error:'orderRef, productId required'});
const doc=await Order.findOneAndUpdate({orderRef},{household,productId,qty,status:'linked',source:'manual-link'},{upsert:true,new:true});
res.json({ok:true,status:'linked-unverified',order:doc});}catch(e){res.status(500).json({error:e.message});}});
// Official webhook receiver (requires WEBHOOK_SECRET + platform approval — see docs/COMMERCE.md).
r.post('/webhook',async(req,res)=>{try{
if(!process.env.WEBHOOK_SECRET)return res.status(501).json({error:'webhook not configured — see docs/COMMERCE.md'});
// TODO: verify signature, validate payment status, handle cancel/refund, dedupe by orderRef.
res.json({ok:false,reason:'validation not implemented'});}catch(e){res.status(500).json({error:e.message});}});
r.get('/',async(req,res)=>{const list=await Order.find({household:req.query.household||'default'}).sort({createdAt:-1}).limit(50);res.json(list);});
module.exports=r;
