const r=require('express').Router();
r.get('/',(req,res)=>{const mine=req.query.brand||'Be Bodywise';
const ids=mine.includes('Bodywise')?['mm','lj']:mine.includes('Man Matters')?['bw','lj']:['mm','bw'];
res.json({brand:mine,rewards:ids});});module.exports=r;
