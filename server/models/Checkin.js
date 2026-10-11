const mongoose=require('mongoose');
const Checkin=new mongoose.Schema({brand:{type:String,enum:['Be Bodywise','Little Joys','Man Matters','Root Labs'],required:true},picks:{type:Object,required:true},dna:{type:Object,required:true},household:{type:String,default:'default'},createdAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('Checkin',Checkin);
