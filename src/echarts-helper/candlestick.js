const kline = require('../lib/util.js').kline;
const _ = require('underscore');
const colorConfig = {
    normal: {
        color: '#ec0000',
        color0: '#00da3c',
        borderColor: '#8A0000',
        borderColor0: '#008F28',
    },
    fade: {
        color: '#aaa',
        color0: '#aaa',
        borderColor: '#aaa',
        borderColor0: '#aaa',
    }
};

const sortTradIndex = {
    WMSR:function(n,values){
        // console.log(values)
        let WR = [];
        let valueMoc = _.clone(values);
        for(let i =0;i < values.length;i++){
            let gapData = _.last(valueMoc,n);
            if(gapData.length == n){
                let gapDataHigh = [];
                let gapDataLow = [];
                for(let j=0;j<n;j++){
                    gapDataHigh[j] = gapData[j][2];
                    gapDataLow[j] = gapData[j][3];
                }
                WR[values.length-i] = ((_.max(gapDataHigh)-gapData[n-1][1])/(_.max(gapDataHigh)-_.min(gapDataLow))*100).toFixed(3);                
            }
            valueMoc.pop();
        }
        return WR;
    },
    RSI:function(n,values){
        let n_p1 = n+1;
        let RSI = [1,2,3];
        let valueMoc = _.clone(values);

        let SMMA1 = function(sum,n){
            return sum/n;
        }
        let SMMA = function(sum,n,all,i){
            return (sum-SMMA1(sum,n)+all[i])/n;
        };
        // for(let i =0;i < values.length;i++){
            let gapData = _.last(valueMoc,n_p1);
            if(gapData.length == n_p1){
                let upSum = 0;
                let downSum = 0;
                let upAll = [];
                let downAll = [];
                for(let j=(n);j>=1;j--){
                    dayChange = Math.round(gapData[j][1])-Math.round(gapData[j-1][1]);
                    console.log(dayChange)
                    if(dayChange>=0){
                        upSum += dayChange;
                        upAll.push(dayChange);
                    }else{
                        downSum += -dayChange
                        downAll.push(-dayChange);
                    }
                }
                if(upAll.length>0){
                    var sumUPSMMA = 0;
                    for(let j=0;j<upAll.length;j++){
                        sumUPSMMA += SMMA(upSum,n,upAll,j);
                    }
                }
                if(downAll.length>0){
                    var sumDOWNSMMA = 0;
                    for(let j=0;j<downAll.length;j++){
                        sumDOWNSMMA += SMMA(downSum,n,downAll,j);
                    }
                }

                let rs = parseFloat(upSum/downSum).toFixed(3)*100;
                console.log(rs);
                // let rsi = 100-100/(1+rs);
                // console.log(rsi)
                // RSI[values.length-i] = 100 - (100/(1+rs));
            }
            // 60.542
            // valueMoc.pop();
        // }
        // console.log(RSI)
        return RSI;
    }
}

module.exports =    {
    candlestickHelper:{
        getSeries:function(data){
            let series = [{
                type: 'candlestick',
                name: '日K',
                data: data.values,
                itemStyle: {
                    normal: data.valuesHighlight ? colorConfig.fade : colorConfig.normal
                },
                markLine: {
                    symbol: ['none', 'none'],
                    data: [
                        [
                            {
                                name: 'from lowest to highest',
                                type: 'min',
                                valueDim: 'lowest',
                                symbol: 'circle',
                                symbolSize: 10,
                                label: {
                                    normal: {show: false},
                                    emphasis: {show: false}
                                }
                            },
                            {
                                type: 'max',
                                valueDim: 'highest',
                                symbol: 'circle',
                                symbolSize: 10,
                                label: {
                                    normal: {show: false},
                                    emphasis: {show: false}
                                }
                            }
                        ],
                        {
                            name: 'min line on close',
                            type: 'min',
                            valueDim: 'close'
                        },
                        {
                            name: 'max line on close',
                            type: 'max',
                            valueDim: 'close'
                        }
                    ]
                },
            }];
            if(data.valuesHighlight){
                series.push({
                    type: 'candlestick',
                    name: '日K',
                    data: data.valuesHighlight,
                    itemStyle: {
                        normal: colorConfig.normal
                    }
                })
            }
            series.push({
                name: 'MA5',
                type: 'line',
                data: kline.calculateMA(5, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            })
            series.push({
                name: 'MA10',
                type: 'line',
                data: kline.calculateMA(10, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            })
            series.push({
                name: 'MA20',
                type: 'line',
                data: kline.calculateMA(20, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            })
            series.push({
                name: 'MA30',
                type: 'line',
                data: kline.calculateMA(30, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            })
            series.push({
                name: 'Volumn',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data.volumns
            })
            //WMSR
            series.push({
                name: 'WMSR1',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2, 
                data: sortTradIndex.WMSR(6,data.values)
            })
            series.push({
                name: 'WMSR2',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2, 
                data: sortTradIndex.WMSR(13,data.values)
            });
            //RSI
            series.push({
                name: 'RSI1',
                type: 'line',
                xAxisIndex: 3,
                yAxisIndex: 3, 
                data: sortTradIndex.RSI(6,data.values)
            });
            return series;
        },
        getMin1Series:function(data,traddingData){
            let series = [];
            let traddingMarkPoint = []
            if(traddingData && traddingData.length>0){
                for(let i=0;i<traddingData.length;i++){
                    var markPointRow = {};
                    markPointRow.value = traddingData[i].isBuy ? '买':'卖';
                    markPointRow.value += traddingData[i].isCall ? '牛':'熊';
                    markPointRow.name = 'x';
                    var time = traddingData[i].time.slice(0,5);
                    for(let t=0;t<data.xData.length;t++){
                        if(time == data.xData[t]){
                            markPointRow.coord=[t,data.values[t][0]];
                            break;
                        }
                    }
                    // markPointRow.symbol = 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
                    traddingMarkPoint.push(markPointRow);
                }
            }
            series.push({
                name: 'min1',
                type: 'line',
                data: kline.calculateMA(1, data.values),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                markPoint: {
                    data:traddingMarkPoint,
                },
            })
            series.push({
                name: 'Volumn',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data.volumns
            })
            series.push({
                name: 'XXX',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2, 
                data: sortTradIndex.WMSR(6,data.values)
            })
            return series;
        },

    }
}



// markPoint: {
//     label: {
//         normal: {
//             formatter: function (param) {
//                 return param != null ? Math.round(param.value) : '';
//             }
//         }
//     },
//     data: [
//         {
//             name: 'XX标点',
//             coord: ['05/21', '400'],
//             value: 2300,
//             itemStyle: {
//                 normal: {color: 'rgb(41,60,85)'}
//             }
//         },
//         {
//             name: 'highest value',
//             type: 'max',
//             valueDim: 'highest'
//         },
//         {
//             name: 'lowest value',
//             type: 'min',
//             valueDim: 'lowest'
//         },
//         {
//             name: 'average value on close',
//             type: 'average',
//             valueDim: 'close'
//         }
//     ],
//     tooltip: {
//         formatter: function (param) {
//             return param.name + '<br>' + (param.data.coord || '');
//         }
//     }
// },