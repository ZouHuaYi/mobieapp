import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    ,{
    	path: '/login',
    	name: 'login',
    	component:  resolve=>require(['@/components/login/login.vue'],resolve)
    }
    //乘客
    ,{
    	path: '/pass/place',
    	name: 'place',
    	component:  resolve=>require(['@/components/passengers/place/index.vue'],resolve)
    }
    ,{
    	path: '/pass/areas',
    	name: 'areas',
    	component:  resolve=>require(['@/components/passengers/place/areas.vue'],resolve)
    }
    ,{
    	path: '/pass/pay',
    	name: 'wait',
    	component:  resolve=>require(['@/components/passengers/payorder/index.vue'],resolve)
    }
    ,{
    	path: '/pass/user',
    	name: 'user',
    	component:  resolve=>require(['@/components/passengers/user/index.vue'],resolve)
    }
    ,{
    	path: '/pass/order',
    	name: 'order',
    	component:  resolve=>require(['@/components/passengers/user/order.vue'],resolve)
    }
    ,{
    	path: '/pass/glod',
    	name:  'glod',
    	component:  resolve=>require(['@/components/passengers/user/glod.vue'],resolve)
    }
    ,{
    	path: '/pass/setuser',
    	name: 'setuser',
    	component:  resolve=>require(['@/components/passengers/user/set_user.vue'],resolve)
    }
    //司机
    ,{
        path: '/driver/order',
        name: 'dri_order',
        component:  resolve=>require(['@/components/driver/order/index.vue'],resolve)
    }
    ,{
        path: '/driver/pay',
        name: 'dri_pay',
        component:  resolve=>require(['@/components/driver/pay/index.vue'],resolve)
    }
    ,{
        path: '/driver/user',
        name: 'dri_user',
        component:  resolve=>require(['@/components/driver/user/index.vue'],resolve)
    }
  ]
})
