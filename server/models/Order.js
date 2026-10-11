const mongoose=require('mongoose');
const Order=new mongoose.Schema({household:{type:String,default:'default'},orderRef:{type:String,required:true,unique:true},productId:{type:String,required:true},qty:{type:Number,default:1},purchaseDate:{type:String},status:{type:String,default:'linked'},deliveryStatus:{type:String,default:'unknown'},source:{type:String,default:'manual-link'}},{timestamps:true});
module.exports=mongoose.model('Order',Order);
