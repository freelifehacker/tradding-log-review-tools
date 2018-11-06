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
          extraCssText: 'width: 170px',
          formatter: function (param) {
            let text = [];
            let day,WMSR1,WMSR2,RSI1;
            for(let i=0;i<param.length;i++){
              if(param[i].seriesName == '日K'){
                day = param[i];
              }
              if(param[i].seriesName == 'WMSR1'){
                WMSR1 = param[i];
              }
              if(param[i].seriesName == 'WMSR2'){
                WMSR2 = param[i];
              }
              if(param[i].seriesName == 'RSI1'){
                RSI1 = param[i];
              }
            }
            
            text.push(day.seriesName + '<hr size=1 style="margin: 3px 0">');
            text.push('开盘: ' + day.data[1] + '<br/>');
            text.push('收盘: ' + day.data[2] + '<br/>');
            text.push('最高: ' + day.data[3] + '<br/>');
            text.push('最低: ' + day.data[4] + '<br/>');
            text.push('WMSR' + '<hr size=1 style="margin: 3px 0">');
            text.push('WMSR1: ' + WMSR1.data + '<br/>');
            text.push('WMSR2: ' + WMSR2.data + '<br/>');
            text.push('RSI' + '<hr size=1 style="margin: 3px 0">');
            if(RSI1 && RSI1.data){
              text.push('RSI1: ' + RSI1.data + '<br/>');
            }
            return text.join('');
          }
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
            height: '30%'
          },
          {
            left: '10%',
            right: '8%',
            bottom: '45%',
            height: '15%'
          },
          {
            left: '10%',
            right: '8%',
            bottom: '34%',
            height: '10%'
          },
          {
            left: '10%',
            right: '8%',
            bottom: '23%',
            height: '10%'
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
            axisPointer: {
              z: 100
            }
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
          },
          {
            type: 'category',
            gridIndex: 2,
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
          },
          {
            type: 'category',
            gridIndex: 3,
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
          }
        ],
        yAxis: [
          {
            scale: true,
            gridIndex: 0,
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
          },
          {
            scale: true,
            gridIndex: 2,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            gridIndex: 3,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          }
        ],
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