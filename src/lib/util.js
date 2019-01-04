const moment = require('moment');
module.exports =    {
    kline:{
        calculateMA(dayCount, data){
            var result = [];
            for (var i = 0, len = data.length; i < len; i++) {
                if (i < dayCount) {
                    result.push('-');
                    continue;
                }
                var sum = 0;
                for (var j = 0; j < dayCount; j++) {
                    sum += data[i - j][1];
                }
                result.push((sum / dayCount).toFixed(1));
            }
            return result;
        },
        splitData:function(d,timeType){
            let xData = d.map(function (item) {
                if(timeType=='min1'){
                    return moment(item[0]).format('HH:mm');
                }else{
                    return moment(item[0]).format('MM/DD');
                }
            });
            let values = d.map(function (item) {
                return [+item[1].toFixed(1), +item[2].toFixed(1), +item[3].toFixed(1), +item[4].toFixed(1)];
            });
            let volumns = d.map(function (item) {
                return item[8];
            });
            //波动区间
            let volatilityGap = d.map(function (item) {
                return (item[3] - item[4]).toFixed(1);
            });
            return {
                xData: xData,
                values: values,
                valuesHighlight:null,
                volumns: volumns,
                volatilityGap:volatilityGap,
            }
        },
        filterGapData:function(data,filter){
            filter.gap = parseInt(filter.gap)
            filter.maxUp = parseInt(filter.maxUp)
            filter.maxDown = parseInt(filter.maxDown)
            let valuesHighlight = data.values;
            if(filter.gap){
                valuesHighlight = valuesHighlight.map(function (item) {
                    return (item[2]-item[3]) > filter.gap ? item : [null,null,null,null];
                });    
            }
            if(filter.maxUp){
                valuesHighlight = valuesHighlight.map(function (item) {
                    return (item[1]-item[0]) > filter.maxUp ? item : [null,null,null,null];
                });     
                console.log(valuesHighlight)

            }
            if(filter.maxDown){
                valuesHighlight = valuesHighlight.map(function (item) {
                    return (item[0]-item[1]) > filter.maxDown ? item : [null,null,null,null];
                });     
            }
            
            data.valuesHighlight = valuesHighlight;
            return data;
        }
    }
}