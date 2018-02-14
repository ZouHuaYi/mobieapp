<template> 
<div class="box-scroll"> 
<v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" :topDown="2.0" :bottomLoad="3.0">
	<div class="order-play">
		<div class="opl-item bc" v-for="(item,index) in downdata">
			<div class="opl-title">
				<p>订单号：{{item.orderId}}</p>
				<span :style="{'color':color,borderColor:color}" @click="goToWait(item.orderId,status)" >{{navtit}}</span>
			</div>
			<div class="opt-box clearfix">
				<div class="p-l u-left">
					<p><i class="icon iconfont icon-shijian"></i><span>{{$formatDate('yyyy-M-dd HH:ss',item.time)}}</span></p>
					<p><i class="icon iconfont icon-dingwei"></i><span>起点：{{item.start}}</span></p>
					<p><i class="icon iconfont icon-dingwei"></i><span>终点：{{item.end}}</span></p>
				</div>
				<span class="p-r u-right">&yen;{{item.monney}}</span>
			</div>
		</div>
	</div>
</v-scroll>
</div>
</template>
<script> 
	import vScroll from "@/components/common/scroll.vue";

	//获取数据  
	Mock.mock('/getOrder',{
	"list|5":[{		    
			"orderId":"245354646456546",
			"dtit":"未支付",
			"time":1518243720,
			"start":"某某学校",
			"end":"某某小学",
			"monney|50-300":300
		}]
	})

	export default{
		name:"order"
		,props:{
			navtit:{
				type:String
			}
			,url:{
				type:String
			}
			,color:{
				type:String
			}
			,status:{
				type:[String,Number]
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
		}
		,mounted(){
			this.getData(this.url)
		}
		

	}
</script>