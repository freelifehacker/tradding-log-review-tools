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
    			<mu-button color="success" @click="saveTrade">保存交易</mu-button>
                <span class="total-quantity">数量：{{temQuantity}}</span>
    		</mu-container>
        </div>
    	<mu-form :model="form" class="mu-form" label-position="top" label-width="100">
	        <mu-form-item prop="checkbox">
		        <div v-if="activeDaysMark" class="month-block" v-for="(days,key) in monthOfDay">
		            <div class="month-wrapper active" v-bind:class="{ 'active': isActiveMonth(monthF(key)),'has-data':hasMonthData(monthF(key))}" :ref="'month'+monthF(key)">
		                <div class="month-title" @click="switchMonth(monthF(key))">
		                    <span class="month">{{monthF(key)}}</span>
		                    <div class="month-assets" v-html="getMonthAssetDate(monthF(key))">{{getMonthAssetDate(monthF(key))}}</div>
		                </div>
		                <div class="days-block">        
		                    <div class="days-wrapper"    v-for="day in days" :ref="'day-'+monthF(key)+dayF(key,day)" v-bind:class="{ 'has-data': isActiveDay(monthF(key),dayF(key,day))}">
		                        <div class="day-row" @click="switchDay(monthF(key)+dayF(key,day))" >
		                            <span class="day" v-bind:class="{ 'active': isActiveDay(monthF(key),dayF(key,day)),'is-up':isUp(monthF(key),dayF(key,day)),'is-down':isDown(monthF(key),dayF(key,day))}">
		                                {{dayF(key,day)}}
		                            </span>
		                            <div class="day-assets" v-html="getDayAssetDate(monthF(key),dayF(key,day))">{{getDayAssetDate(monthF(key),dayF(key,day))}}</div>
		                            <i v-on:click="addDayDetail(monthF(key),dayF(key,day))" class="icon iconfont icon-plus-circle"></i>
		                        </div>
		                        <div class="day-detail" v-if="isActiveDay(monthF(key),dayF(key,day))">
		                            <div class="tradding-row" v-for="traddingItem in getTraddingItemByDay(monthF(key),dayF(key,day))">
		                            	<div class="row-checkbox">
                                            <mu-checkbox v-if="!traddingItem.isGrouped" v-model="form.checkGroup" :value="traddingItem._id"    @click="getItemData(traddingItem)"></mu-checkbox>
                                            <mu-checkbox v-if="traddingItem.isGrouped" :input-value="true" disabled></mu-checkbox>
		                            	</div>
		                                <div class="row-col t-direction">
		                                    {{ traddingItem.isBuy ? 'B':'S'}}
		                                </div>
		                                <div class="row-col t-scode">{{traddingItem.scode}}</div>
		                                <div class="row-col t-sname">{{traddingItem.sname}}</div>
		                                <div class="row-col t-date">{{traddingItem.date}}</div>
		                                <div class="row-col t-time">{{traddingItem.time}}</div>
		                                <div class="row-col t-money">{{traddingItem.moneyChange}}</div>
		                                <div class="row-col t-price">{{traddingItem.price}}</div>
		                                <div class="row-col t-quantity">{{traddingItem.quantity}}</div>
		                            </div>
		                        </div>
		                    </div>
		                </div>
		            </div>
		        </div>
		</mu-form-item>
	</mu-form>
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
                        <mu-checkbox :value="1" v-model="traddingMentalStatic.fearType" label="怕犯错"></mu-checkbox>
                    </mu-flex>
                    <mu-flex class="select-control-row">
                        <mu-checkbox :value="2" v-model="traddingMentalStatic.fearType" label="怕亏钱"></mu-checkbox>
                    </mu-flex>
                    <mu-flex class="select-control-row">
                        <mu-checkbox :value="3" v-model="traddingMentalStatic.fearType" label="怕错过机会"></mu-checkbox>
                    </mu-flex>
                    <mu-flex class="select-control-row">
                        <mu-checkbox :value="4" v-model="traddingMentalStatic.fearType" label="怕赚不到钱"></mu-checkbox>
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

        // console.log(this.getTraddingItemByDay('11','01'));
        // this.getTraddingDate();
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
            yearAB:0,
            monthOfDay:[],
            traddingitems:[],
            activeMonthMark:null,
            activeDaysMark:null,
            traddingDaysDetail:null,
            eidtingDayDetail:false,
            eidtingTraddingLogDetail:false,
            traddingDate:null,
            temQuantity:0,
            form:{
            	checkGroup:[]
            },
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
        getItemData(item){
            if(item.isBuy){
                this.temQuantity += parseInt(item.quantity);
            }else{
                this.temQuantity -= parseInt(item.quantity);
            }
        },
    	saveTrade:function () {
    		if(this.form.checkGroup.length>0){
            	this.$http.put(`/api/traddinggroup/save`, {
                	itemsGroup: this.form.checkGroup,
                })
                .then(res => {
                    this.form.checkGroup = [];
                    this.toastr.success("保存成功!");
                    window.location.reload();
                })
                .catch(err => console.log(err))
    		}
    	},
        switchMonth:function(m){
            let className = this.$refs['month'+m][0].className;
            if(className.indexOf("active")<0){
                this.$refs['month'+m][0].className = "month-wrapper has-data active";
            }else{
                this.$refs['month'+m][0].className = "month-wrapper has-data";
            }
        },
        switchDay:function(d){
            let className = this.$refs['day-'+d][0].className;
            if(className.indexOf("active")<0){
                this.$refs['day-'+d][0].className = "days-wrapper active";
            }else{
                this.$refs['day-'+d][0].className = "days-wrapper";
            }
        },
        flodAllMonth:function(){
            let m = document.querySelectorAll(".month-wrapper");
            for(let i=0;i<m.length;i++){
                m[i].className = "month-wrapper has-data";
            }
        },
        addDayDetail:function(month,day){
            this.eidtingDayDetail = true;
            let date = this.year+month+day;
        },
        addTraddingDetail:function(itemId){
            this.eidtingTraddingLogDetail = true;
            this.traddingMentalStatic.editingItemId = itemId;
        },
        closeDayEidter(){
            this.eidtingDayDetail = false;
        },
        saveDayDetail(){

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
        getTraddingItemByDay(month,day){
            return this.traddingDaysDetail[this.year.toString()+month.toString()+day.toString()];
        },
        //Start From here
        getTraddingDate(){
            var that = this;
            return this.$http.get('/api/traddingdate/getall')
                .then(res => {
                    let result =    res.data;
                    return result;
                })
                .catch(err => {
                    this.toastr.error(`${err.message}`, 'ERROR!')
                    console.log(err)
                })
        },
        getTraddingLog:async function() {
            var that = this;
            const r = await that.getTraddingDate(); 
            const dayProfit = r.result;
            that.activeMonthMark = r.monthStatic;
            that.yearAB = r.yearAB.toLocaleString('en-US');
            this.$http.get('/api/traddingitems/getall')
                .then(res => {
                    that.traddingitems = res.data;
                    that.activeDaysMark = {};
                    that.traddingDaysDetail = {};
                    for(let i=0;i<that.traddingitems.length;i++){
                        that.activeDaysMark[that.traddingitems[i].date] = dayProfit[that.traddingitems[i].date];
                    }
                    for (let key in that.activeDaysMark) {    
                        that.traddingDaysDetail[key] = [];
                        for(let i=0;i<that.traddingitems.length;i++){
                            if(key == that.traddingitems[i].date){
                                that.traddingDaysDetail[key].unshift(that.traddingitems[i]); 
                            }
                        }
                    }
                    console.log(dayProfit)
                    console.log(that.activeDaysMark)
                })
                .catch(err => {
                    this.toastr.error(`${err.message}`, 'ERROR!')
                    console.log(err)
                })
        },
        hasMonthData(month){
            return this.activeMonthMark['2018'+month].hasData ? true:false;
        },
        hasDayData(month,day){

        },
        isActiveMonth(month){
            return false
            // return this.activeMonthMark['2018'+month].hasData ? true:false;
        },
        isActiveDay(month,day){
            return this.activeDaysMark['2018'+month+day];
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
        getDayAssetDate(month,day){
            if(this.activeDaysMark['2018'+month+day]){
                let d = this.activeDaysMark['2018'+month+day];
                let str = '<span class="start">'+d.startNetAssets+'</span>';
                str = str+'<span class="end">'+d.endNetAssets+'</span>';
                str = str+'<span class="rate">'+d.rateProfit+'%</span>';
                return str;
            }else{
                return "";
            }
        },
    }
}
</script>

<style scoped lang="scss">
    @import "../sass/font/iconfont.css";
    @import "../sass/handmake.scss";
</style>
