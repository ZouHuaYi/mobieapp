<template> 
<div class="dri-order bc">
	<v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" :topDown="0.8" :bottomLoad="3.0">
		<section class="order-list">
			<div class="order-item bc" v-for="item in downdata">
				<div class="order-time"><i class="icon iconfont icon-shijian"></i>{{$formatDate('yyyy-M-dd HH:ss',item.time)}}</div>
				<div class="order-area clearfix">
					<div class="oa-left u-left">
						<i class="icon iconfont icon-dingwei"></i><span>起点:</span>
					</div>
					<div class="oa-right u-left">
						<h3>{{item.startTitle}}</h3>
						<p>{{item.startArea}}</p>
					</div>
				</div>
				<div class="order-area clearfix">
					<div class="oa-left u-left">
						<i class="icon iconfont icon-dingwei act"></i><span>终点:</span>
					</div>
					<div class="oa-right u-left">
						<h3>{{item.endTitle}}</h3>
						<p>{{item.endArea}}</p>
					</div>
				</div>
				<a class="click hover" @click="testOrder(item.id)" href="javascript:;">抢单</a>
			</div>
		</section>
	</v-scroll>
	<v-footer :act="true" />
</div>
</template>
<script>
import vFooter from "../footer.vue" 
import vScroll from "@/components/common/scroll.vue";

	// 抢单 数据
	Mock.mock('/qdorder',
		{"list|3":[
			{
			"id|1000-3000":3000,
			"time":1518576008,
			"startTitle":"某某学校",
			"startArea":"广州市番禺区海伦堡创业园公寓",
			"endTitle":"某某村",
			"endArea":"广州市番禺区海伦堡创业园公寓"
			}
		]}
	)	
	// 判断 单是否被抢 0 没有 1 已经被抢
	Mock.mock('/qdtest',{
		"status":0,
		"error":"你已经有单不能抢了"
	})

	export default{
		data(){
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
		,components:{
			vFooter,
			vScroll
		}
		,methods:{
			async getData(){
				const dat = await this.$ajaxPost('/qdorder',{});
				if(dat){
					this.downdata=dat.list;
				}
			}
			//上啦刷新
			,onRefresh(done) {
				this.getData();
				done();                     // call done
			}
			//下拉加载
			,onInfinite(done) {
				this.counter++;
				let tha=this;
				let end = this.pageEnd = this.num * this.counter;
				let i = this.pageStart = this.pageEnd - this.num;
				let more = this.$el.querySelector('.load-more');
				this.$https.post("/qdorder",{
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
			,async testOrder(val){
				this.$parent.msgSend('正在抢单');
				await this.$sleep(2);                                       //模拟延时
				const dat = await this.$ajaxPost('/qdtest',{"orderId":val});
				if(dat.status==0){
					this.$store.orderIdAction(val);
					await this.$parent.endSend('抢单成功',0.5);
					this.$router.push({name:"dri_pay"})
				}else{
					await this.$parent.endSend('抢单失败',0.5);
					this.$parent.msgAlter(dat.error);
				}
			}
		}
		,created(){
			this.getData()
		}
	}
</script>

<style scoped> 
.dri-order{width: 100%;height: 100%;background: #f8f7f7;padding: 0 0.5rem;color: #9c9b9b;font-size: 0.7rem;}
.order-list{padding-bottom: 3.0rem;}
.order-item{width: 100%;height: 9.0rem;margin-top: 1.15rem;padding: 1.0rem 0 0 0.5rem;background: #ffffff;border-radius: 0.3rem;-webkit-border-radius:0.3rem;position: relative;}
.order-item .click{position: absolute;width: 3.5rem;height: 3.5rem;border-radius: 50%;-webkit-border-radius: 50%;background: #fe7002;color: #ffffff;line-height: 3.5rem;text-align: center;font-size: 0.85rem;right: 0.75rem;top: 3.0rem;}
.order-time{height: 0.7rem;line-height: 0.7rem;}
.order-time i{font-size: 0.7rem; color: #d3d1d1;margin-right: 0.5rem}
.order-area{width: 100%;height: 2.5rem;margin-top:0.9rem;}
.oa-left{height:100%;line-height: 2.5rem;margin-right: 0.7rem;font-size: 0.85rem}
.oa-left i{font-size: 0.8rem;color: #2fb700;margin-right: 0.5rem}
.oa-left i.act{color: #fe0202;}
.oa-right{width: 8.25rem;}
.oa-right h3{width: 100%;font-size: 0.9rem;height: 1.1rem;line-height: 1.1rem;color: #545454;font-weight: normal;padding-bottom: 0.55rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
.oa-right p{width: 100%;height: 1.0rem;font-size: 0.7rem;line-height: 1.0rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
</style>