import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

//token 请求
Mock.mock('/token',{
	"token":"4243535356",
	"tokenDate" :"1522339200"
})

var local=window.localStorage;

function getToken(url){
	axios.post(url,{
		//data
	}).then((data)=>{
		local.setItem("token",data.data.token);
		local.setItem("tokenDate",data.data.tokenDate);
	})
}

setInterval(()=>{
	let token=local.getItem("token");
	let tokenData=local.getItem("tokenDate");
	if(token){
		let des = tokenData -Math.round(new Date()/1000)
		if(des<=0){
			getToken('/token')
		}
	}
},3600000)

// 请求的基本设置
var instance = axios.create({
  	baseURL: '',
 	timeout: 10000,
  	headers: {
  		'token': local.getItem("token") ? local.getItem("token") : ''
  	}
});

Vue.prototype.$https=instance;

Vue.prototype.$ajaxPost=function(url,data){
	return new Promise((resolve,reject)=>{
		instance.post(url,data).then((data)=>{
			resolve(data.data);
		}).catch((error)=>{
			reject(!1);
		})
	})
}

Vue.prototype.$formatDate = function (fmt,time) { 
  let timer = new Date(time*1000);
  let o = {
    "M+": timer.getMonth() + 1,    //月份 
    "d+": timer.getDate(),         //日 
    "H+": timer.getHours(),        //小时 
    "m+": timer.getMinutes(),      //分 
    "s+": timer.getSeconds(),      //秒 
    "S":  timer.getMilliseconds()  //毫秒 
  };
  if (/(y+)/.test(fmt)){
  	fmt = fmt.replace(RegExp.$1, (timer.getFullYear() + "").substr(4 - RegExp.$1.length));
  } 
  for (var k in o){
  	if (new RegExp("(" + k + ")").test(fmt)) {
  		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  	}
  }
  return fmt;
};

Vue.prototype.$sleep=function(ms){
	return new Promise(resolve => setTimeout(resolve,ms*1000))
}

String.prototype.trim = function(){
    return this.replace(/^\s+(.*?)\s+$/, "");
}

let history=window.sessionStorage;

//状态管理，相当于全局变量
var store={
	debug: true,
	state: {
	   startArea: {place:'起点位置',placeId:0},
	   endArea:   {place:'终点位置',placeId:0},
	   orderId:   history.getItem("orderId")
	}
	,startAreaAction(value,id){
		this.state.startArea.place = value;
		this.state.startArea.placeId = id;
	}
	,clearStartAreaAction(){
		this.state.startArea.place = '起点位置';
		this.state.startArea.placeId = 0;
	}
	,endAreaAction(value,id){
		this.state.endArea.place = value;
		this.state.endArea.placeId = id;
	}
	,clearEndAreaAction(){
		this.state.endArea.place = '终点位置';
		this.state.endArea.placeId = 0;
	}
	,orderIdAction(value){
		this.state.orderId=value;
		history.setItem("orderId",value);
	}
	,clearOrderIdAction(){
		this.state.orderId=0;
		history.setItem("orderId",0);
	}
}

Vue.prototype.$store=store;

new Vue({
  el: '#container',
  router,
  components: { App },
  template: '<App/>'
})
