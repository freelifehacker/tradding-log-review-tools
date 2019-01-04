<template lang="html">
	<div class="tradding-log-group" @click="showDetail">
		<div class="row-col t-date">
			{{group.dateStart}}
		</div>
		<div class="row-col t-date">
			{{group.dateEnd}}
		</div>
		<div class="row-col t-profit">
			{{group.profit.toFixed(2)}}
		</div>
		<div class="row-col t-t">
			{{group.tradeBuyTimes}}
		</div>
		<div class="row-col t-t">
			{{group.tradeSellTimes}}
		</div>		
		<div class="row-col t-bt">
			{{group.tradCost.toFixed(2)}}
		</div>
		<div class="row-col t-bt">
			{{group.platformCost.toFixed(2)}}
		</div>
		<div class="delete">
        	<mu-icon @click="deleteGroupedData" value="delete_forever" color="red"></mu-icon>
		</div>
	</div>
</template>

<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export default {
	props:{
		group:{
			type:Object,
		}
	},
    components: {

    },
    created(){
        // this.getTraddingLog();
        // this.getTraddingDate();
    },
    beforeMount(){

    },
    mounted() { 
    	// let start = moment(this.group.dateStart,"YYYYMMDD HH:mm:ss");
    	// let end = moment(this.group.dateEnd,"YYYYMMDD HH:mm:ss");
    	// let gap = moment(end - start)
    	// console.log(start)
    	// console.log(end)
    	// console.log(gap.format('HH小时mm分ss秒'))
    },
    data() {
        return {
        }
    },
    methods: {
        deleteGroupedData(){
        	let id = this.group._id;
        	this.$http.put(`/api/traddinggroup/delete/${id}`,{})
                .then(res => {
                    this.toastr.success("删除!");
                })
                .catch(err => console.log(err))
        },
        showDetail(){
        	let id = this.group._id;
        	this.$http.get(`/api/traddinggroup/get/${id}`,{})
                .then(res => {
                    console.log(res);
                    // this.toastr.success("删除!");
                })
                .catch(err => console.log(err))
        },
    }
}
</script>

<style lang="scss">
    @import "../../sass/components/tradding-log-group.scss";
</style>
