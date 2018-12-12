<template lang="html">
  <div class="options-wrapper">
    
  </div>
</template>

<script>

import Moment from 'moment';
import { extendMoment } from 'moment-range';
// import TraddingLogGroup from './components/TraddingLogGroup';
const moment = extendMoment(Moment);

export default {
  components: {
    
  },
  created(){

    // var bs = require("black-scholes");

    // let c = bs.blackScholes(1625, 1625, 0.0602, 0.42, 0.023832, "call"); // 0.23834902311961947
    // let p = bs.blackScholes(1625, 1625, 0.0602, 0.42, 0.023832, "put"); // 3.5651039155492974
    // console.log(c)
    // console.log(p)

  },
  beforeMount(){
   
  },
  mounted() {

  },

  data() {
    return {
     
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
  @import "../sass/font/iconfont.css";
  @import "../sass/handmake.scss";
</style>
