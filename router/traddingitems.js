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
})
module.exports = router
