const express = require('express')
const router = express.Router()
const TraddingDate = require('../models/traddingDate')
router.get('/getall', (req, res) => {
  TraddingDate.find({})
       .sort({ dayDate : -1})
       .then(traddingDateDays => {
          let result = {};
          for(var i=0; i < traddingDateDays.length;i++){
            let isProfit = false; 
            let rateProfit = 0;
            if(traddingDateDays[i].endNetAssets > traddingDateDays[i].startNetAssets){
              isProfit = true;
            }
            rateProfit = (traddingDateDays[i].endNetAssets - traddingDateDays[i].startNetAssets)/traddingDateDays[i].startNetAssets*100;
            rateProfit = rateProfit.toFixed(2);
            result[traddingDateDays[i].dayDate] = {};
            result[traddingDateDays[i].dayDate].isProfit = isProfit;
            result[traddingDateDays[i].dayDate].rateProfit = rateProfit;
            // result[traddingDateDays[i].dayDate] = traddingDateDays[i];
            // console.log(result["20180102"].rateProfit)
          }
          res.json(result) 
       })
       .catch(err => {
         res.json(err)
       })
});

module.exports = router
