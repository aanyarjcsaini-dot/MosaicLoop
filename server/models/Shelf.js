const mongoose=require('mongoose');
const Item=new mongoose.Schema({pid:String,startDate:String,perDayOverride:Number,expectedOverride:Number,confirmations:[String],snoozeUntil:String,lastPrompt:String,status:{type:String,default:'open'}},{_id:false});
module.exports=mongoose.model('Shelf',new mongoose.Schema({household:{type:String,default:'default'},items:{type:[Item],default:[]},updatedAt:{type:Date,default:Date.now}}));
