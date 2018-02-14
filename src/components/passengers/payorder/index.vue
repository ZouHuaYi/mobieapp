<template> 
<div class="myorder">
	<v-header></v-header>
	<div class="no-finish" v-if="orderData.status<4"> 
		<div class="order-area fx">
			<div class="or-left">
				<p class="os"><i class="icon iconfont icon-dingwei"></i>&nbsp;起点&nbsp;:&nbsp;<span>{{orderData.start}}</span></p>
				<p class="oe"><i class="icon iconfont icon-dingwei"></i>&nbsp;终点&nbsp;:&nbsp;<span>{{orderData.end}}</span></p>
			</div>
			<div class="or-right">
				<p>费用(元)</p>
				<p class="yen">&yen;<span>{{orderData.monney}}</span></p>
			</div>
		</div>
		<div class="order-report bc">
			<!-- 通知 -->
			<div class="on-report" v-if="orderData.status<=1">
				<i class="icon iconfont icon-tongzhi"></i>
				<span v-if="orderData.status==0">正在努力通知司机</span>
				<span v-if="orderData.status==1">司机成功接单</span>
			</div>
			<!-- 司机信息 -->
			<div class="order-driver clearfix" v-if="orderData.driver.length!=0 && orderData.status>0" v-for="item in orderData.driver">
				<div class="dri-left"> 
					<div class="dri-img"><img :src="item.picture"></div>
					<div class="dri-cat">
						<p><span>{{item.plate}}</span><span>{{item.name}}</span></p>
						<p><i v-for="n in item.star" class="icon iconfont icon-xingxing"></i></p>
						<p><span>{{item.color}}</span><span>{{item.cat}}</span></p>
					</div>
				</div>
				<div class="dri-right"> 
					<a :href="'tel:'+item.phone"><i class="icon iconfont icon-ai206"></i></a>
				</div>
			</div>
			<!-- 倒计时 -->
			<div class="time-report" v-if="orderData.status<2">
				<span>{{timeData}}</span>
				<p v-if="orderData.status==0">等待司机接单</p>
			</div>
		</div>
		<!-- 取消按钮 -->
		<div class="del-order bc" v-if="orderData.status<2">
			<p v-if="orderData.status==0">若15分钟后没有司机接单，系统将自动取消此次订单</p>
			<p v-if="orderData.status==1">接单10分钟后，乘客取消订单将扣除3个金豆</p>
			<div class="form-btn bc hover" @click="cancelAtion(orderData.cancelStatus)">
				<a href="javascript:;">取消</a>
			</div>
		</div>
		<!-- 支付确认 和 到达目的地-->
		<div class="dao-order bc" v-if="orderData.status>1">
			<div class="form-btn bc hover" v-if="orderData.status==2">
				<a href="javascript:;">我已到达目的地</a>
			</div>
			<div class="form-btn bc hover" v-if="orderData.status==3">
				<a href="javascript:;" @click="payStatus=!0">确定支付方式</a>
			</div>
		</div>
	</div>
	<v-finish v-if="orderData.status==4"  :orderList="orderData" />	
	<!-- 弹窗的组件 -->
	<v-pay @hideFun="payStatus=false" :showStatus="payStatus" :monney="orderData.monney" />
	<v-cancelalter :title="cancelTitle" :sectit="cancelsectit" :showStatus="cancelStatus" @hideFun="cancelStatus=!1" @comFun="postCancel" />
</div>
</template>
<script> 
	import images from '@/assets/timg.jpg';
	import vPay from './pay.vue';
	import vHeader from '../header.vue'
	import vCancelalter from '@/components/common/cancelAlter.vue'
	import vFinish from './finish.vue'

/*
status : 订单状态
	0  下单 倒计时 15       等待  	
	1  司机接单 倒计时 10   等待
	2  司机来到 上车        未完成
	3  到达目的地           未支付
	4  支付完成
	5  无效           
cancelStatus : 直接写文字也行 或者 就是数字状态 只有 0-2 三种状态码
*/
	//获取订单
	Mock.mock('/order',{
		"id|1000-2000":2000,
		"status":4,
		"time": 1522339200,
		"start":"大罗村",
		"end":  "小罗村",
		"monney|100-300":300,
		"driver":[{
			"id|1000-2000":2000,
			"picture" : images,
			"name" : "老师傅",
			"phone" : "15016447087",
			"plate": "粵B12345",
			"color": "白色",
			"cat":"丰田",
			"star|1-5":5
		}],
		"cancelStatus|0-2":2
	})

	//判断状态的api  0-4
	Mock.mock('/cycle',{
		"status":4
	})

	//取消订单
	Mock.mock('/cancel',{
		"status": 0,
		"error":  "无法取消"
	})

	export default{
		name:'wait',
		components:{
			vPay,
			vHeader,
			vCancelalter,
			vFinish
		}
		,data(){
			return{
				payStatus:false,
				cancelTitle:"",
				cancelsectit:"",
				cancelStatus:false,
				orderData:{},						                     // 数据部分		
				timers:null,						                     // 时间		
				timeData:"00:00:00"
					
			}
		}
		,methods:{
			async orderHtml(){
				const orderId = this.$store.state.orderId;
				if(!orderId){
					this.$router.replace({name:"place"});    
					return;
				}
				let order={"orderId":orderId};
				const dat = await this.$ajaxPost('/order',order);       	    //等待获取数据
				if(dat){
					this.orderData=dat;
					this.orderStatus=dat.status;
					clearInterval(this.timers);
					this.waitTime(dat.time);
					this.cycleAtion();
				}
			}
			// 检测订单的状态 
			,async cycleAtion(){
				const orderId = this.$store.state.orderId;	
				let order={"orderId": orderId};
				const dat = await this.$ajaxPost('/cycle',order);
				if(dat){
					if(dat.status>3) return;			 //支付完成不用再请求
					if(dat.status!= this.orderStatus){
						this.orderHtml();                //状态不同重新渲染
					}else{
						setTimeout(()=>{
							this.cycleAtion();           //不停的请求 1s 一次 递归
						},2000)
					}
				}
			}
			//取消的动作
			,cancelAtion(num){
				if(Number.isInteger(num)){
					switch (num)
					{
						case 0:
							this.cancelAlter('无法取消此订单！');
							break;
						case 1:
							this.cancelAlter('你确定要取消此订单吗！');
							break;
						case 2:
							this.cancelAlter('你确定要取消此订单吗','将扣除3个金豆');
							break;		
					}
				}else{
					this.cancelAlter(num);
				}
				
			}
			,async postCancel(){
				const orderId = this.$store.state.orderId;	
				this.$parent.msgSend('正在取消');
				let order={"orderId": orderId};
				const dat = await this.$ajaxPost('/cancel',order);
				this.$sleep(2);                                         // 模拟延时请求
				if(dat){
					if(dat.status==0){
						await this.$parent.endSend("成功取消",0.5);
						this.$router.replace({name:"place"});
					}else{
						await this.$parent.endSend("无法取消",0.5);
					}
				}
			}
			// 等待的倒计时
			,waitTime(timers){
				var tha=this;
				var da = timers-Math.round(new Date()/1000);         //获得剩余的秒数
				tha.timers = setInterval(()=>{
					da--;
					if(da<=0){
						clearInterval(tha.timers);
						tha.actionCancel();
						return;
					}
					var f= Math.floor(da/60) < 10? '0'+Math.floor(da/60):Math.floor(da/60);
					var s= da%60 < 10 ? '0'+da%60:da%60;
					tha.timeData='00'+':'+f+':'+s;
				},1000)
			}
			//取消的显示
			,cancelAlter(val1,val2){
				this.cancelTitle=val1;
				if(val2){
					this.cancelsectit=val2;
				}
				this.cancelStatus=!0;
			}
		}
		,created(){
			this.orderHtml();
		}
	}

</script>
<style scoped> 
	.order-area{padding: 3.75rem 1.0rem 1.15rem;width: 100%;box-sizing:border-box;-webkit-box-sizing:border-box;position: relative;}
	.order-area:after{position: absolute;content: " ";width: 17.55rem;border-top: 0.025rem solid #abaaaa;bottom: 0;left: 0.6rem;}
	.order-area .or-left{flex: 1;-webkit-flex:1;-webkit-box-flex: 1;box-flex: 1;padding-right: 0.5rem;}
	.order-area .or-left p{font-size: 0.8rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;line-height: 46px;}
	.order-area .or-left p i{font-size: 1.15rem;vertical-align: middle;}
	.order-area .or-left p.os i{color: #2fb700;}
	.order-area .or-left p.oe i{color: #fe0202;}
	.order-area .or-left p.oe{padding-top: 0.8rem;}
	.order-area .or-right{font-size: 0.95rem;text-align: right;line-height: 1.25rem;}
	.order-area .or-right p.yen span{font-size: 1.65rem;}
	.order-area .or-right p.yen{padding-top: 0.45rem;color: #6d6d6d;}
	.order-report{padding:0 0.6rem;}
	.on-report{text-align: center;padding-top: 1.25rem;}
	.on-report i{font-size: 2.8rem;color: #ffa600;}
	.on-report span{display: block;font-size: 1.0rem;color: #8b8b8b;padding-top: 1.2rem;}
	.time-report{text-align: center;padding-top: 3.0rem;}
	.time-report span{font-size: 1.55rem;color: #6d6d6d;}
	.time-report p{font-size: 0.9rem;padding-top: 0.25rem;color: #9c9b9b;}
	.del-order{width: 100%;padding: 1.25rem 2.375rem 0.75rem;text-align: center;}
	.del-order p{font-size: 0.5rem;line-height: 0.55rem;color: #8b8b8b;padding-bottom: 0.75rem;}
	.del-order .form-btn{background: none;border:0.05rem solid #fe7002;}
	.del-order .form-btn a{color: #fe7002;}
	.order-driver{padding: 2.55rem 1.25rem 0;}
	.dri-left{;position: relative;height: 4.0rem;float: left;width: 12.25rem;}
	.dri-left:after{position: absolute;content: " ";height: 100%;right: 0;top: 0;border-left: 0.025rem solid #a0a0a0;}
	.dri-img{width: 4.0rem;height: 4.0rem;border-radius: 50%;float: left;overflow:hidden;}
	.dri-img img{width:100%;height:100%;}
	.dri-cat{width: 7.75rem;float: left;margin-left:0.5rem;}
	.dri-cat p{font-size: 0.7rem;height: 0.7rem;padding: 0.3rem 0;line-height: 0.7rem;}
	.dri-cat p i{font-size: 0.7rem;color: #ffa600;}
	.dri-right{width: 2.7rem;height: 100%;float: left;text-align: right;line-height: 4.0rem;}
	.dri-right a{display: inline-block;}
	.dri-right a i{font-size: 1.9rem;}
	.dri-time{font-size: 1.5rem;text-align: center;padding-top: 1.0rem;color: #6d6d6d;}
	.dao-order{padding: 5.0rem 1.85rem 0;}
</style>