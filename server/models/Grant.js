const mongoose=require('mongoose');
module.exports=mongoose.model('Grant',new mongoose.Schema({household:{type:String,default:'default'},ruleId:String,points:{type:Number,default:0},status:{type:String,default:'redeemed'}},{timestamps:true}));
