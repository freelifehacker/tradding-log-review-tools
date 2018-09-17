<template>
  <div id="app">
<!--     <mu-appbar :title="title" class="title" style="width: 100%;" color="primary" :zDepth="zDepth">
      <mu-tabs :value.sync="active">
        <mu-tab>TAB ITEM 1</mu-tab>
        <mu-tab>TAB ITEM 2</mu-tab>
        <mu-tab>TAB ITEM 3</mu-tab>
      </mu-tabs>
    </mu-appbar> -->
    
    <router-view></router-view>
  </div>
</template>
<script>
import Vue from 'vue'
import ECharts from 'vue-echarts/components/ECharts'
Vue.component('v-chart', ECharts)
export default {
  name: 'app',
  data(){
    return {
      title  : 'xLog',
      zDepth : 2,
      active : 0,
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content:center;
  align-items:flex-start;
}
.title{
  letter-spacing: 1px;
  text-align: left;
}

.github-icon:hover{
  opacity: .8;
}
</style>
