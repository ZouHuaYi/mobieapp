<template> 
<div class="userset">
	<div class="user-data" v-show="showIndex==0">
		<a class="user-item"href="javascript:;" @click="showIndex=1">
			<p class="u-left">昵称</p>
			<div class="u-right">
				<span>{{name}}</span>
				<i class="icon iconfont icon-jiantou3"></i>
			</div>
		</a>
		<a class="user-item"href="javascript:;" @click="showIndex=2">
			<p class="u-left">电话号码</p>
			<div class="u-right">
				<span>{{phone.substring(0,3)}}****{{phone.substring(7)}}</span>
				<i class="icon iconfont icon-jiantou3"></i>
			</div>
		</a>
	</div>

	<div class="username-set bc" v-show="showIndex==1">
		<p class="s-title">设置昵称</p>
		<div class="form-groud">
			<input type="text" name="names" v-model='name'>
		</div>
		<div class="form-btn hover" @click="sendName">
			<a href="javascript:;">保存</a>
		</div>
	</div>
	
	<div class="username-set bc" v-show="showIndex==2">
		<p class="s-title">修改绑定手机号码</p>
		<div class="form-groud">
			<input type="text" name="name" v-model="phone">
		</div>
		<div class="form-yan fx">
			<input type="number" name="" v-model="vcode" placeholder="输入验证码">
			<a class="vcode" @click="getVode" href="javascript:;">{{dxtext}}</a>
		</div>
		<div class="form-btn hover" @click="submitCode">
			<a href="javascript:;">提交</a>
		</div>
	</div>
	<a v-show="showIndex!=0" @click="showIndex=0" class="back-btn" href="javascript:;"><i class="icon iconfont icon-jiantou3"></i></a>
	<v-footer />
	<v-msgalter :title="alterTitle" @hideFun="alterStatus=false" :showStatus="alterStatus" />
</div>
</template>
<script> 
	import vFooter from "./footer.vue";
	import vMsgalter from '@/components/common/msgAlter.vue';

	Mock.mock('/user',{
		"name":"邹小一",
		"phone":"15016447087"
	})

	Mock.mock('/setname',{
		"status":1
	})

	Mock.mock('/vcode',{
		"status":1
	})

	Mock.mock('/setting',{
		"status":1
	})

	export default{
		name:"userset"
		,components:{
			vFooter,
			vMsgalter
		}
		,data(){
			return{
				alterStatus:false,
				alterTitle:'',
				name:'',
				phone:'',
				oldName:'',
				oldphone:'',
				showIndex:0,
				vcode:'',
				dxtext:'获取验证码',
				disabled:false
			}
		}
		,methods:{
			getUserData(){
				let tha=this;
				this.$https.post("/user",{
					//data
				}).then((data)=>{
					let user=data.data;
					tha.name=user.name;
					tha.oldName=tha.name;
					tha.phone=user.phone;
					tha.oldphone=tha.phone;
				})
			}
			,sendName(){
				let tha=this;
				if(this.name.trim(this.name)==''){
					this.msgAlter("不能为空");
					return;
				}
				if(this.name==this.oldName){
					this.msgAlter("新名字不能跟旧名字一样");
					return;
				}
				this.$https.post('/setname',{
					//data
					"name":tha.name
				}).then((data)=>{
					if(data.data.status==1){
						//修改成功
						tha.getUserData();
						tha.showIndex=0;
					}
				})
			}
			,getVode () {
		 		let phone = this.phone;
			    let reg = /^1\d{10}$/;  
			    let tha = this;
			    if(phone==tha.oldphone){
			    	tha.msgAlter("新旧号码不能一样");
			    	return;
			    }
			    if(this.disabled) return;                                  		 	//验证数字
			    if (reg.test(phone)) {
			        this.disabled=true;
			          this.$https.post('/vcode',{
			          	//data
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
	                    	 tha.msgAlter("您的号码无法接收短信！");
	                    	 tha.disabled=false;
	                    }

			          }).catch(function(error){
			          		 tha.msgAlter("对不起出错啦!");
			          		 tha.disabled=true;
			          })
			      } else {
			      	tha.msgAlter("请输入正确的手机号！");
			      }       
		  	}
		  	,submitCode(){
		  		let code = this.vcode;
		  		let phone = this.phone;
		  		let tha = this;
		  		let reg = /^1\d{10}$/;
		  		if(!reg.test(phone)) {
		  			this.msgAlter("请输入正确的手机号获取验证码！");
			        return ;
		  		}
			    if (code.trim() == "") {
			        this.msgAlter("请输入验证码！");
			        return ;
			    }
			    this.$https.post('/setting',{
			    	phone : phone,
			        code :  code,
			        type : 'setting'
			    }).then(function(data){
			    	if(data.data.status==1){
			    		// 修改成功
			    		tha.getUserData();
			    		tha.showIndex=0;
			    	}
			    })
			}
			,msgAlter(val){
				this.alterTitle=val;
				this.alterStatus=true;
			}
		}
		,created(){
			this.getUserData();
		}
	}

</script>
<style scoped> 
.userset{width:100%;height:100%;}
.user-data a{display: block;width: 100%;height: 2.7rem;background: #ffffff;border-bottom:0.025rem solid #bfbfbf;line-height: 2.7rem;font-size: 0.9rem;}
.user-data a p{padding-left: 0.75rem;color: #a2a2a2;}
.user-data a div{padding-right: 0.75rem;color: #000;}
.user-data a div i{font-size: 0.9rem;color: #a2a2a2;}
.username-set{padding:3.0rem 1.4rem;width:100%;height:100%;background:#EFEFEF;}
.username-set .s-title{text-align: center;font-size: 1.0rem;}
.username-set .form-groud{width: 100%;padding: 1.5rem 0;}
.username-set .form-groud input{display: block;width: 100%;height: 2.5rem;background: #ffffff;border:none;outline: none;font-size: 0.9rem;line-height: 2.5rem;text-indent: 0.5rem;border-radius: 0.25rem 0.25rem;-webkit-border-radius: 0.25rem 0.25rem;}
.username-set .form-yan{width: 100%;height: 2.5rem;margin-bottom:1.45rem;}
.username-set .form-yan input{display: block;flex: 1;-webkit-flex:1;-webkit-box-flex: 1;box-flex: 1;border:none;outline: none;height: 100%;line-height: 2.5rem;background: #ffffff;border-radius: 0px 0.2rem 0.2rem 0px;-webkit-border-radius: 0px 0.2rem 0.2rem 0;font-size: 0.9rem;text-indent: 0.25rem;}
.username-set .form-yan input::-webkit-input-placeholder{color: #d8d8d8;}
.username-set .form-yan input::input-placeholder{color: #d8d8d8;}
.username-set .form-yan .vcode{display: block;width: 6.0rem;height: 100%;background: #ffa600;font-size: 0.9rem;text-align: center;line-height: 2.5rem;color: #ffffff;margin-left: 34px;border-radius:0.2rem 0.2rem;-webkit-border-radius: 0.2rem 0.2rem;}
.back-btn{position:fixed;top:1.0rem;left:0.75rem;transform:rotate(180deg);width:1.0rem;height:1.0rem;}
.back-btn i{font-size:1.0rem;font-weight:900;}
</style>