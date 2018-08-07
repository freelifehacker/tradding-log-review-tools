<template lang="html">
  <div class="dateline-wrapper">
    <div v-if="activeDaysMark" class="month-block" v-for="(days,key) in monthOfDay">
      <div class="month-wrapper" v-bind:class="{ 'active': isActiveMonth(monthF(key))}">
        <div class="month-title">{{monthF(key)}}</div>
        <div class="days-block">    
          <div class="days-wrapper" v-for="day in days">
            <div class="day-row">
              <span class="day" v-bind:class="{ 'active': isActiveDay(monthF(key),dayF(key,day)),'is-up':isUp(monthF(key),dayF(key,day)),'is-down':isDown(monthF(key),dayF(key,day))}">
                {{dayF(key,day)}}
              </span>
              <i v-on:click="addDayDetail(monthF(key),dayF(key,day))" class="icon iconfont icon-plus-circle"></i>
            </div>
            <div class="day-detail">
              
            </div>
          </div>
        </div>
      </div>
    </div>

    <vodal :show="eidtingDayDetail" animation="slideDown" :width="500" :height="480" :closeButton="false">
      <mu-text-field v-model="dayStatic.morningDesc"
      multiLine :rows="2" :rowsMax="6"
      fullWidth icon="description" label="早" labelFloat/><br/>
      <mu-text-field v-model="dayStatic.nightDesc"
      multiLine :rows="2" :rowsMax="6"
      fullWidth icon="description" label="晚" labelFloat/><br/>
      <!-- <mu-slider fullWidth icon="star" label="评分" labelFloat class="demo-slider" color="secondary" v-model="dayStatic.statusScore"></mu-slider> -->
      <mu-button @click="closeDayEidter">
        <mu-icon left value="undo"></mu-icon>
        取消
      </mu-button>
      <mu-button @click="saveDayDetail" color="primary">
        <mu-icon left value="check"></mu-icon>
        确定
      </mu-button>
    </vodal>

    <vodal :show="eidtingTraddingLogDetail" animation="slideDown" :width="500" :height="480" :closeButton="false">
      <mu-form :model="traddingMentalStatic" label-position="top" label-width="100"> 
        <mu-form-item prop="input" label="犯错类型">
          <mu-container>
            <mu-flex class="select-control-row">
              <mu-checkbox :value="-1" v-model="traddingMentalStatic.mistakeType" label="不提前界定风险"></mu-checkbox>
            </mu-flex>
            <mu-flex class="select-control-row">
              <mu-checkbox :value="-2" v-model="traddingMentalStatic.mistakeType" label="不设止损"></mu-checkbox>
            </mu-flex>
            <mu-flex class="select-control-row">
              <mu-checkbox :value="-3" v-model="traddingMentalStatic.mistakeType" label="不能有系统的获利了结"></mu-checkbox>
            </mu-flex>
            <mu-flex class="select-control-row">
              <mu-checkbox :value="1" v-model="traddingMentalStatic.mistakeType" label="提前界定风险"></mu-checkbox>
            </mu-flex>
            <mu-flex class="select-control-row">
              <mu-checkbox :value="2" v-model="traddingMentalStatic.mistakeType" label="严格止损"></mu-checkbox>
            </mu-flex>
            <mu-flex class="select-control-row">
              <mu-checkbox :value="3" v-model="traddingMentalStatic.mistakeType" label="有系统的获利了结"></mu-checkbox>
            </mu-flex>
          </mu-container>
        </mu-form-item>
        <mu-form-item prop="input" label="恐惧类型">
          <mu-flex class="select-control-row">
            <mu-checkbox :value="1" v-model="traddingMentalStatic.fearTyep" label="怕犯错"></mu-checkbox>
          </mu-flex>
          <mu-flex class="select-control-row">
            <mu-checkbox :value="2" v-model="traddingMentalStatic.fearTyep" label="怕亏钱"></mu-checkbox>
          </mu-flex>
          <mu-flex class="select-control-row">
            <mu-checkbox :value="3" v-model="traddingMentalStatic.fearTyep" label="怕错过机会"></mu-checkbox>
          </mu-flex>
          <mu-flex class="select-control-row">
            <mu-checkbox :value="4" v-model="traddingMentalStatic.fearTyep" label="怕赚不到钱"></mu-checkbox>
          </mu-flex>
        </mu-form-item>

        <mu-button @click="closeTraddingEidter">
          <mu-icon left value="undo"></mu-icon>
          取消
        </mu-button>
        <mu-button @click="saveTraddingDetail" color="primary">
          <mu-icon left value="check"></mu-icon>
          确定
        </mu-button>
      </mu-form>
    </vodal>

  </div>
</template>

<script>

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export default {
  components: {},
  created(){
    this.getTraddingLog();
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
      year:2018,
      monthOfDay:[],
      traddingitems:[],
      activeMonthMark:null,
      activeDaysMark:null,
      eidtingDayDetail:false,
      eidtingTraddingLogDetail:false,
      //
      dayStatic:{
        morningDesc:'',
        nightDesc:'',
        statusScore:0,
      },
      //
      traddingMentalStatic:{
        mistakeType:[],
        fearTyep:[],
      }
    }
  },
  methods: {
    addDayDetail:function(month,day){
      this.eidtingTraddingLogDetail = true;
      let date = this.year+month+day;
    },
    closeDayEidter(){
      this.eidtingDayDetail = false;
    },
    saveDayDetail(){

    },
    saveTraddingDetail(){

    },
    closeTraddingEidter(){
      this.eidtingTraddingLogDetail = false;
    },
    monthF(m){
      m = 12- m;
      return m < 10 ? '0'+m:m;
    },
    dayF(m,d){
      d = this.monthOfDay[m]-d+1;
      return d < 10 ? '0'+ d : d; 
    },
    getTraddingLog() {
      var that = this;
      this.$http.get('/api/traddingitems/getall')
        .then(res => {
          that.traddingitems = res.data;
          that.activeDaysMark = {};
          that.activeMonthMark = {};
          for(let i=0;i<that.traddingitems.length;i++){
            that.activeDaysMark[that.traddingitems[i].date] = true;
            that.activeMonthMark[that.traddingitems[i].date.substr(0,6)] = true;
          }
          console.log(that.activeDaysMark)
        })
        .catch(err => {
          this.toastr.error(`${err.message}`, 'ERROR!')
          console.log(err)
        })
    },
    isActiveMonth(month){
      return this.activeMonthMark['2018'+month];
    },
    isActiveDay(month,day){
      return this.activeDaysMark['2018'+month+day];
    },
    isUp(month,day){

    },
    isDown(month,day){

    },
  }
}
</script>

<style lang="scss">
  @import "../sass/font/iconfont.css";
  @import "../sass/dateline.scss";
</style>
