<template> 
<div class="start-area">
	<div class="areaBox" v-show="showIndex==0">
		<div class="area-header" v-show="startHide"><i class="icon iconfont icon-dingwei"></i>&nbsp;<span>起点位置</span></div>
		<div class="area-header end" v-show="!startHide"><i class="icon iconfont icon-dingwei"></i>&nbsp;<span>终点位置</span></div>
		<div class="area-search">
			<div class="input" @click="showIndex=1"><i class="icon iconfont icon-sousuo"></i>输入关键字</div>
		</div>
		<div class="area-list">
			<ul id="areaBox">
				<li v-for="item in listPlace">
					<a href="javascript:;" @click="setPlaceArea(item.title,item.id)">
						<h3>{{item.title}}</h3>
						<p>{{item.content}}</p>	
					</a> 
				</li>
			</ul>
		</div>
	</div>
	<v-search v-show="showIndex==1" @backFun="showIndex=0" />	
</div>
</template>
<script>
	import vSearch from './search.vue'
	
	//获取路线位置
	Mock.mock('/place',
		[
		{id:"1231",title:"珠村",content:"广州市番禺区某某街道43号"}
		,{id:"1232",title:"沙头村",content:"广州市番禺区某某街道5号"}
		,{id:"1233",title:"大富村",content:"广州市番禺区某某街道535号"}
		,{id:"1234",title:"大罗村",content:"广州市番禺区某某街道75号"}
		,{id:"1235",title:"小罗村",content:"广州市番禺区某某街道6464号"}
		,{id:"1236",title:"小平村",content:"广州市番禺区某某街道09号"}
		,{id:"1237",title:"大学城",content:"广州市番禺区某某街道3131号"}
		,{id:"1238",title:"江南新邨",content:"广州市番禺区某某街道433号"}
		]
	)

	export default{
		name:"areas"
		,components:{
			vSearch
		}
		,data(){
			return{
				listPlace:[],
				showIndex:0
			}
		},
		methods:{
			getPlaceData(){
				var tha=this;
				this.$https.post("/place",{
					
				}).then(function(data){
					tha.listPlace=data.data;
				})
			},
			setPlaceArea(val,id){
				if(this.$route.query.ap =='start'){
					this.$store.startAreaAction(val,parseInt(id));
				}else{
					this.$store.endAreaAction(val,parseInt(id));
				}
				this.$router.replace({name:"place"})
				
			}
		}
		,created(){
			this.getPlaceData();
		}
		,computed:{
			startHide(){
				return this.$route.query.ap=='start' ? true : false
			}
		}

	}
</script>

<style type="text/css" scoped> 
.start-area{width: 100%;background: #f7f7f7;}
.area-header{width: 100%;padding: 1.0rem 0 0;text-align: center;font-size: 1.0rem;}
.area-header i{font-size: 1.45rem;color: #2fb700;vertical-align: middle;}
.area-header.end i{color: #fe0202;}
.area-search{box-sizing:border-box;-webkit-box-sizing:border-box;width: 100%;padding: 1.125rem 1.625rem;}
.area-search .input{display: block;width: 100%;height:1.8rem;line-height: 1.8rem;text-align: center;border:none;background: #ffffff;border-radius: 0.9rem;outline: none;font-size: 0.8rem;color: #989898;}
.area-search .input i{font-size: 1.5rem;vertical-align:middle;}
</style>
<style type="text/css"> 
.area-list{width: 100%;background: #ffffff;}
.area-list ul li{width: 100%;padding: 1.0rem 0.9rem 0.75rem;box-sizing:border-box;-webkit-box-sizing:border-box;border-top:1px solid #d5d5d5;}
.area-list ul li a{display: block;width: 100%;}
.area-list ul li a h3{font-size: 0.95rem;line-height: 0.95rem;color: #545454;font-weight: normal;}
.area-list ul li a p{width: 100%;font-size: 0.65rem;color: #c2c2c2;line-height: 0.65rem;padding-top: 0.5rem;overflow:hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1; }
</style>