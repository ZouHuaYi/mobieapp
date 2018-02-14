<template> 
<div class="play-list">
		<nav class="play-nav">
			<ul>
				<li :class="{'active':n==indexNum}" @click="indexNum=n" v-for="(item,n) in navlist">{{item.title}}</li>
			</ul>
		</nav>
		<!-- 中间的滚动部分 -->
		<div class="scroll-list">
		   <div v-show="n==indexNum" v-for="(item,n) in navlist"><v-orderlist :status="item.status" :navtit="item.title" :url="item.url" :color="item.color"/></v-orderlist></div>
	    </div>
	    <v-footer />
	</div>
</template>
<script> 
import vOrderlist from "./order_list.vue";
import vFooter from "./footer.vue";
	export default{
		name:"order"
		,components:{
			vOrderlist,
			vFooter
		}
		,data(){
			return{
				navlist:[
					{title:'等待',url:"/getOrder",color:"#ff0000",status:0},	//url 是请求的地址  status=0 可以跳转 1 不能跳
					{title:'未支付',url:"/getOrder",color:"#ffa600",status:0},	//	等待 wait  未支付 nofinish 无效 invalid 完成 finsh		
					{title:'无效',url:"/getOrder",color:"#d8d8d8",status:1},
					{title:'完成',url:"/getOrder",color:"#23b003",status:1}
					]
				,indexNum:0	
				
			}
		}
		,methods:{
			getTab(val){
				
			}
		}

	}
</script>
<style> 
.play-nav{width: 100%;position: fixed;top: 0px;left: 0px;height: 2.25rem;border-bottom: 0.025rem solid #d4d3d2;line-height: 2.25rem;z-index:10000;background:#ffffff;}
.play-nav ul li{float: left;width: 3.5rem;height: 2.175rem;border-left: 0.025rem solid  #d4d3d2;margin-left:-0.025rem;text-align: center;font-size: 0.85rem;border-bottom: 3px solid transparent;position: relative;}
.play-nav ul li.active:after{position: absolute;content: " ";width: 100%;left: 0;bottom: -0.1rem;color: #fe7002;border-bottom: 0.1rem solid #fe7002;}

.order-play{width: 100%;padding-top: 2.25rem;padding-bottom:3.0rem;}
.opl-item{padding: 0 0.75rem 0.875rem;border-bottom: 0.025rem solid #d4d3d2;}
.opl-title{width: 100%;height: 2.5rem;border-bottom: 0.025rem solid #c2c2c2}
.opl-title p{float: left;line-height: 2.5rem;font-size: 0.7rem;color: #b9b8b8}
.opl-title span{float: right;width: 2.45rem;height: 1.0rem;border:0.025rem solid #ffa600;text-align: center;line-height: 1.0rem;font-size: 0.55rem;color: #ffa600;margin-top: 0.65rem;}
.opt-box .p-l p{font-size: 0.65rem;line-height: 0.65rem;padding-top: 0.65rem;}
.opt-box .p-l p span{display: inline-block;padding-left: 0.625rem;}
.opt-box .p-l p i{font-size: 0.65rem;color: #d3d1d1;}
.opt-box .p-r{color: #bbbaba;font-size: 0.7rem;line-height: 0.7rem;margin-top: 1.95rem;}
</style>