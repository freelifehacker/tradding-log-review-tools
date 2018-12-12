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
  isGrouped:{ type : Boolean, default : false },
  traddingMentalStatic:{
    mistakeType:Array,//-1不提前界定风险,-2不设止损,-3不能系统获利了结,1\2\3正为反面
    fearType:Array//-1怕犯错、-2怕亏钱、-3怕错过机会、-4怕赚不到钱
  },
  created_at : { type : Date, default : Date.now },
  update_at : { type : Date, default : Date.now }
})
const TraddingItem = module.exports = mongoose.model('TraddingItem',traddingItem)
