<template> 
	<div class="search"> 
		<div class="search-input bc">
			<a class="back-btn" @click="goback" href="javascript:;"><i class="icon iconfont icon-jiantou3"></i></a>
			<input class="input" autofocus="autofocus" type="text" name="" :placeholder="'搜索'+searchType" v-model.trim="search" />
			<a class="search-btn" @click="sendSearch" href="javascript:;">搜索</a>
		</div>
		<div class="areas">
			<div class="area-list">
				<ul id="areaBox">
					<li v-for="item in listPlace">
						<a href="javascript:;" @click="$parent.setPlaceArea(item.title,item.id)">
							<h3>{{item.title}}</h3>
							<p>{{item.content}}</p>	
						</a> 
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script> 
	//获取路线位置
	Mock.mock('/search',
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
		name: 'search'
		,data(){
			return{
				listPlace:[],
				search:'',
				searchType:this.$parent.startHide ? '起始':'终点'
			}
		}
		,methods:{
			searchPlaceData(){
				var tha=this;
				this.$https.post("/search",{
					"search": tha.search
				}).then(function(data){
					tha.listPlace = data.data;
				})
			}
			,sendSearch(){
				if(this.search==''){
					this.$parent.$parent.msgAlter('不能为空');
					return;
				}
				this.searchPlaceData();
			}
			,goback(){
				this.$emit("backFun");
			}
		}
	}
</script>
<style type="text/css" scoped> 
.search{width: 100%;height: 100%;}
.search-input{width: 100%;height: 2.5rem;position: fixed;top: 0;left: 0;background: #ffffff;padding: 0.375rem 2.5rem 0.375rem 1.75rem;border-bottom:0.025rem solid #d5d5d5;}
.input{display: block;width: 100%;height:1.75rem;line-height: 1.75rem;border:none;background: #EFEFEF;text-indent: 0.5rem;border-radius: 0.3rem;outline: none;font-size: 0.8rem;color: #000;}
.back-btn,.search-btn{position: absolute;}
.back-btn{left: 0.25rem;top: 0.625rem;transform:rotate(180deg);width:1.25rem;height:1.25rem;-webkit-transform:rotate(180deg);}
.back-btn i{font-size:1.25rem;font-weight:900;}
.search-btn{width: 2.0rem;height: 1.75rem;text-align: center;line-height: 1.75rem;background: #a2a2a2;right: 0.25rem;top:0.375rem;border-radius: 0.3rem;color: #ffffff}
.areas{padding-top: 2.5rem;}
</style>