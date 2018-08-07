const mongoose = require('mongoose')
const traddingDate = mongoose.Schema({
  dayDate : { type:String, required : true },
  morningDesc:{type:String},
  nightDesc:{type:String},
  created_at : { type : Date, default : Date.now },
  update_at : { type : Date, default : Date.now }
})
const TraddingDate = module.exports = mongoose.model('TraddingDate',traddingDate)
