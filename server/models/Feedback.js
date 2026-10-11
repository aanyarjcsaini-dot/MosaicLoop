const mongoose=require('mongoose');
module.exports=mongoose.model('Feedback',new mongoose.Schema({pid:String,mode:{type:String,enum:['restock','pass']},reasons:[String],comment:String,ts:{type:String},purchaseRef:String},{timestamps:true}));
