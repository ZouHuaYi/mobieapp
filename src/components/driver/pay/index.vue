<template>
<div class="dri-pass">
	<div class="pass-header bc clearfix" v-if="passengers.pass.length!=0" v-for="item in passengers.pass">
		<section class="p-img u-left"><img :src="item.picture"/></section>
		<p class="u-left">{{item.name}}</p>
		<a class="phone u-right" :href="'tel:'+item.phone">
			<i class="icon iconfont icon-dianhua3"></i>
		</a>
	</div>
	<div class="dri-pay" v-if="!commentsStatus">
		<div class="dri-area clearfix">
			<div class="order-area clearfix">
				<div class="oa-left u-left">
					<i class="icon iconfont icon-dingwei"></i><span>起点:</span>
				</div>
				<div class="oa-right u-left">
					<h3>{{passengers.startTitle}}</h3>
					<p>{{passengers.startArea}}</p>
				</div>
			</div>
			<div class="order-area clearfix">
				<div class="oa-left u-left">
					<i class="icon iconfont icon-dingwei act"></i><span>终点:</span>
				</div>
				<div class="oa-right u-left">
					<h3>{{passengers.endTitle}}</h3>
					<p>{{passengers.endArea}}</p>
				</div>
			</div>
		</div>
		<div class="getmonny">费用&nbsp;&nbsp;<span>&yen;<strong>{{passengers.monney}}</strong></span>&nbsp;元</div>
		<div class="pass-order bc" v-if="passengers.status==0">
			<div class="form-btn bc hover">
				<a href="javascript:;" @click="postCome">乘客上已上车</a>
			</div>
		</div>
		<div class="pass-order bc" v-if="passengers.status==1">
			<div class="form-btn bc hover">
				<a href="javascript:;" @click="postPay">通知乘客支付</a>
			</div>
		</div>
		<div class="del-order bc" v-if="passengers.status==0">
			<div class="form-btn bc hover">
				<a href="javascript:;" @click="cancelAction(passengers.cancelStatus)">取消</a>
			</div>
			<p class="del-warn">{{cancel[passengers.cancelTimer]}}</p>
		</div>
		<div class="pass-haspay bc" v-if="passengers.status==2">
			<p>乘客已支付</p>
			<a href="javascript:;" @click="commentsAction">
				查看乘客评价
				<i class="icon iconfont icon-jiantou11"></i>
			</a>
		</div>
	</div>
	<div class="pass-commonts bc" v-if="commentsStatus" v-for="item in passengers.comments">
		<div class="pass-star fx">
			<p>评星</p>
			<div class="p-l">
				<i v-for="n in item.star" class="icon iconfont icon-xingxing"></i>
			</div>
		</div>
		<div class="text-box fx">
			<p>留言</p>
			<div class="txt">{{item.text}}</div>
		</div>
		<div class="radio">
			<a v-for="item in item.radio" href="javascript:;">{{item}}</a>
		</div>
	</div>
	<v-cancelalter :title="cancelTitle" :showStatus="cancelStatus" @hideFun="cancelStatus=!1" @comFun="postCancel" />
	<v-footer />
</div>
</template>
<script type="text/javascript">
	import images from "@/assets/timg.jpg"
	import vFooter from "../footer.vue"
	import vCancelalter from "@/components/common/cancelAlter.vue"
/*
status
0 ---- 抢到单
1 ---- 接到乘客
2 ---- 乘客支付完成 
*/
	Mock.mock('/driverpay',{
		"id|1-2000":2000,
		"status":0,
		"startTitle":"某某学校",
		"startArea":"广州市番禺区海伦堡创业园公寓",
		"endTitle":"某某学校",
		"endArea":"广州市番禺区海伦堡创业园",
		"monney|300-500":500,
		"pass":[{
			"name":"邹小一",
			"phone":"1501644708",
			"picture":images
		}],
		"comments":[{
			"star|1-5":5,
			"text":"客户留言客户留言",
			"radio":["满意","司机服务周到"]

		}],
		"cancelTimer|0-2":2,
		"cancelStatus":0
	})

	// 0 取消成功
	Mock.mock('/drivercancel',{
		"status":1
	})

	// 确认乘客上车 确认上车 0
	Mock.mock('/passcome',{
		"status":0
	})

	// 通知乘客支付 0提交成功
	Mock.mock('/passpay',{
		"status":0
	})

	export default{
		components:{
			vFooter,
			vCancelalter
		}
		,data(){
			return{
				cancelTitle:"",
				cancelsectit:"",
				cancelStatus:false,
				passengers:{},
				commentsStatus:false,
				cancel:['一天之内只能取消2次','一天之内只能取消2次，还剩1次','一天之内只能取消2次，还剩0次']
			}
		}
		,methods:{
			async getPassData(){
				let orderId=this.$store.state.orderId;
				if(!orderId){
					this.$router.replace({name:"dri_order"});
					return;
				}
				let odat={"orderId":orderId};
				const dat = await this.$ajaxPost('/driverpay',odat);
				if(dat){
					this.passengers=dat;
				}
			}
			,async postCome(){
				this.$parent.msgSend('正在提交');
				await this.$sleep(2);                                  	//测试时候用的
				let odat={"orderId":this.$store.state.orderId,"come":!0};
				const dat = await this.$ajaxPost('/passcome',odat);
				if(dat.status==0){
					await this.$parent.endSend('成功提交',0.5);
					this.getPassData();
				}else{
					await this.$parent.endSend('提交失败',0.5);
				}
			}
			,async postPay(){
				this.$parent.msgSend('正在提交');
				await this.$sleep(2);                                  	//测试时候用的
				let odat={"orderId":this.$store.state.orderId,"pay":!0};
				const dat = await this.$ajaxPost('/passpay',odat);
				if(dat.status==0){
					await this.$parent.endSend('成功提交',0.5);
					this.getPassData();
				}else{
					await this.$parent.endSend('提交失败',0.5);
				}
			}
			,async postCancel(){
				this.cancelStatus=!1;
				this.$parent.msgSend('正在取消');
				await this.$sleep(2);
				let odat={"orderId":this.$store.state.orderId};
				const dat = await this.$ajaxPost('/drivercancel',odat);
				if(dat.status==0){
					await this.$parent.endSend('成功取消',0.5);
					this.$router.replace({name:'dri_order'});
				}else{
					await this.$parent.endSend('取消失败',0.5);
				}
			}
			,commentsAction(){
				this.commentsStatus=!0;
			}
			,cancelAction(val){
				if(val==0) {
					this.cancelAlter('你确定取消此次订单吗？');
				} else if(val==1){
					this.$parent.msgAlter('对不起此次订单不能取消。')
				}
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
			this.getPassData();
		}
	}
</script>
<style type="text/css" scoped>
	.dri-pass{width: 100%;padding-bottom: 3.75rem;}
	.pass-header{width: 100%;height: 4.05rem;border-bottom: 1px solid #cccccc;position: fixed;top: 0;left: 0;padding: 0.5rem 0.5rem 0;background: #ffffff;z-index: 1000;}
	.p-img{width: 2.9rem;height: 2.9rem;border-radius: 50%;-webkit-border-radius:50%;overflow: hidden;}
	.p-img img{width: 100%;height: 100%;}
	.pass-header p{font-size: 0.9rem;height: 3.05rem;line-height: 3.05rem;padding-left:0.7rem;}
	.pass-header .phone{width: 2.9rem;height: 2.9rem;border-radius: 50%;-webkit-border-radius:50%;}
	.pass-header .phone i{font-size: 2.9rem;color: #ffa600}
	.dri-pay{width: 100%;padding-top:4.5rem;}

	.dri-area{width: 100%;padding-bottom: 1.625rem;border-bottom: 0.025rem solid #cccccc;}
	.order-area{width: 100%;height: 2.5rem;font-size: 0.85rem;margin-top:1.625rem;}
	.oa-left{height:100%;line-height: 2.5rem;margin-right: 0.7rem;margin-left: 2.125rem;}
	.oa-left i{font-size: 0.9rem;color: #2fb700;margin-right: 0.5rem}
	.oa-left i.act{color: #fe0202;}
	.oa-right{width: 8.25rem;}
	.oa-right h3{width: 100%;font-size: 1.0rem;height:1.2rem;line-height: 1.2rem;color: #545454;font-weight: normal;padding-bottom: 0.55rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
	.oa-right p{width: 100%;height: 0.9rem;font-size: 0.7rem;line-height: 0.9rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;}
	.getmonny{padding-top: 2.5rem;width: 100%;text-align: center;font-size: 0.9rem}
	.getmonny span{font-size: 0.65rem;}
	.getmonny span strong{font-size: 1.75rem;font-weight: normal;}
	.pass-order{padding: 0 2.0rem;margin-top:2.0rem;}
	.del-order{padding: 0 2.0rem;margin-top: 0.75rem;}
	.del-order .form-btn{background: none;border:1px solid #fe7002;}
	.del-order .form-btn a{color: #fe7002;}
	.del-warn{text-align: center;padding-top: 0.825rem;color: #9c9b9b;}
	.pass-haspay{padding: 0 2.0rem;margin-top:2.0rem;text-align: center;}
	.pass-haspay p{font-size: 1.0rem;color: #fe9e6c;padding-bottom:0.75rem;}
	.pass-haspay a{display: block;font-size:0.7rem;}
	.pass-haspay a i{font-size: 0.6rem;color: #9c9b9b}
	/*乘客评论部分*/
	.pass-commonts{padding:4.05rem 0 0 1.35rem;}
	.pass-star{width:100%;height: 3.5rem;line-height: 3.5rem;border-bottom: 0.025rem solid #cccccc;font-size: 0.85rem;}
	.pass-star p{width: 2.5rem;}
	.pass-star i{font-size: 1.0rem;color: #ffa600;}
	.text-box{padding-top:1.62rem;}
	.text-box p{width: 2.5rem;font-size: 0.85rem;line-height:1.2rem}
	.text-box .txt{font-size: 0.85rem;width: 12.5rem;color: #9c9b9b;line-height:1.2rem}
	.radio{width: 100%;margin-top: 1.4rem;}
	.radio a{display: inline-block;font-size: 0.75rem;line-height: 0.75rem;padding: 0.4rem 0.75rem;border:1px solid #ffa600;border-radius: 0.3rem;color: #ffa600;margin-right: 0.25rem;}
</style>