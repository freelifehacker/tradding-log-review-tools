const express = require('express')
const router = express.Router()
const TraddingItem = require('../models/traddingItem')
router.get('/getall', (req, res) => {
    TraddingItem.find({})
             .sort({ date : -1})
             .then(traddingitems => {
                 res.json(traddingitems)
             })
             .catch(err => {
                 res.json(err)
             })
});
router.get('/get/:date',(req, res) => {
    TraddingItem.find({date:req.params.date})
        .then(traddingDayDetail => {
            res.json(traddingDayDetail)
        })
        .catch(err => {
            res.json(err)
        })
});
//更新
router.put('/traddingitem/:id',(req,res) => {
    TraddingItem.findOneAndUpdate({ _id : req.params.id}
             ,{ $set : { 
                        traddingMentalStatic: {
                            mistakeType:req.body.mistakeType,
                            fearType: req.body.fearType
                        }
                    }
                 },{
                     new : true
                 })
             .then(item => res.json(item))
             .catch(err => res.json(err))
});

module.exports = router
