<template lang="html">
  <div class="kline-wrapper">
    <section class="filter-form">
      <mu-select class="filter-item-130" v-model="filter.code" label="股票代码">
        <mu-option v-for="code,index in codesList" :key="code" :label="code" :value="code"></mu-option>
      </mu-select>
      <mu-text-field class="filter-item-100" v-model="filter.gap" @change="filterAction" label="最大震幅" ></mu-text-field>
      <mu-text-field class="filter-item-100" v-model="filter.maxUp" @change="filterAction" label="最大涨幅" ></mu-text-field>
      <mu-text-field class="filter-item-100" v-model="filter.maxDown" @change="filterAction" label="最大跌幅" ></mu-text-field>
    </section>
    <div class="kline-content">
      <v-chart ref="klineCanvas" class="kline-canvas" :options="candlestick" v-if="rawData"/>
    </div>
  </div>
</template>

<script>
// var ECharts = require('vue-echarts')
import ECharts from 'vue-echarts/components/ECharts'
import '../lib/echarts-import-all'
// import Moment from 'moment';
// import { extendMoment } from 'moment-range';
// const moment = extendMoment(Moment);
import { kline } from '../lib/util';
import { candlestickHelper } from '../echarts-helper/candlestick';


export default {
  components: {
    chart: ECharts
  },
  created(){
    this.init();
  },
  beforeMount(){

  },
  mounted() {

  },
  updated(){
    this.resize();

  },
  methods:{
    resize:function(){
      let klineCanvas = this.$refs.klineCanvas.$el;
      klineCanvas.style.width = window.innerWidth+'px';
      klineCanvas.style.height = window.innerHeight+'px';
      this.$refs.klineCanvas.resize();
      
      this.$refs.klineCanvas.chart.on("click",function(day){
        console.log(day.name)
      });
    },
    filterAction:function(){
      this.data = kline.filterGapData(this.data,this.filter);
      this.candlestick.series = candlestickHelper.getSeries(this.data);
      this.$refs.klineCanvas.resize();
    }, 
    init:async function(){
      this.rawData = await this.getDayData();
      this.data = kline.splitData(this.rawData);
      this.candlestick = {
        backgroundColor: '#eee',
        legend: {
          data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
          inactiveColor: '#aaa',
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
              color: '#000'
          },
          position: function (pos, params, el, elRect, size) {
              var obj = {top: 10};
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
              return obj;
          },
          extraCssText: 'width: 170px'
        },
        axisPointer: {
          link: {xAxisIndex: 'all'},
          label: {
            backgroundColor: '#777'
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            brush: {
              type: ['lineX', 'clear']
            }
          }
        },
        brush: {
          xAxisIndex: 'all',
          brushLink: 'all',
          outOfBrush: {
            colorAlpha: 0.1
          }
        },
        grid: [
          {
            left: '10%',
            right: '8%',
            height: '50%'
          },
          {
            left: '10%',
            right: '8%',
            bottom: '20%',
            height: '15%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: this.data.xData,
            scale: true,
            boundaryGap : false,
            axisLine: {onZero: false},
            splitLine: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            // axisPointer: {
            //   z: 100
            // }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: this.data.xData,
            scale: true,
            boundaryGap : false,
            axisLine: {onZero: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              label: {
                formatter: function (params) {
                  var seriesValue = (params.seriesData[0] || {}).value;
                  return params.value
                  // + (seriesValue != null
                  //   ? '\n' + ECharts.format.addCommas(seriesValue)
                  //   : ''
                  // );
                }
              }
            }
          }
        ],
        // xAxis: {
        //   type: 'category',
        //   data: this.data.xData,
        //   axisLine: { lineStyle: { color: '#8392A5' } },
        //   scale: true,
        //   boundaryGap : false,
        //   // axisLine: {onZero: false},
        //   splitLine: {show: false},
        //   splitNumber: 20,
        //   min: 'dataMin',
        //   max: 'dataMax'
        // },

        yAxis: [
          {
            scale: true,
            splitArea: {
              show: true
            }
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          }
        ],

        // yAxis: {
        //   scale: true,
        //   axisLine: { lineStyle: { color: '#8392A5' } },
        //   splitLine: { show: false }
        // },
        // dataZoom: [
        //   {
        //     type: 'inside',
        //     start: 50,
        //     end: 100
        //   },
        //   {
        //     show: true,
        //     type: 'slider',
        //     y: '90%',
        //     start: 50,
        //     end: 100
        //   }
        // ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 0,
            end: 100
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            top: '85%',
            start: 0,
            end: 100
          }
        ],        
        animation: false,
        series: candlestickHelper.getSeries(this.data)
      }
    },
    getDayData(){
      return this.$http.get('/static/kline/HK.800000/day.json')
        .then(res => {
          let result =  res.data;
          return result;
        })
        .catch(err => {
          this.toastr.error(`${err.message}`, 'ERROR!')
          console.log(err)
        })
    },
  },
  data:function () {
    return {
      rawData:null,
      data:null,
      candlestick:null,
      codesList:['HK.800000','HK.00700'],
      filter:{
        gap:0,
        code:'HK.800000',
        maxUp:0,
        maxDown:0,
      },
    }
  },
}
</script>

<style lang="scss">
  @import "../sass/font/iconfont.css";
  @import "../sass/kline.scss";
</style>