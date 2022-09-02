
// 配置路由的地方

// 1.引入vue和vue-router,使用VueRouter
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)



// 使用编程式路由导航多次点击同一个路由时候，会报错：NavigationDuplicated。
// 其原因是路由跳转需要成功或者失败的回调，而多次跳转均没有回调，因此需要人工添加多次跳转时候的回调。

// 解决方法：重写 push|replace

// ①.暂存原生的push ||replace
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

// ②.重写push方法，添加多次调用状态下的回调
// 第一个参数：高告诉原来的push方案，你往哪里跳转。后面两个参数表示跳转成功或者失败的回调。
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve || reject) {
    // 第一次点击路由，会有成功或者失败的回调。
    // call || apply 区别
    // 相同点：都可以调用函数一次，同时可以修改上下文
    // 不同点：call传递参数用逗号隔开，apply传递数组参数。
    originPush.call(this, location, resolve, reject); // 不加call默认为window调用
  } else {
    // 多次点击该路由，系统不会有成功或者失败的回调，此时需要添加成功或者失败的回调。
    originPush.call(this, location, () => { }, () => { });
  }
  // 总结：1.先保存初始的push到window本地上。
  //      2.重写push方法，对于多次点击路由的时候添加成功或者失败的回调。
  //      3.重写push方法时候调用保存的方法，同时通过call修改this的指向。
}

VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve || reject) {
    originReplace.call(this, location, resolve, reject); // 不加call默认为window调用
  } else {
    originReplace.call(this, location, () => { }, () => { });
  }
}



import routes from './routes'
// 引入store
import store from '@/store'

// 3.配置路由
let router = new VueRouter({
  routes: routes,                  // 配置路由数组
  mode: 'history',                 // 设置路由的模式
  // 设置路由跳转的滚动行为
  scrollBehavior (to, from, savedPosition) {
    // y=0代表滚动条在最上方
    return { y: 0 };
  }
});

// 4.全局路由守卫：前置
router.beforeEach(async (to, from, next) => {
  // to:到哪里去，from:从哪里来，next:放行的函数

  // next();             // 写法一:直接放行
  // next('/home');      // 写法二：放行到指定的路由
  // next(false)         // 写法三：中断当前的导航
  let token = localStorage.getItem('TOKEN')
  let name = store.state.user.userInfo.name;

  let uuidtoken = localStorage.getItem('UUIDTOKEN')

  // 1.如果登录状态：不能去login
  if (token) {
    if (to.path == '/login' || to.path == '/register') {
      next('/home');
    }
    else {
      if (name) {   //不刷新
        next();
      }
      else {        // 刷新丢失信息，重新请求
        try {
          await store.dispatch('userInfo')
          next();
        }
        catch (error) {
          // 服务器生成的token失效了：清除token，回到登录页面。
          await store.dispatch('logOut')
          localStorage.clear()
          next('/login')
        }
      }
    }
  }
  // 2.是以临时游客身份登录，那么可以访问购物车，但是不能访问订单。
  else {
    // 未登录：不能去交易相关、不能去支付相关【pay|paysuccess】、不能去个人中心
    let toPath = to.path;
    if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
      // 把未登录的时候向去而没有去成的信息，存储于地址栏中【路由】
      // 使用query传参： /login?redirect= 形式。
      next('/login?redirect=' + toPath);
    }
    //去的不是上面这些路由（home|search|shopCart）---放行
    else {
      next();
    }
  }
})



export default router
