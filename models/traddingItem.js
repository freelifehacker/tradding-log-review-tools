const mongoose = require('mongoose')
const traddingItem = mongoose.Schema({
  scode : { type:String, required : true },
  sname : String,
  date:{ type:String, required : true },
  time : String, 
  isNx : Boolean,
  isCall:Boolean,
  isBuy:Boolean,  
  quantity : String,
  price:Number,
  sumAmount:Number,
  tradCost:Number,
  commission:Number,
  platformCost:Number,
  moneyChange:Number,
  created_at : { type : Date, default : Date.now },
  update_at : { type : Date, default : Date.now }
})
const TraddingItem = module.exports = mongoose.model('TraddingItem',traddingItem)
