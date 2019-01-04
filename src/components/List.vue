<template lang="html">
    <div class="list">
        <mu-container>
            <mu-paper :z-depth="1">
                <mu-data-table height="500" :columns="columns" :data="traddingitems">
                    <template slot="expand" slot-scope="prop">
                        <div style="padding: 24px;" >this is expand row, name {{prop.row.sname}}</div>
                    </template>
                    <template slot-scope="scope">
                        <td>{{scope.row.scode}}</td>
                        <td>{{scope.row.sname}}</td>
                        <td>{{scope.row.date}}</td>
                        <td>{{scope.row.time}}</td>
                        <td>
                            <span v-if="scope.row.isBuy" class="label-buy">买</span>
                            <span v-else class="label-sell">卖</span>
                        </td>
                        <td>
                            <span v-if="scope.row.isCall" class="label-call">多</span>
                            <span v-else class="label-put">空</span>
                        </td>
                        <td>
                            <span v-if="scope.row.isNx" class="label-nx">牛熊</span>
                            <span v-else class="label-not-nx">正股</span>
                        </td>
                        <td class="is-right">{{scope.row.quantity}}</td>
                        <td class="is-right">{{scope.row.price}}</td>
                        <td class="is-right">{{scope.row.sumAmount}}</td>
                        <td class="is-right">{{scope.row.tradCost}}</td>
                        <td class="is-right">{{scope.row.commission}}</td>
                        <td class="is-right">{{scope.row.platformCost}}</td>
                        <td class="is-right">{{scope.row.moneyChange}}</td>
                    </template>
                </mu-data-table>
            </mu-paper>
        </mu-container>
    </div>
</template>

<script>
export default {
    created() {
        this.getTraddingLog()
        document.title = this.$route.name
    },
    components: {},
    data() {
        return {
            traddingitems: [],
            columns: [
                    { title: '代码', width: 90, name: 'scode' },
                    { title: '名字', name: 'sname', width:180, align: 'center',    },
                    { title: '日期', name: 'date', width: 110, align: 'center',    },
                    { title: '时间', name: 'time', width: 110, align: 'center',    },
                    { title: '买卖', name: 'isBuy', width: 50, align: 'center',    },
                    { title: '方向', name: 'isCall', width: 50, align: 'center',    },
                    { title: '牛熊', name: 'isNx', width: 80, align: 'center',    },
                    { title: '数量', name: 'quantity', width: 110, align: 'left',    },
                    { title: '价格', name: 'price', width: 110, align: 'left',    },
                    { title: '金额', name: 'sumAmount', width: 110, align: 'left',        },
                    { title: '交易成本', name: 'tradCost', width: 110, align: 'left',        },
                    { title: '佣金', name: 'commission', width: 110, align: 'left',        },
                    { title: '平台费用', name: 'platformCost', width: 110, align: 'left',        },
                    { title: '金额变动', name: 'moneyChange', width: 110, align: 'left',        }, 
            ],
        }
    },
    methods: {
        getTraddingLog() {
            this.$http.get('/api/traddingitems/getall')
                .then(res => {
                    console.dir(res.data)
                    this.traddingitems = res.data
                })
                .catch(err => {
                    this.toastr.error(`${err.message}`, 'ERROR!')
                    console.log(err)
                })
        },
        
        // 
        // addMovie() {
        //     this.$http.post('/api/movie', {
        //             title: this.title,
        //             poster: this.poster,
        //             introduction: this.introduction,
        //             rating: this.rating
        //         })
        //         .then(res => {
        //             this.toastr.success('添加电影成功')
        //             console.log(res.data)
        //             this.addMovieModal = false
        //             this.title = ''
        //             this.rating = null
        //             this.poster = ''
        //             this.introduction = ''
        //             this.movie_id = ''
        //             this.getMovies()
        //         })
        //         .catch(e => {
        //             this.toastr.warn('保存失败!')
        //             console.log(e)
        //         })
        // },
        // 取消添加电影的方法
        // cancelAddMovie() {
        //     this.addMovieModal = false
        //     this.title = ''
        //     this.rating = 0
        //     this.poster = ''
        //     this.introduction = ''
        // },
        // 访问后端编辑电影的方法
        // editMovie() {
        //     let id = this.movie_id
        //     this.$http.put(`/api/movie/${id}`, {
        //             title: this.title,
        //             poster: this.poster,
        //             introduction: this.introduction,
        //             rating: this.rating,
        //         })
        //         .then(res => {
        //             this.toastr.success("更新电影成功!")
        //             this.closeModal()
        //             this.getMovies()
        //             this.title = ''
        //             this.rating = null
        //             this.poster = ''
        //             this.introduction = ''
        //             this.movie_id = ''
        //         })
        //         .catch(err => console.log(err))
        // },
        // 删除电影的方法
        // removeMovie(movie) {
        //     let id = movie._id
        //     this.$http.delete(`/api/movie/${id}`)
        //         .then(res => {
        //             this.toastr.success("删除成功.")
        //             console.log(res.data)
        //             this.getMovies()
        //         })
        //         .catch(e => console.log(e))
        // },
        // 跳转到电影详情页的方法
        // showDetail(title) {
        //     this.$router.push(`/movie/${title}`)
        // }
    }
}
</script>

<style lang="css">
    .list .mu-table td{
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
