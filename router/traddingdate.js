const express = require('express')
const router = express.Router()
const TraddingDate = require('../models/traddingDate')
const MonthSum = require('../models/monthSum')
const util = require('../util/util');

router.get('/getall',(req, res) => {
  TraddingDate.find({})
   .sort({ dayDate : -1})
   .then(async (traddingDateDays) => {
      let year = 2018;
      let yearAB = 0;
      let result = {};
      let monthOfDay = [31,30,31,30,31,31,30,31,30,31,28,31];
      // if(moment().isLeapYear(this.year)){
      //   this.monthOfDay[10] = 29;
      // }

      //按日统计盈亏
      for(let i=0; i < traddingDateDays.length;i++){
        let isProfit = false; 
        let rateProfit = 0;
        if(traddingDateDays[i].endNetAssets > traddingDateDays[i].startNetAssets){
          isProfit = true;
        }
        rateProfit = (traddingDateDays[i].endNetAssets - traddingDateDays[i].startNetAssets)/traddingDateDays[i].startNetAssets*100;
        rateProfit = rateProfit.toFixed(2);
        result[traddingDateDays[i].dayDate] = {};
        result[traddingDateDays[i].dayDate].isProfit = isProfit;
        result[traddingDateDays[i].dayDate].endNetAssets = traddingDateDays[i].endNetAssets;
        result[traddingDateDays[i].dayDate].startNetAssets = traddingDateDays[i].startNetAssets;
        result[traddingDateDays[i].dayDate].rateProfit = rateProfit;
      }
      //按月统计盈亏
      let monthStatic = {};
      let monthSum = await MonthSum.find({});
      for(let m=12;m>0;m--){
        let monthDate = year+util.fix0(m);
        monthStatic[monthDate] = {};
        for(let x =0;x<monthSum.length;x++){
          if(monthSum[x].monthDate == monthDate){
            monthStatic[monthDate].startNetAssets = monthSum[x].startNetAssets;
            monthStatic[monthDate].endNetAssets = monthSum[x].endNetAssets;
            //当前月，未结算的
            if(monthSum[x].endNetAssets ==0){
              monthStatic[monthDate].endNetAssets = traddingDateDays[0].endNetAssets;
            }
            monthStatic[monthDate].monthDesc = monthSum[x].monthDesc;
            let profit = monthStatic[monthDate].endNetAssets - monthStatic[monthDate].startNetAssets;
            let rateProfit = (profit)/monthStatic[monthDate].startNetAssets*100;
            rateProfit = rateProfit.toFixed(2);
            monthStatic[monthDate].profitAB = profit;
            yearAB += profit;
            monthStatic[monthDate].rateProfit = rateProfit;
            continue;
          }
        }
        monthStatic[monthDate].winDaysCount = 0;
        monthStatic[monthDate].winRate = 0;
        monthStatic[monthDate].lossDaysCount = 0;
        monthStatic[monthDate].lossRate = 0;
        monthStatic[monthDate].hasData = false;
        for(let d=0;d<=monthOfDay[m-1];d++){
          if(result[monthDate+util.fix0(d)]){
            monthStatic[monthDate].hasData = true;
            let dayData = result[monthDate+util.fix0(d)];
            if(dayData.isProfit){
              monthStatic[monthDate].winDaysCount++;
              monthStatic[monthDate].winRate += parseFloat(dayData.rateProfit);
            }else{
              monthStatic[monthDate].lossDaysCount++;
              monthStatic[monthDate].lossRate += parseFloat(dayData.rateProfit);
            }
          }
        }
      }
      res.json({result,monthStatic,yearAB}) 
   })
   .catch(err => {
     res.json(err)
   })
});

module.exports = router
