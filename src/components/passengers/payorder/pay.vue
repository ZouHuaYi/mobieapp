<template> 
<div class="pay-way" v-show="showStatus">
	<div class="layui-m-layershade" @click="hideFun"></div>
	<div class="layui-m-layermain">
		<div class="layui-m-layersection">
			<div class="layui-m-layerchild layui-m-anim-scale layui-content-pay bc">
				<div class="layui-title">支付方式</div>
				<div class="layui-radio clearfix">
					<input id="jdpay" type="radio" name="d" value="0" checked v-model="payway" />
					<label for="jd" ><i style="color: #fe7002" class="icon iconfont icon-qianbao"></i><span>金豆支付{{monney}}个</span></label>
				</div>
				<p class="glod-need bc" v-if="monney-userGlod>0">(还剩{{userGlod}}个,不足支付)</p>
				<div class="layui-radio clearfix" style="margin-top: 1.5rem">
					<input id="wxpay" type="radio" name="d" value="1" v-model="payway" />
					<label for="wxpay" ><i style="color: #46c302" class="icon iconfont icon-weixin1"></i><span>微信支付</span></label>
				</div>
				<div class="layui-my-btn hover" @click="payMonney">
					<a href="javascript:;">确定支付</a>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script> 
	
	Mock.mock('/userGlod',{
		"glod|10-100":100
	})
	// 0 金豆支付成功
	Mock.mock('/payGlod',{
		"status":0
	})

	export default{
		props:{
			showStatus:{
				type:Boolean,
				default: false
			},
			monney:{
				type:[Number,String]
			}	
		},
		data(){
			return{
				payway:0,      //支付方式 0：金豆支付 ；1：微信支付
				userGlod:""
			}
		},
		methods:{
			hideFun(){
				this.$emit("hideFun")
			}
			,async getGlod(){
				const userdat = await this.$ajaxPost('/userGlod',{});
				if(userdat){
					this.userGlod = userdat.glod;
				}
			}
			,payMonney(){
				let tha=this;
				this.hideFun();
				if(this.payway==0){
					this.$https.post('/payGlod',{
						"orderId":tha.$store.state.orderId
					}).then((data)=>{
						if(data.data.status==0){
							tha.hideFun();
						}
					})
					//金豆支付
					console.log('金豆支付');

				}else{
					console.log('微信支付');
					//微信支付
					tha.hideFun();
				}
			}
		},
		created(){
			//需要支付的金额
			this.getGlod();
		}
	}

</script>

</style>
<style type="text/css" scoped>
.layui-content-pay{width: 15.25rem;padding: 0 1.2rem 0.75rem;border-radius: 0.3rem;} 
.layui-radio{font-size: 1.05rem;line-height: 1.05rem;}
.layui-radio input[type="radio"]{display: block;width: 1.05rem;height: 1.05rem;float: left;}
.layui-radio label{float: left;}
.layui-radio i{font-size: 1.05rem;padding: 0 0.95rem 0 0.5rem;}
.glod-need{padding-left: 3.5rem;font-size: 0.7rem;line-height: 0.7rem;margin-top: 0.55rem;color: #9C9B9B;}
.pay-way .layui-my-btn{margin-top: 1.5rem;margin-bottom: 0.75rem;}
.layui-title{font-size: 1.15rem;text-align: center;padding: 1.1rem 0 1.6rem;}
.layui-my-btn{width: 100%;height: 2.5rem;background: #fe7002;line-height: 2.5rem;border-radius: 0.3rem;text-align: center;margin-top: 0.9rem;}
.layui-my-btn a{display: block;width: 100%;height: 100%;color: #ffffff;font-size: 1.05rem;}
</style>