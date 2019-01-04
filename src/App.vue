<template>
  <div id="app">
    <mu-paper :z-depth="1" class="list-wrap">
      <mu-list toggle-nested>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 1</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 2</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button :ripple="false" slot="nested">
          <mu-list-item-title>List Item 3</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-paper>
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
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
      transitionName:'',
    }
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
}
</script>
