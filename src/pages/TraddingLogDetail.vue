<template lang="html">
  <div class="kline-wrapper">
<!--     <div class="kline-content">
      <v-chart ref="klineCanvasMin1" class="kline-canvas" :options="candlestickMin1" v-if="rawDataMin1"/>
    </div> -->
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts'
import '../lib/echarts-import-all'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
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
    // this.resize();
  },
  methods:{
    resize:function(){
      // let klineCanvasMin1 = this.$refs.klineCanvasMin1.$el;
      // klineCanvasMin1.style.width = window.innerWidth+'px';
      // klineCanvasMin1.style.height = window.innerHeight+'px';
      // this.$refs.klineCanvasMin1.resize();
    },
    init:async function(){
      let _id = this.$route.params.id;
      let r = await this.fetchTraddingData(_id);
      this.group = r.group;
      this.items = r.items;
    },
    fetchTraddingData:function(_id){
      return this.$http.get('/api/traddinggroup/get/'+_id)
        .then(res => {
          return res.data;
        }).catch(err => {
          this.toastr.error(`${err.message}`, 'ERROR!')
          console.log(err)
        });
    },
  },
  data:function () {
    return {
      group:null,
      items:null,
    }
  },
}
</script>

<style lang="scss">
  @import "../sass/font/iconfont.css";
  @import "../sass/tradding-log-detail.scss";
</style>