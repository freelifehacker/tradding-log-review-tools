<template lang="html">
  <div class="dateline-wrapper">
    <div class="current-goal" v-if="activeMonthMark">
      <span class="t">本月目标20%</span>
      <span class="ab">目标盈利{{(activeMonthMark['201809'].startNetAssets*0.2).toLocaleString('en-US')}}</span>
      <span class="completed-rate">{{((activeMonthMark['201809'].endNetAssets-activeMonthMark['201809'].startNetAssets)/(activeMonthMark['201809'].startNetAssets*0.2)*100).toFixed(2)}}%</span>
      <span class="completed-ab">完成{{(activeMonthMark['201809'].endNetAssets - activeMonthMark['201809'].startNetAssets).toLocaleString('en-US')}}</span>
      <span class="rest">{{(activeMonthMark['201809'].startNetAssets*1.2-activeMonthMark['201809'].endNetAssets).toLocaleString('en-US')}}</span>
    </div>
    <div class="title-fixed">
      <div class="fold-all" @click="flodAllMonth()">收起</div>
      <span class="start">开盘</span>
      <span class="end">收市</span>
      <span class="rate">盈亏比</span>
      <span class="ab">盈亏净值</span>
    </div>
    <div class="btn-fixed-bottom">
      <mu-container class="button-wrapper">
  			<mu-button color="success" >保存交易</mu-button>
  		</mu-container>
    </div>
    <div v-if="activeDaysMark" class="month-block" v-for="(days,key) in monthOfDay">
      <div class="month-wrapper" v-bind:class="{ 'active': isActiveMonth(monthF(key)),'has-data':hasMonthData(monthF(key))}" :ref="'month'+monthF(key)">
        <div class="month-title" @click="switchMonth(monthF(key))">
          <span class="month">{{monthF(key)}}</span>
          <div class="month-assets" v-html="getMonthAssetDate(monthF(key))">{{getMonthAssetDate(monthF(key))}}</div>
        </div>
        <div v-if="monthGroupdata[year+monthF(key)]" class="tradding-group-wrapper" v-for="group in monthGroupdata[year+monthF(key)]" >    
          <router-link :to="'/tadding-log-detail/'+group._id">
            <TraddingLogGroup :group="group"/>
          </router-link>
          <div class="day-detail" >
            <div class="tradding-row"  v-for="item in group.items">
              <div class="row-col t-direction">
                {{ traddingItemObjective[item].isBuy ? 'B':'S'}}
              </div>
              <div class="row-col t-scode">{{traddingItemObjective[item].scode}}</div>
              <div class="row-col t-sname">{{traddingItemObjective[item].sname}}</div>
              <div class="row-col t-date">{{traddingItemObjective[item].date}}</div>
              <div class="row-col t-time">{{traddingItemObjective[item].time}}</div>
              <div class="row-col t-money">{{traddingItemObjective[item].moneyChange}}</div>
              <div class="row-col t-price">{{traddingItemObjective[item].price}}</div>
              <div class="row-col t-quantity">{{traddingItemObjective[item].quantity}}</div>
            </div>
          </div>
          <!-- <TraddingLogDetail :/> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import TraddingLogGroup from './components/TraddingLogGroup';
const moment = extendMoment(Moment);

export default {
  components: {
    TraddingLogGroup,
  },
  created(){

    // var bs = require("black-scholes");

    // let c = bs.blackScholes(1625, 1625, 0.0602, 0.42, 0.023832, "call"); // 0.23834902311961947
    // let p = bs.blackScholes(1625, 1625, 0.0602, 0.42, 0.023832, "put"); // 3.5651039155492974
    // console.log(c)
    // console.log(p)


    this.getTraddingLog();
    this.getTraddingLogGrouops();

  },
  beforeMount(){
    this.monthOfDay = [31,30,31,30,31,31,30,31,30,31,28,31];
    if(moment().isLeapYear(this.year)){
      this.monthOfDay[10] = 29;
    }
  },
  mounted() {

  },

  data() {
    return {
      year:'2018',
      yearAB:0,
      monthOfDay:[],
      traddingitems:[],
      traddingItemObjective:{},
      activeMonthMark:null,
      activeDaysMark:null,
      traddingDaysDetail:null,
      eidtingDayDetail:false,
      eidtingTraddingLogDetail:false,
      traddingDate:null,
      form:{
      	checkGroup:[]
      },
      traddingLogGroups:null,
      monthGroupdata:{},
      //
      dayStatic:{
        morningDesc:'',
        nightDesc:'',
        statusScore:0,
      },
      //
      traddingMentalStatic:{
        editingItemId:'',
        mistakeType:[],
        fearType:[],
      }
    }
  },
  methods: {
    switchMonth:function(m){
      let className = this.$refs['month'+m][0].className;
      if(className.indexOf("active")<0){
        this.$refs['month'+m][0].className = "month-wrapper has-data active";
      }else{
        this.$refs['month'+m][0].className = "month-wrapper has-data";
      }
    },
    flodAllMonth:function(){
      let m = document.querySelectorAll(".month-wrapper");
      for(let i=0;i<m.length;i++){
        m[i].className = "month-wrapper has-data";
      }
    },
    saveTraddingDetail(){
      let id = this.traddingMentalStatic.editingItemId;
      this.$http.put(`/api/traddingitems/traddingitem/${id}`, {
          mistakeType: this.traddingMentalStatic.mistakeType,
          fearType: this.traddingMentalStatic.fearType,
        })
        .then(res => {
          // console.log(res);
          this.toastr.success("保存成功!");
        })
        .catch(err => console.log(err))
    },
    
    monthF(m){
      m = 12- m;
      return m < 10 ? '0'+m:m;
    },
    dayF(m,d){
      d = this.monthOfDay[m]-d+1;
      return d < 10 ? '0'+ d : d; 
    },
    
    fetchTraddingLogGroup(){
      return this.$http.get('/api/traddinggroup/getall')
        .then(res => {
          let result =  res.data;
          return result;
        })
        .catch(err => {
          this.toastr.error(`${err.message}`, 'ERROR!')
          console.log(err)
        })
    },
    getTraddingLogGrouops:async function(){
      let groupData = await this.fetchTraddingLogGroup(); 
      for(let i=1;i<=12;i++){
        let month = this.year+this.monthF(i);
        this.monthGroupdata[month] = [];
        for(let item of groupData){
          if(item.date == month){
            this.monthGroupdata[month].push(item);
          }
        }
      }
      this.traddingLogGroups  = groupData;
    },
    fetchTraddingDate(){
      return this.$http.get('/api/traddingdate/getall')
        .then(res => {
          let result =  res.data;
          return result;
        })
        .catch(err => {
          this.toastr.error(`${err.message}`, 'ERROR!')
          console.log(err)
        })
    },
    getTraddingLog:async function() {
      const r = await this.fetchTraddingDate();
      const dayProfit = r.result; 
      this.activeMonthMark = r.monthStatic;
      this.yearAB = r.yearAB.toLocaleString('en-US');
      this.$http.get('/api/traddingitems/getall')
        .then(res => {
          this.traddingitems = res.data;
          this.activeDaysMark = {};
          this.traddingDaysDetail = {};
          for(let i=0;i<this.traddingitems.length;i++){
            this.activeDaysMark[this.traddingitems[i].date] = dayProfit[this.traddingitems[i].date];
            this.traddingItemObjective[this.traddingitems[i]._id] = this.traddingitems[i];
          }
          console.log(this.traddingItemObjective) 
          for (let key in this.activeDaysMark) {  
            this.traddingDaysDetail[key] = [];
            for(let i=0;i<this.traddingitems.length;i++){
              if(key == this.traddingitems[i].date){
                this.traddingDaysDetail[key].unshift(this.traddingitems[i]); 
              }
            }
          }
        })
        .catch(err => {
          this.toastr.error(`${err.message}`, 'ERROR!')
          console.log(err)
        })
    },
    hasMonthData(month){
      return this.activeMonthMark['2018'+month].hasData ? true:false;
    },
    
    isActiveMonth(month){
      return false
      // return this.activeMonthMark['2018'+month].hasData ? true:false;
    },
    
    isUp(month,day){
      return this.activeDaysMark['2018'+month+day] ? this.activeDaysMark['2018'+month+day].isProfit : false;
    },
    isDown(month,day){
      return this.activeDaysMark['2018'+month+day] ? !this.activeDaysMark['2018'+month+day].isProfit : false;
    },
    getMonthAssetDate(month){
      if(this.activeMonthMark['2018'+month]){
        let d = this.activeMonthMark['2018'+month];
        let str = d.startNetAssets ? '<span class="start">'+d.startNetAssets.toLocaleString('en-US')+'</span>':'';
        str = str + (d.endNetAssets ? '<span class="end">'+d.endNetAssets.toLocaleString('en-US')+'</span>':'');
        str = str+ (d.rateProfit ? '<span class="rate">'+d.rateProfit+'%</span>':'');
        str = str+ (d.profitAB ? '<span class="ab">'+d.profitAB.toLocaleString('en-US')+'</span>':'');
        return str;
      }else{
        return "";
      }
    },
  }
}
</script>

<style lang="scss">
  @import "../sass/font/iconfont.css";
  @import "../sass/handmake.scss";
</style>
