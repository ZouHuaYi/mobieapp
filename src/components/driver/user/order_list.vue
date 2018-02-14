<template>
<div class="dri-order">
	<v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" :topDown="11.25" :bottomLoad="3.0">
		<div class="order-play">
			<div class="opl-item bc" v-for="item in downdata" @click="gotoOrder(item.orderId)">
				<div class="opl-title">
					<p>订单号：{{item.orderId}}</p>
				</div>
				<div class="opt-box clearfix">
					<div class="p-l u-left">
						<p><i class="icon iconfont icon-shijian"></i><span>{{$formatDate('yyyy-M-dd HH:ss',item.time)}}</span></p>
						<p><i class="icon iconfont icon-dingwei"></i><span>起点：{{item.startArea}}</span></p>
						<p><i class="icon iconfont icon-dingwei"></i><span>终点：{{item.endArea}}</span></p>
					</div>
					<span class="p-r u-right">&yen;{{item.monney}}</span>
				</div>
			</div>
		</div>
	</v-scroll>	
</div>
</template>
<script type="text/javascript">
	import vScroll from "@/components/common/scroll.vue";

	//获取数据  
	Mock.mock('/getOrder',{
	"list|5":[{		    
			"orderId":"245354646456546",
			"dtit":"未支付",
			"time":1518243720,
			"startArea":"某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校某某学校",
			"endArea":"某某小学",
			"monney|50-300":300
		}]
	})

	export default{
		name:"order"
		,props:{
			url:{
				type:String
			}
		}
		,components: {
			vScroll,
		}
		,data(){
			return{
				counter: 1,         //当前页
				num: 5,             // 一页显示多少条
				pageStart: 0,       // 开始页数
				pageEnd: 0,         // 结束页数
				listdata: [],       // 下拉更新数据存放数组
				downdata: [],       // 上拉更多的数据存放数组
				scrollData:{
					noFlag: false   //暂无更多数据显示
				}
			}
		}
		,methods:{
			goToWait(orderId,status){
				if(status==0){
					this.$store.orderIdAction(orderId);
					this.$router.push({name:"wait"});
				}
			}
			//上啦刷新
			,onRefresh(done) {
				this.getData(this.url);
				done();                     // call done
			}
			//下拉加载
			,onInfinite(done) {
				this.counter++;
				let tha=this;
				let end = this.pageEnd = this.num * this.counter;
				let i = this.pageStart = this.pageEnd - this.num;
				let more = this.$el.querySelector('.load-more');
				this.$https.post(tha.url,{
					offset:tha.counter
				}).then((data)=>{
					if(data.data.list.length){
						data.data.list.forEach((el,index)=>{
							tha.downdata.push(el);
						})
						more.style.display = 'none';       //隐藏加载条
					}else{
						more.style.display = 'none';       //隐藏加载条//走完数据调用方法
						this.scrollData.noFlag = true;
					}

				})
				done();
			}
			,getData(url){
				let tha=this;
				tha.downdata=[];
				this.$https.post(url,{

				}).then((data)=>{
					data.data.list.forEach((el,index)=>{
						tha.downdata.push(el);
					})
				})
			}
			,gotoOrder(val){
				this.$store.orderIdAction(val);
				this.$router.push({name:"dri_pay"});
			}
		}
		,mounted(){
			this.getData(this.url)
		}
		

	}

</script>
<style type="text/css" scoped>
	.order-play{width: 100%;padding-top: 11.375rem;padding-bottom:3.0rem;}
	.opl-item{padding: 0 0.75rem 0.875rem;border-bottom: 0.025rem solid #d4d3d2;height: 7.5rem;position: relative;}
	.opl-title{width: 100%;height: 2.5rem;border-bottom: 0.025rem solid #c2c2c2}
	.opl-title p{float: left;line-height: 2.5rem;font-size: 0.7rem;color: #b9b8b8}
	.opl-title span{float: right;width: 2.45rem;height: 1.0rem;border:0.025rem solid #ffa600;text-align: center;line-height: 1.0rem;font-size: 0.55rem;color: #ffa600;margin-top: 0.65rem;}
	.opt-box .p-l p{font-size: 0.65rem;line-height: 0.75rem;padding-top: 0.65rem;clear: both;overflow: hidden;}
	.opt-box .p-l p span{width: 80%;height: 0.75rem;float: left;padding-left: 0.625rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
	.opt-box .p-l p i{float: left;font-size: 0.65rem;color: #d3d1d1;}
	.opt-box .p-r{position: absolute;right: 0.75rem;top:4.5rem;color: #bbbaba;font-size: 0.7rem;line-height: 0.7rem;}
</style>