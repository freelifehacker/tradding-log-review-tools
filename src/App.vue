<template>
  <div id="app">
    <mu-appbar :title="title" class="title" :zDepth="zDepth">
    </mu-appbar>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      title  : 'xLog',
      zDepth : 2
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
