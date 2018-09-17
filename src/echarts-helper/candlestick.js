const kline = require('../lib/util.js').kline;

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
module.exports =  {
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
      return series;
    },
    getMin1Series:function(data,traddingData){
      console.log(data)
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
    
      return series;
    },

  }
}



// markPoint: {
//   label: {
//     normal: {
//       formatter: function (param) {
//         return param != null ? Math.round(param.value) : '';
//       }
//     }
//   },
//   data: [
//     {
//       name: 'XX标点',
//       coord: ['05/21', '400'],
//       value: 2300,
//       itemStyle: {
//         normal: {color: 'rgb(41,60,85)'}
//       }
//     },
//     {
//       name: 'highest value',
//       type: 'max',
//       valueDim: 'highest'
//     },
//     {
//       name: 'lowest value',
//       type: 'min',
//       valueDim: 'lowest'
//     },
//     {
//       name: 'average value on close',
//       type: 'average',
//       valueDim: 'close'
//     }
//   ],
//   tooltip: {
//     formatter: function (param) {
//       return param.name + '<br>' + (param.data.coord || '');
//     }
//   }
// },