<template>
	<div class="register">
		<div class="wx-header bc"><img :src="wxheader"></div>
		<div class="form-login">
			<div class="form-groud fx">
				<label><i class="icon iconfont icon-shouji"></i></label>
				<input type="text" name="phone" placeholder="输入手机号码" v-model="phone">
			</div>
			<div class="form-groud fx">
				<label><i class="icon iconfont icon-yanzhengma"></i></label>
				<input type="text"  placeholder="输入验证码" v-model="vcode">
				<button class="vcode" :class="{'disabled' : disabled}" href="javascript:;" @click="getVode" >{{dxtext}}</button>
			</div>
			<div class="form-btn">
				<a class="hover" :class="{'disabled' : disabled}" href="javascript:;" @click="submitCode">注册</a>
			</div>
		</div>
		<div class="footers">版权所有&copy;广州鹰卡汽车服务有限公司</div>
	</div>
</template>
<script>
	import imgs from '@/assets/timg.jpg';


	//发送验证码
	Mock.mock('/vcode',
		{
			"status":1,
			"error"  :"对不起这个号码无法接收信息"
		}
	)

	//登录验证
	Mock.mock('/login',
		{
			"status":1,
			"error" :"后台正在维护中无法登录...",
			"token" :"1234567890",
			"tokenData":"1517965305"	
		}
	)

	export default {
	  name: 'login'
	  ,data () {
	    return {
	     	wxheader:imgs,
	     	dxtext:'获取验证码',
	     	disabled:false,
	     	phone:'',
	     	vcode:''
	    }
	  },
	  methods:{
	  	getVode () {
	 		let phone = this.phone;
		    let reg = /^1\d{10}$/;  
		    let tha = this;
		    if(this.disabled) return;                                  		 	//验证数字
		    if (reg.test(phone)) {
		        this.disabled=true;
		          this.$https.post('/vcode',{
		          	phone:phone,
		          	voiceFlag : 'false'
		          }).then(function(data){
		          	if (data.data.status == 1) {
                        var time = 59;                         						//设置的时间
                        var t = setInterval(function() {
                            tha.dxtext="已发送" + '(' + time + ')';
                            --time;
                            if (time == 0) {
                                clearInterval(t);
                                 tha.dxtext='重新获取';
                                 tha.disabled=false;
                            }
                        }, 1000);
                    } else {
                    	  tha.$parent.msgAlter("您的号码无法接收短信！");
                    	 tha.disabled=false;
                    }

		          }).catch(function(error){
		          		 tha.$parent.msgAlter("对不起出错啦!");
		          		 tha.disabled=true;
		          })
		      } else {
		      	 tha.$parent.msgAlter("请输入正确的手机号！");
		      }
		           
	  	},
	  	submitCode(){
	  		var code = this.vcode;
	  		var phone = this.phone;
	  		var tha = this;
	  		var reg = /^1\d{10}$/;
	  		if(!reg.test(phone)) {
	  			 tha.$parent.msgAlter("请输入正确的手机号获取验证码！");
		        return ;
	  		}
		    if (code.trim() == "") {
		        tha.$parent.msgAlter("请输入验证码！");
		        return ;
		    }
		    this.$https.post('/login',{
		    	phone : phone,
		        code :  code,
		        type : 'login'
		    }).then(function(data){
		    	var msg=data.data;
	            if (msg.status == "1") {
	                //跳转到主要介绍页面
	                localStorage.setItem("token",msg.token); 
	                localStorage.setItem("tokenDate",msg.tokenData);
	                
	               tha.$router.push({name:'place'})
	            } else {
	                tha.$parent.msgAlter("无法注册，请联系客服");
	                tha.phone='';
	            }
		    })
		}
	  }

	}
</script>
<style type="text/css" scoped>
	.register{width: 100%;height: 100%;background: #fff2d0;padding-top: 3.6rem;box-sizing:border-box;-webkit-box-sizing:border-box;}
	.wx-header{width:4.75rem;height: 4.75rem;border:0.075rem solid #fff;border-radius: 50%;margin:0 auto 2.0rem;overflow: hidden;}
	.wx-header img{width: 100%;height: 100%;}
	.register .form-login{padding:0rem 1.375rem;box-sizing:border-box;-webkit-box-sizing:border-box;}
	.register .form-groud{width: 100%;height:2.5rem;margin-bottom:0.9rem;}
	.register .form-groud label{display: block;width:1.85rem;line-height: 2.5rem;text-align: center;background: #ffffff;border-radius: 0.3rem 0 0 0.3rem;-webkit-border-radius: 0.3rem 0 0 0.3rem;}
	.register .form-groud label i{font-size: 1.125rem;color: #ffa600;}
	.register .form-groud input{display: block;flex: 1;-webkit-flex:1;-webkit-box-flex: 1;box-flex: 1;font-size: 0.9rem;border:none;outline: none;height: 100%;line-height: 2.5rem;background: #ffffff;border-radius: 0.3rem 0 0 0.3rem;-webkit-border-radius: 0.3rem 0 0 0.3rem;}
	.register .form-groud input::-webkit-input-placeholder{color: #d8d8d8;}
	.register .form-groud input::input-placeholder{color: #d8d8d8;}
	.register .form-groud .vcode{display: block;width: 6.0rem;height: 100%;background: #ffa600;font-size: 0.9rem;text-align: center;line-height: 2.5rem;color: #ffffff;margin-left: 0.85rem;border-radius: 0.3rem;-webkit-border-radius: 0.3rem;}
	.disabled{opacity: 0.6;cursor: not-allowed;}
	.footers{width: 100%;font-size: 0.75rem;text-align: center;padding-top:8.75rem;color: #b0aea9;}

</style>