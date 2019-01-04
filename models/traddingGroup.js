const mongoose = require('mongoose')
const traddingGroup = mongoose.Schema({
    items : Array,
    date:String,
    dateStart:String,
    dateEnd : String, 
    profit : Number,
    tradeBuyTimes:Number,
    tradeSellTimes:Number,
    tradCost:Number,
    platformCost:Number,
    traddingMentalStatic:{
        mistakeType:Array,//-1不提前界定风险,-2不设止损,-3不能系统获利了结,1\2\3正为反面
        fearType:Array//-1怕犯错、-2怕亏钱、-3怕错过机会、-4怕赚不到钱
    },
    created_at : { type : Date, default : Date.now },
    update_at : { type : Date, default : Date.now }
})
const TraddingGroup = module.exports = mongoose.model('TraddingGroup',traddingGroup)
