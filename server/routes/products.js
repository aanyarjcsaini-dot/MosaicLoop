const r=require('express').Router();const PRODUCTS=require('../data/products.js');
r.get('/',(_,res)=>res.json(PRODUCTS));
r.get('/:sku',(req,res)=>{const p=PRODUCTS.filter(function(x){return x.sku===req.params.sku;})[0];
if(!p)return res.status(404).json({error:'unknown sku'});res.json(p);});
module.exports=r;
