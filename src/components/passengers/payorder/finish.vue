<template> 
<div class="myorder">
	<div class="order-report bc">
		<div class="order-pl">
			<div class="order-driver clearfix" v-for="item in orderList.driver">
				<div class="dri-left clearfix" >
					<div class="dri-img"><img :src="item.picture"/></div>
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
		</div>
	</div>
	<div class="play-success">
		<div class="">
			<i class="icon iconfont icon-wancheng"></i>
			<P>完成支付!</P>
			<span>共{{orderList.monney}}元</span>
		</div>
	</div>
	<div class="comments bc">
		<div class="com-title">给司机的评价</div>
		<div class="com-star">
			<i @click="starNum=n+1" v-for="n in 5" class="icon iconfont icon-xingxing" :class="{'act':n<starNum}" ></i>
		</div>	
		<div class="com-form clearfix">
			<label :class="{'active':n==comNum}" class="hover" @click="comNum=n" v-for="(item,n) in comlist">
				{{item}}<input type="radio" name="com" :value="item" v-model="comments">
			</label>
			<input type="text" name="comtext" class="com-text" placeholder="输入评价内容" v-model="comtext" >
		</div>
	</div>
	<div class="com-order bc">
		<div class="form-btn bc hover" @click="sendComments">
			<a href="javascript:;">提交</a>
		</div>
	</div>
</div>
</template>
<script> 

	//发送评论 0 成功 1 失败
	Mock.mock('/sendcom',{
		"status":0
	})

	export default{
		name:"finish"
		,props:{
			orderList:Object
		}
		,data(){
			return{
				alterStatus: false,
				alterTitle: "",
				starNum:0,
				comNum:-1,
				comments:null,
				comtext:"",
				comlist:['满意','司机服务周到','不满意','司机服务有待提高']
			}
		}
		,methods:{
			async sendComments(){
				let tha=this;
				if(!this.starNum){
					this.$parent.$parent.msgAlter("星级不能为空");
					return;
				}
				if(!this.comments){
					this.$parent.$parent.msgAlter("司机评价不能为空");
					return;
				}
				//data数据上传
				let comments ={
					"dri_id":tha.orderList.driver.id,
					"orderId":tha.orderList.id,
					"comments":tha.comments,
					"comtext":tha.comtext,
					"star":tha.starNum
				}
				this.$parent.$parent.msgSend("正在发送");
				const dat = await this.$ajaxPost('/sendcom',comments);
				this.$sleep(2);												//测试
				if(dat.status==0){
					await this.$parent.$parent.endSend("发送成功",0.5);
					this.$router.replace({name:"user"})
				}else{
					await this.$parent.$parent.endSend("发送失败",0.5);
				}

			}
		}
	}
</script>
<style scoped> 
	.order-report{padding:0 0.6rem;}
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
	.order-pl{position: relative;padding: 0.75rem 0;}
	.order-pl:after{position: absolute;content: " ";width: 100%;border-bottom: 0.025rem solid #abaaaa;bottom: 0;left: 0;}
	.play-success{width: 100%;text-align: center;padding: 0.9rem 0 0;}
	.play-success i{font-size: 4.1rem;color: #fe7002;}
	.play-success p{font-size: 1.1rem;padding:0.5rem 0 0.25rem;}
	.play-success span{display: block;font-size: 0.9rem;color: #a4a4a4;}
	.comments{padding: 1.125rem 1.85rem 0;}
	.comments .com-title{text-align: center;height: 0.8rem;line-height: 0.8rem;font-size: 0.8rem;position: relative;}
	.comments .com-title:before{position: absolute;content: " ";width: 4.0rem;border-bottom:0.025rem solid #ABAAAA;left: 0;top:0.425rem;}
	.comments .com-title:after{position: absolute;content: " ";width: 4.0rem;border-bottom:0.025rem solid #ABAAAA;right: 0;top:0.425rem;}
	.comments .com-star{text-align: center;height: 4.0rem;line-height: 4.0rem;}
	.comments .com-star i{font-size: 1.625rem;letter-spacing: 1.125rem;}
	.comments .com-star i.act{color: #ffa600;}
	.com-form label input[type="radio"]{display: none;}
	.com-form label {display: block;margin-bottom: 0.8rem;height: 1.9rem;border: 1px solid #a0a0a0;color: #a0a0a0;border-radius: 0.25rem 0.25rem;-webkit-border-radius:0.25rem 0.25rem;text-align: center;line-height: 1.9rem;font-size:0.8rem;}
	.com-form label.active{color: #ffa600;border-color: #ffa600}
	.com-form label:nth-of-type(odd){float: left;width: 4.7rem;}
	.com-form label:nth-of-type(even){float: right;width: 9.35rem;}
	.com-text{width: 100%;height: 2.5rem;line-height: 2.5rem;border:none;background: #efefef;outline: none;font-size: 0.8rem;border-radius: 0.25rem 0.25rem;-webkit-border-radius:0.25rem 0.25rem;text-indent: 0.5rem;}
	.com-order{padding: 0.8rem 1.85rem 0.25rem;margin-bottom:0.75rem;}
</style>