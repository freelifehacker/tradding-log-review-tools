import Vue from 'vue'
import Router from 'vue-router'
import List from 'components/List'
import Detail from 'components/Detail'
import Pdf from 'components/Pdf'
import Dateline from 'pages/Dateline'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },{
      path : '/movie/:title',
      name : 'detail',
      component : Detail
    },{
      path : '/pdf',
      name : 'pdf',
      component : Pdf
    },{
      path : '/dateline',
      name : 'dateline',
      component : Dateline
    },{
      path: '*',
      redirect : '/'
    }
  ]
})
