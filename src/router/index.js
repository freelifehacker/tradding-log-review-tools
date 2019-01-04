import Vue from 'vue'
import Router from 'vue-router'
import List from 'components/List'
import Detail from 'components/Detail'
import Pdf from 'components/Pdf'
import Dateline from 'pages/Dateline'
import Kline from 'pages/Kline'
import KlineMin1 from 'pages/KlineMin1'
import Strategy from 'pages/Strategy'
import Handmake from 'pages/Handmake'
import Traddinglog from 'pages/Traddinglog'
import TraddingLogDetail from 'pages/TraddingLogDetail'

import Options from 'pages/Options'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'List',
            component: List
        },{
            path: '/strategy',
            name: 'Strategy',
            component: Strategy
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
            path : '/kline',
            name : 'kline',
            component : Kline
        },{
            path : '/handmake',
            name : 'handmake',
            component : Handmake
        },{    
            path : '/traddinglog',
            name : 'traddinglog',
            component : Traddinglog
        },{    
            path : '/klinemin1/:code/:date',
            name : 'klinemin1',
            component : KlineMin1
        },{
            path : '/tadding-log-detail/:id',
            name : 'taddinglogdetail',
            component : TraddingLogDetail
        },{
            path : '/options',
            name : 'options',
            component : Options
        },{    
            path: '*',
            redirect : '/'
        }
    ]
})
