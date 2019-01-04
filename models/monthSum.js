const mongoose = require('mongoose')
const monthSum = mongoose.Schema({
    monthDate : { type:String, required : true },
    monthDesc:String,
    startNetAssets: Number,
    endNetAssets: Number, 
    created_at : { type : Date, default : Date.now },
    update_at : { type : Date, default : Date.now }
})
const MonthSum = module.exports = mongoose.model('MonthSum',monthSum)
