<template> 
<div class="queding" v-show="showStatus" >
	<div class="layui-m-layershade" @click="hideFun(!1)"></div>
	<div class="layui-m-layermain">
		<div class="layui-m-layersection">
			<div class="layui-m-layerchild layui-m-anim-scale layui-content-que bc">
				<div class="layui-title-que">{{title}}</div>
				<p class="p-glod-que">{{sectit}}</p>
				<div class="layui-btn-sec">
					<a class="act" href="javascript:;" @click="hideFun(!1)" >取消</a>
					<a href="javascript:;" @click="comFun(!1)" >确定</a>
				</div>
			</div>
			
		</div>
	</div>	
</div>
</template>
<script> 
	export default{
		name:"cancelalter",
		props:{
			title:{
				type:String
			}
			,sectit:{
				type:String
			}
			,showStatus:{
				type:Boolean,
				default: false
			}	
		}
		,data(){
			return{

			}
		}
		,methods:{
			hideFun(val){
				this.$emit("hideFun",val);
			},
			comFun(){
				this.$emit("comFun")
			}
		}
	}
</script>