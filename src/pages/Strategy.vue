<template lang="html">
    <div class="kline-wrapper">
        <section class="filter-form">
            <mu-select class="filter-item-130" v-model="filter.code" label="股票代码">
                <mu-option v-for="code,index in codesList" :key="code" :label="code" :value="code"></mu-option>
            </mu-select>
            <!-- <mu-text-field class="filter-item-100" v-model="filter.gap" @change="filterAction" label="最大震幅" ></mu-text-field>
            <mu-text-field class="filter-item-100" v-model="filter.maxUp" @change="filterAction" label="最大涨幅" ></mu-text-field>
            <mu-text-field class="filter-item-100" v-model="filter.maxDown" @change="filterAction" label="最大跌幅" ></mu-text-field> -->

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
var _ = require('underscore');

export default {
    components: {
        chart: ECharts
    },
    created(){
        this.init();
        // this.analyz();
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
        analyz:async function(){
            let that = this;
            let baseData = await this.getDayData();
            let H = [];
            let L = [];
            let Z = [];
            for(let i=baseData.length-1; i>0 ;i--){
                let gap = parseFloat(baseData[i][1]) - parseFloat(baseData[i-1][2]);
                gap = gap.toFixed(3);
                let gapPercent = (100*gap/baseData[i-1][2]).toFixed(2);
                let d = {date:baseData[i][0],yes:parseFloat(baseData[i-1][2]),start:parseFloat(baseData[i][1]),gap:gap,gapPercent:gapPercent};
                if(Math.abs(gapPercent)<0.2){
                    Z.push(d)
                }else if(gapPercent<0.7 && gapPercent>0.5){
                    H.push(d);
                }else if(gap<0){
                    L.push(d);
                }
            }
            let HH = [];
            let HL = [];
            let HZ = [];
            for(let i=0;i<H.length;i++){
                let g = await that.getMin1Data(H[i].date.substr(0,10));
                let start = H[i].start;
                let yes = H[i].yes;
                let min15H = [];
                let min15L = [];
                for(let j=0;j<30;j++){
                    min15H.push(g[j][3]);
                    min15L.push(g[j][4]);
                }
                let max = _.max(min15H);
                let min = _.min(min15L);
                let maxIndex = 0;
                let minIndex = 0;
                for(let j=0;j<30;j++){
                    if(g[j][3] == max){
                        maxIndex = j;
                    }
                    if(g[j][4] == min){
                        minIndex = j;
                    }
                }
                let gap = (max-start).toFixed(3);
                let gapPercent = (100*gap/start).toFixed(2);
                let d = {g:g,date:H[i].date.substr(0,10),gap:gap,gapPercent:gapPercent,max:max,min:min,maxIndex:maxIndex,minIndex:minIndex};
                if( gap >0 ){
                    // if(min>=start){
                        HH.push(d)
                    // }
                }
                if(min<start){
                    HL.push(d);
                }
            }
            // console.log(HL)

            let profit = [];
            let win = [];
            let lose = [];
            var winTotal = [];
            var loseTotal = [];
            for(let j=31;j<120;j++){
                win[j] = 0;
                winTotal[j] =0 ;
                loseTotal[j] = 0;
                lose[j]=0;
                for(let i=0;i<HH.length;i++){
                    let percent = parseFloat((HH[i].g[30][1] - HH[i].g[j][1])*100/HH[i].g[30][1])
                    if(percent>0){
                        win[j]++;
                        winTotal[j]+= percent
                    }else{
                        loseTotal[j]+=percent
                        lose[j]++;
                    }
                    // profit.push({date:HH[i].date,percent:percent});
                }
            }
            // console.log(profit) 
            for(let j=31;j<120;j++){
                // console.log('sell in '+j+'win===== '+winTotal[j])
                // console.log('sell in '+j+'lose==== '+loseTotal[j])
                // console.log('sell in '+j+'WIN Percent ==== '+(win[j]*100/HH.length).toFixed(2)+'%')
                // console.log('at'+j+'-win:'+win[j]+'/'+HH.length+'---'+(winTotal[j]/win[j])); 
                // console.log('lose:'+lose[j]+'/'+HH.length+'---'+(loseTotal[j]/lose[j])); 
            }
            

            // console.log(L) 
            // console.log(Z)
        },

        getMin1Data(date){
            return this.$http.get('/static/kline/US.SPY/min1/'+date+'.json')
                .then(res => {
                    let result =    res.data;
                    return result;
                })
                .catch(err => {
                    this.toastr.error(`${err.message}`, 'ERROR!')
                    console.log(err)
                })
        },
        init:async function(){
            this.rawData = await this.getDayData();
            let gapStati = [];
            let mean = 0;
            for(let i=0;i<this.rawData.length;i++){
                gap = this.rawData[3]-this.rawData[4];
                gapStati.push(gap);
                mean += gap;
            }
            mean = mean/this.rawData.length;
            stddv = 0;

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
            return this.$http.get('/static/kline/US.SPY/day.json')
                .then(res => {
                    let result =    res.data;
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
            codesList:['US.SPY','HK.800000'],
            filter:{
                gap:0,
                code:'US.SPY',
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