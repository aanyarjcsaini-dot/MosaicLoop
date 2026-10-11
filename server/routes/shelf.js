const r=require('express').Router();const Shelf=require('../models/Shelf');
r.get('/',async(req,res)=>{const d=await Shelf.findOne({household:req.query.household||'default'});res.json(d||{items:[]});});
r.put('/',async(req,res)=>{const{household='default',items=[]}=req.body;const d=await Shelf.findOneAndUpdate({household},{items,updatedAt:new Date()},{upsert:true,new:true});res.json(d);});
r.post('/confirm',async(req,res)=>{const{household='default',itemId,day}=req.body;const d=await Shelf.findOne({household});if(!d)return res.status(404).json({error:'no shelf'});
const it=d.items.id(itemId);if(!it)return res.status(404).json({error:'no item'});
if(!it.confirmations.includes(day))it.confirmations.push(day);await d.save();res.json({ok:true});});
module.exports=r;
