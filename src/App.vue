<template>
  <div id="container">
    <router-view v-show="!routerStatus" />
    <v-msgalter :title="alterTitle" @hideFun="alterStatus=false" :showStatus="alterStatus" />
    <v-send :title="sendTitle" :sendStatus="sendStatus" />
  </div>
</template>

<script>
import vMsgalter from '@/components/common/msgAlter.vue'
import vSend from '@/components/common/send.vue'

export default {
  name: 'container'
  ,components:{
  	vMsgalter,
  	vSend
  }
  ,data(){
  	return{
  		alterStatus:false,
		alterTitle:'',
		sendTitle:'',
		sendStatus:false,
		routerStatus:false
  	}
  }
  ,methods:{
  	getParam(name){
        return window.location.href.match(new RegExp('[?&]' + name + '=([^#?&]+)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
    }
  	,msgAlter(val){
		this.alterTitle=val;
		this.alterStatus=!0;
	}
	,msgSend(val){
		this.sendTitle=val;
		this.sendStatus=!0;
	}
	,endSend(val,ms){
		return new Promise((resolve,reject)=>{
			this.sendTitle=val;
			setTimeout(()=>{
				this.sendStatus=!1;
				resolve();
			},ms*1000)
		})
	}
  }
  ,created(){
  		//this.msgSend("正在加载");
	  	const url = window.location.href;
	  	let local=window.localStorage;
		let session=window.sessionStorage;	
		/*
		if(!url.indexOf('login')){
			if(url.indexOf('token')!=-1){
			let token = this.getParam("token");	    
			    if(token){
			  		local.setItem("token",token);
			  		let _url = session.getItem("_url");
			  		if(_url){
			  			session.setItem("_url",null);
			  			window.location.href = _url;
			  		}
			  	} else {
			  		this.$router.replace({name:'login'});
			  	}
			  	this.routerStatus=!0;
			  	this.endSend("加载完成",0.5);
		 	} else {
			  	if(!local.getItem("token")){
			  		session.setItem("_url",url);
			  		window.location.href="http://ts.incar888.com/api_car/checkme?url="+encodeURIComponent(url);
			  	}else{
			  		this.routerStatus=!0;
			  		this.endSend("加载完成",0.5);
			  	}
		  	}
		}
		*/
  	}
}
</script>
<style>
html{width: 100%;height: 100%;min-height: 33.25rem;overflow-x: hidden;}
body{width: 100%;height: 100%;font-family: "微软雅黑";color: #545454;font-size: 0.6rem;}
#container{width:100%;height:100%;}
*{margin:0;padding:0}
a img{border:0}
li{list-style: none;}
a{text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0);color: #6d6d6d}
.u-left{float: left;}
.u-right{float: right;}
button,input{border:none;outline: none;}
.clearfix:after,.clearfix:before{content: " ";display: table;}
.clearfix:after,.clearfix{clear: both;*zoom: 1;}
.fx{display: flex;display:-webkit-flex;display: box;display: -webkit-box;}
.bc{box-sizing:border-box;-webkit-box-sizing:border-box;}
.hover{position: relative;overflow: hidden;}
.hover:after {content: "";display: block;position: absolute;width: 100%;height: 100%;top: 0;left: 0;pointer-events: none;background-image: radial-gradient(circle, #666 10%, transparent 10.01%);background-repeat: no-repeat;background-position: 50%;transform: scale(10, 10);opacity: 0;transition: transform .3s, opacity .5s;}
.hover:active:after{transform: scale(0, 0);opacity: .3;transition: 0s;}
.form-btn {width: 100%;height: 2.4rem;line-height: 2.4rem;text-align: center;font-size: 1.0rem;background: #fe7002;border-radius:10px;-webkit-border-radius:0.3rem;position: relative;overflow: hidden;}
.form-btn a{display: block;color: #ffffff;}

</style>
