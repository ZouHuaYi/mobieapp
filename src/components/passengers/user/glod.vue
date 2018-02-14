<template> 
	<div class="userset">
		<div class="glod-head">
			<div class="gold-top">
				<div class="g-l u-left">
					<p class="g-t"><span>金豆</span> 1元 = 1金豆</p>
					<p class="g-b"><span>{{glod}}</span>个</p>
				</div>
				<a class="top-up" @click="czStatus=true" href="javascript:;">充值</a>
			</div>
			<p class="con-tit">消费记录</p>
		</div>
		<div class="consumption">
			<v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" :topDown="9.25" :bottomLoad="3.0">
				<div class="scrollBox">
					<div class="consum-item bc" v-for="(item,n) in downdata">
						<p class="d-title">订单号：{{item.orderId}}</p>
						<div class="d-box clearfix">
							<div class="d-l u-left">
								<p>{{item.title}}</p>
								<span>{{$formatDate('yy/MM/dd HH:ss',item.time)}}</span>
							</div>
							<div class="d-r u-right">{{item.monney}}</div>
						</div>
					</div>
				</div>	
			</v-scroll>
		</div>
		<v-footer></v-footer>
		<v-czglod @sendFun="czGlod" @hideFun="czStatus=false" :showStatus="czStatus"></v-czglod>
	</div>
</template>
<script> 
	import vScroll from "@/components/common/scroll.vue";
	import vCzglod from "./cz_glod.vue";
	import vFooter from "./footer.vue";

	//获取数据
	Mock.mock('/glodlist',{
	"glodnumber|1000-2000":	2000,	                 //多少个金豆
	"list":[{
			"orderId":"245354646456546",
			"title":"金豆充值",
			"time":1518243720,
			"monney":"+1000个"
			},
			{
			"orderId":"245354646456546",
			"title":"微信支付",
			"time":1518243720,
			"monney":"-100元"	
			},
			{
			"orderId":"245354646456546",
			"title":"金豆支付",
			"time":1518243720,
			"monney":"-100个"	
			}
		]
	})

	//充值 0 成功 1 失败
	Mock.mock('/sendGlod',{
		"status":0
	})

	export default{
		name:"glod"
		,components:{
			vScroll,
			vCzglod,
			vFooter
		}
		,data(){
			return{
				glod:0,
				czStatus:false,
				counter: 1,         //当前页
				num: 5,             // 一页显示多少条
				pageStart: 0,       // 开始页数
				pageEnd: 0,         // 结束页数
				listdata: [],       // 下拉更新数据存放数组
				downdata: [],       // 上拉更多的数据存放数组
				scrollData:{
					noFlag: false  //暂无更多数据显示
				}
			}
		}
		,methods:{
			getGlod(){
				let tha=this;
				tha.downdata=[];
				this.$https.post('/glodlist',{})
				.then((data)=>{
					tha.glod=data.data.glodnumber;
					data.data.list.forEach((el,index)=>{
						tha.downdata.push(el);
					})
				})
			}
			//充值 调用 函数
			,czGlod(val){
				var tha=this;
				this.$https.post('/sendGlod',{
					"glod":val
				}).then((data)=>{
					if(data.data.status == 0){
						tha.czStatus=!1;
						tha.getGlod();
					}
				})
			}
			//上拉刷新
			,onRefresh(done) {
				this.getGlod();
				done();                     // call done
			}
			//下拉加载
			,onInfinite(done) {
				this.counter++;
				let tha=this;
				let end = this.pageEnd = this.num * this.counter;
				let i = this.pageStart = this.pageEnd - this.num;
				let more = this.$el.querySelector('.load-more');

				this.$https.post('/glodlist',{
					offset:tha.counter,
					pageNum:tha.num
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
			
			
		}
		,created(){
			this.getGlod();
		}
	}

</script>

<style scoped> 
.glod-head{position:fixed;top:0;left:0;width:100%;z-index:999;background:#ffffff;}
.gold-top{position: relative;width: 100%;height: 7.0rem;border-bottom: 0.025rem solid #D4D3D2;background: #ffffff;}
.gold-top .g-l{padding-left: 1.0rem;}
.gold-top .g-l p.g-t{padding:1.2rem 0;line-height: 0.8rem;}
.gold-top .g-l p.g-t span{font-size: 0.8rem;}
.gold-top .g-l p.g-b span{font-size: 2.0rem;line-height: 2.0rem;}
.gold-top .top-up{position: absolute;width: 2.95rem;height: 1.45rem;border:1px solid #fe7002;border-radius: 0.25rem 0.25rem;-webkit-border-radius: 0.25rem 0.25rem;text-align: center;line-height: 1.45rem;font-size: 1.0rem;top: 3.0rem;right: 1.0rem;color: #fe7002}
.con-tit{height: 2.25rem;line-height: 2.25rem;font-size: 0.8rem;text-indent: 0.75rem;}
.consum-item{padding: 0 0.75rem;background: #ffffff;border-bottom: 0.025rem solid #d4d3d2;}
.consum-item p.d-title{height:2.5rem;line-height: 2.5rem;font-size:0.75rem;color: #b9b8b8;border-bottom: 0.025rem solid #d4d3d2;}
.consum-item .d-box{padding: 1.0rem 0 0.625rem;}
.consum-item .d-box .d-l p{font-size: 0.9rem;color: #000;line-height: 0.9rem;padding-bottom: 0.5rem;}
.consum-item .d-box .d-l span{font-size:0.65rem;color: #afafaf;}
.consum-item .d-box .d-r{font-size: 0.8rem;}
.scrollBox{padding:9.25rem 0 3.0rem;}
</style>