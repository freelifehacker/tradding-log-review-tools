<template lang="html">
    <div class="options-wrapper">
        <section class="filter">
            <mu-select 
                class="filter-item-130" 
                v-model="filter.code" 
                label="股票代码">
                <mu-option 
                    v-for="code,index in codesList" 
                    :key="code" 
                    :label="code" 
                    :value="code">
                </mu-option>
            </mu-select>
            <mu-text-field 
                class="filter-item-100" 
                v-model="filter.price" 
                label="当前价" >
            </mu-text-field>
            <mu-text-field 
                class="filter-item-100" 
                v-model="filter.targetPrice" 
                label="目标价" >
            </mu-text-field>
            <mu-text-field 
                class="filter-item-100" 
                v-model="filter.stopPrice" 
                label="止损价" >
            </mu-text-field>
            <mu-button 
                color="primary" 
                ref="getOptionBtn" 
                @click="query">查询
            </mu-button>
            <mu-button 
                color="primary" 
                ref="getOptionBtn" 
                @click="activateTick('aaa')">连接服务器
            </mu-button>
        </section>
        <section class="options-chain" v-if="dateList">
            <mu-tabs 
                :value.sync="activeTab" inverse color="secondary" 
                text-color="rgba(0, 0, 0, .54)" >
                <mu-tab 
                    v-for="(date,index) in dateList">
                    {{date}}
                </mu-tab>
            </mu-tabs>
            <div 
                class="options-base-info" 
                v-for="(date,index) in dateList"
                v-if="activeTab == index">
                <span>CALL平均波动率：{{ivList[date].call_equal_vi.toFixed(1)}}%</span>
                <span>PUT平均波动率：{{ivList[date].put_equal_vi.toFixed(1)}}%</span>
            </div>
            <div class="options-list-hd">
                <div class="option-list-call">
                    <div class="option-row">
                        <div class="col">止盈</div>
                        <div class="col">止损</div>
                        <div class="col">最新IV</div>
                        <div class="col">BID</div>
                        <div class="col">中值</div>
                        <div class="col">ASK</div>
                        <div class="col">理想价</div>
                    </div>
                </div>
                <div class="strke-price">
                    <div class="option-row">
                        <div class="col">行权价</div>
                    </div>
                </div>
                <div class="option-list-put">
                    <div class="option-row">
                        <div class="col">理想价</div>
                        <div class="col">ASK</div>
                        <div class="col">中值</div>
                        <div class="col">BID</div>
                        <div class="col">最新IV</div>
                        <div class="col">止损</div>
                        <div class="col">止盈</div>
                    </div>
                </div>
            </div>
            <div 
                class="options-list" 
                v-for="(date,index) in dateList"
                v-if="activeTab == index">
                <div class="option-list-call">
                    <div 
                        v-for="(item,index) in optionsList[date]"
                        v-if="item.option_type=='CALL'"
                        class="option-row" 
                        @click="onSubscribe(date,index)">
                        <!-- 止赢 -->
                        <div class="col">{{item.strike_price}}</div>
                        <!-- 止损 -->
                        <div class="col">{{item.strike_price}}</div>
                        <!-- 最新IV -->
                        <div class="col">{{item.iv.toFixed(1)}}</div>
                        <!-- BID -->
                        <div class="col">{{item.bid}}</div>
                        <!-- 中间价 -->
                        <div class="col">{{item.strike_price}}</div>
                        <!-- ASK-->
                        <div class="col">{{item.ask}}</div>
                        <!-- 理想价-->
                        <div class="col">{{getOptionPriceByBS(1600,item.strike_price,date,ivList[date].call_equal_vi,'call')}}</div>
                    </div>
                </div>
                <div class="strke-price">
                    <div 
                        class="option-row" 
                        v-for="item in optionsList[date]"
                        v-if="item.option_type=='CALL'">
                        <div class="col">{{item.strike_price}}</div>
                    </div>
                </div>
                <div class="option-list-put">
                    <div 
                        class="option-row" 
                        v-for="item in optionsList[date]"
                        v-if="item.option_type=='PUT'">
                        <!-- 理想价-->
                        <div class="col">{{getOptionPriceByBS(1600,item.strike_price,date,ivList[date].put_equal_vi,'put')}}</div>
                        <!-- ASK-->
                        <div class="col">{{item.ask}}</div>
                        <!-- 中间价 -->
                        <div class="col">{{item.strike_price}}</div>
                        <!-- BID -->
                        <div class="col">{{item.bid}}</div>
                        <!-- 最新IV -->
                        <div class="col">{{item.iv.toFixed(1)}}</div>
                        <!-- 止损 -->
                        <div class="col">{{item.strike_price}}</div>
                        <!-- 止赢 -->
                        <div class="col">{{item.strike_price}}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const bs = require("black-scholes");
const moment = extendMoment(Moment);

export default {
    components: {
        
    },
    created(){
        this.config.token = '000000';
        this.connect();
    },
    beforeMount(){
     
    },
    mounted() {
        this.$refs.getOptionBtn.handleClick()
        // var ws = new WebSocket("ws://localhost:8888/ws");
        // ws.onopen = function() {
        //        ws.send("Hello, world");
        // };
        // ws.onmessage = function (evt) {
        //        console.log(evt.data);
        // };
    },

    data() {
        return {
            baseHost:'http//localhost:8888/',
            traddingHost:'http//localhost:5000/',
            config:{
                token:'000000'
            },
            activeTab:0,
            dateList: [],
            optionsList:[],
            tickList:[],
            ivList:[],
            loading:{},
            codesList:['SPY','AMZN','USO','AAPL','NFLX','NVDA','AMD'],
            filter:{
                code:'AMZN',
                price:1590,
                targetPrice:0,
                stopPrice:0,
            },
        }
    },
    methods: {
        connect(){
            this.$http.post("http://localhost:5000/gateway", {
                gatewayName: 'FUTU',
                token: this.config.token
            }).then(res => {
                console.log(res)
            }).catch(res =>{
                console.log(res)
            })
        },
        /*
            @param {Float} price 
            @param {Float} string 
            @param {String} date 行权日
            @param {Float} iv 隐含波动率 
            @param {String} optionType 'call','put'
        */
        getOptionPriceByBS(price,strike,date,iv,optionType){
            const r = 0.02455;
            let exp = 0;
            //换算美国时间
            let now = moment().utcOffset(-5);
            let expDate = new moment(date).add(37, 'h');
            let gap = moment.duration(expDate-now).as('day')
            exp = (Math.floor(gap)+1)/365;
            return (bs.blackScholes(price, strike, exp, iv/100, r, optionType).toFixed(2)); 
        },
        fetchOptionChain(){
            let url = 'http://localhost:8888/option?symbol=US.'+this.filter.code+'&price='+this.filter.price;
            return this.$http.get(url)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                this.toastr.error(`${err.message}`, 'ERROR!')
                console.log(err)
            })
        },
        onSubscribe(date,index){
            let code = this.optionsList[date][index].code.toString();
            if(index%2==0){
                code = 'US.SPY'
            }else{
                code = 'US.AMZN'
            }
            if(this.loading && this.loading.subScribe == true) return;
            this.loading.subScribe = true;
            console.log("subScribe "+code)
            this.$http.post("http://localhost:5000/tick", {
                vtSymbol: code,
                token: this.config.token
            }).then(res => {
                this.loading.subScribe = false;
                if (res.data.result_code == "success") {
                    let target = _vtSymbol
                    this.activateTick(target)
                    this.form.vtSymbol = target;
                    this.$message({ message: '订阅成功', type: 'success' });
                } else {
                    // this.$notify({ title: '警告', message: '订阅失败', type: 'warning', duration: 3000, });
                }
            }).catch(res => {
                console.log("false")
                this.loading.subScribe = false;
                // this.$notify({ title: '警告', message: '服务异常，订阅失败', type: 'warning', duration: 3000, });
            });
        },
        activateTick(e){
            let that = this,
                    tick = new Object(),
                    tickObj = new Object(),
                    target = e.vtSymbol || e;
            console.log(e)
            console.log(socket)
            socket.on("eTick.", function(data) {
                console.log(moment().format('h:mm:ss a'))
                console.log(data)
                // that.leftTrade = that.tickObj[target]
                // that.leftTrade.priceRatio = (((that.tickObj[target].lastPrice / that.tickObj[target].preClosePrice) - 1)*100.0).toFixed(2) + "%"
                    // if (that.tickObj[target] !== undefined) {
                    //         if (that.tickObj[target].lastPrice == undefined) {
                    //                 that.form.lastPrice = that.tickObj[target].lastPrice
                    //         }
                    // }
            });


            // this.tickList.push();

            // this.$set(this.optionsList[date][index],'strike_price',0);
        },
        async query(){
            let options = await this.fetchOptionChain();
            this.dateList = options.date;
            this.optionsList = options.list;
            console.log(this.optionsList)
            this.ivList = options.iv;
        },
        tickBook(){
            this.$http.post(host + "/tick", {
                    vtSymbol: _vtSymbol,
                    token: this.config.token
            }).then(res => {
                    console.log(res.data)
                    // this.loading.subScribe = false;
                    // if (res.data.result_code == "success") {
                    //         let target = _vtSymbol
                    //         that.clickTick(target)
                    //         that.form.vtSymbol = target;
                    //         that.$message({ message: '订阅成功', type: 'success' });
                    // } else {
                    //         that.$notify({ title: '警告', message: '订阅失败', type: 'warning', duration: 3000, });
                    // }
            })
            .catch(res => {
                console.log(res)
                    // that.loading.subScribe = false;
                    // that.$notify({ title: '警告', message: '服务异常，订阅失败', type: 'warning', duration: 3000, });
            })
        }, 
    },
}
</script>

<style lang="scss">
    @import "../sass/font/iconfont.css";
    @import "../sass/options.scss";
</style>
