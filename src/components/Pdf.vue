<template lang="html">
  <div class="list">
    <div class="item" v-for="item of contents">
      <div class="row" v-for="(c,key) of item">
        <div>INDEX-{{key}}:::{{c}}</div>
      </div>
      <div class="breaker">===========================================</div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getLevel1Content();
  },
  components: {},
  data() {
    return {
      contents:[]
    }
  },
  methods: {
    getLevel1Content() {
      this.$http.get('/api/pdf/pdf')
        .then(res => {
          console.dir(res.data)
          this.contents = res.data
        })
        .catch(err => {
          this.toastr.error(`${err.message}`, 'ERROR!')
          console.log(err)
        })
    }
  }
}
</script>

<style lang="css">
.mu-th{
  text-align: center !important;
}
.mu-td{
  text-align: center !important;
}
  .movie-poster{
    width: 80px;
    padding: 4px 0;
  }
  .movie-introduction{
    white-space: normal;
    padding:4px 4px;
    letter-spacing: 1px;
    font-size: 14px;
    text-align: left;
    text-indent: 2em;
  }
</style>
