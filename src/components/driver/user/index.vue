<template>
	<div class="man-center">
		<div class="user-top">
			<div class="user-header">
				<div class="h-img"><img :src="driver.picture"></div>	
				<p class="name">{{driver.name}}</p>
				<div class="star">
					<i class="icon iconfont icon-xingxing"></i>
					<i class="icon iconfont icon-xingxing"></i>
					<i class="icon iconfont icon-xingxing"></i>
				</div>
				<p class="plate">{{driver.plate}}</p>
				<div class="left-zs">
					<p>总收入</p>
					<strong>{{driver.monney}}</strong>
					<span>元</span>
				</div>
				<div class="left-zs right">
					<p>总订单数</p>
					<strong>{{driver.ordernum}}</strong><span>元</span>
				</div>
			</div>
			<nav class="usernav fx">
				<div class="l-f">订单记录</div>
				<div class="l-r" >
					<a v-for="(item,n) in navlist" :class="{'act':n==indexNum}" @click="indexNum=n" href="javascript:;">{{item.title}}</a>
				</div>
			</nav>
		</div>
		<div class="dri-order-list">
			<div v-for="(item,n) in navlist" v-show="n==indexNum">
				<v-orderlist :url="item.url" />
			</div>
		</div>
		<v-footer />	
	</div>
</template>
<script type="text/javascript">
	import images from "@/assets/timg.jpg";
	import vFooter from "../footer.vue" ;
	import vOrderlist from './order_list.vue';

	Mock.mock('/driuser',{
		"id|1000-2000":2000,
		"name":"李师傅",
		"plate":"粵B12345",
		"monney":"10000",
		"ordernum":"900",
		"picture":images
	})

	export default{
		components:{
			vFooter,
			vOrderlist
		}
		,data(){
			return{
				driver:{},
				indexNum:0,
				navlist:[
				{'title':'今天','url':'/getOrder'},
				{'title':'本周','url':'/getOrder'},
				{'title':'本月','url':'/getOrder'}
				]
			}
		}
		,methods:{
			async getData(){
				const dat = await this.$ajaxPost('/driuser',{});
				if(dat){
					this.driver=dat;
				}
			}
		}
		,created(){
			this.getData();
		}
	}
</script>
<style type="text/css" scoped>
	.user-top{width: 100%;position: fixed;top: 0;left: 0;background: #ffffff;z-index: 10000;}
	.h-img{width: 100%;text-align: center;padding-top: 0.925rem;}
	.h-img img{width: 3.65rem;height: 3.65rem;border-radius: 50%;-webkit-border-radius:50%;}
	.user-header{width: 100%;height: 9.25rem;position: relative;}
	.user-header p{text-align: center;}
	.star{text-align: center;}
	.name{font-size: 0.9rem;line-height: 0.9rem;padding:0.55rem 0 0.3rem;}
	.star i{font-size: 0.8rem;color:  #ffa600}
	.plate{font-size: 0.65rem;padding-top: 0.3rem;}
	.left-zs{position: absolute;left: 0.75rem;top: 3.1rem;}
	.left-zs p{font-size: 0.7rem;color: #9c9b9b;text-align: left;line-height: 0.7;padding-bottom: 0.5rem;}
	.left-zs strong{float: left;font-size:0.9rem;font-weight: normal;line-height: 0.9rem;}
	.left-zs span{float: left;margin: 0.4rem 0.2rem 0;}
	.left-zs.right{left: auto;right: 0.75rem}
	.usernav{width: 100%;height: 2.0rem;line-height: 2.0rem;font-size: 0.65rem;}
	.usernav .l-f{width: 10.0rem;height: 2.0125rem;background: #e6e6e6;text-indent: 0.75rem;border-bottom: 0.025rem
		solid #e6e6e6;}
	.usernav .l-r{flex: 1;-webkit-flex:1;-webkit-box-flex: 1;box-flex: 1;}
	.usernav .l-r a{float: left;width: 33.33%;height: 100%;box-sizing:border-box;-webkit-box-sizing:border-box;text-align: center;border-left: 1px solid #cccccc;border-bottom: 0.025rem
		solid #cccccc;position: relative;}
	.usernav .l-r a.act:after{position: absolute;content: " ";width: 100%;border-bottom:0.1rem solid #ffa600;left: 0;bottom: -0.025rem;}	
	
</style>