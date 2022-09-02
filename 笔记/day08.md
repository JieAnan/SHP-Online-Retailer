 # 开始登录注册组件编写：
   1.发送请求     api
   2.存储数据     vuex
   3.设置动态数据
  

# 1.登录与注册和git技能同等重要！！！！！！！！！！！
  1.在样式中也可以使用@符号，前面需要家还是那个~符号，
     如： background-image: url(~@/assets/images/icons.png);
  
  2.目前先不处理注册业务的表单验证功能。


# 2.用户注册之后得到的token令牌理解？
    当用户登录成功之后，后台为了区分用户是谁，服务器下发了一个token【令牌】，一般登录成功之后只会下发一个token。将来前台持久化存储token，需要token时候可以携带用户的token信息。

    【注意】：1.用户的vuex存储不是持久化的，每次刷新就会消失，因此state中的token需要存储到本地。
             2.header头部组件通过state的信息判断是否获取到了对于token的用户信息并给与展示。

# 3.当前存在的问题bug？

    1.当前通过token获取用户信息的action只是在home组件的mounted进行了挂载，而在detail或者search组件进行刷新之后，state中就没有了userInfo信息，因此，如何解决在多个组件中使用相同的数据？（而不是每个组件重复发送请求）

    // 获取用户信息在首页进行展示
    this.$store.dispatch('userInfo')

    2.当用户登录账户之后，应该不能再次跳转到登录页面，应该如何解决？（导航守卫）
      ===> 登录之后不能进入登录页面
      ===> 未登录不能进入购物车界面

    3.退出登录？（清理token）


# 4.导航守卫：路由跳转需要由附加条件
     ====> 导航，表示路由正在发生变化，进行路由跳转。
     ====> 守卫，判断是否符合跳转的规则。

     ====> 全局守卫，      对所有路由跳转前都会执行的规则。
     ====> 路由独享守卫，  对某一个路由跳转前执行的规则。
     ====> 组件内守卫，    一个路由跳转成功界面含有多个组件，而去指定的组件时候的守卫。

    [注意] 路由界面的刷新导致的vuex中的数据丢失问题？

     在每一个路由跳转中用到了header组件（vuex包含用户信息），而刷新之后vuex的信息会丢失，因此用户信息需要发送请求来获取，this.$store.dispatch('userInfo')

     那么应该什么时候发送这个请求呢？简单的做法就是在每一个路由跳转的组件中都发生这个请求，然后展示用户信息，但是这样太夯余了，
     
     正确的做法是：在全局路由前置守卫中派发这个请求，当state中存在userInfo属性时候，说明此时已经登录直接跳转即可，反之如果没有该属性那么需要先请求数据userInfo信息，然后在进行next()跳转。
          router.beforeEach(async (to, from, next) => {
            // to:到哪里去，from:从哪里来，next:放行的函数

            // next();           // 写法一:直接放行
            // next('/home');    // 写法二：放行到指定的路由
            // next(false)         // 写法三：中断当前的导航
            let token = localStorage.getItem('TOKEN')
            let name = store.state.user.userInfo.name;
            // 如果登录状态：不能去login
            if (token) {
              if (to.path == '/login') {
                next('/home');
              } else {
                if (name) {
                  next();
                } else {
                  // 获取用户信息在首页进行展示
                  await store.dispatch('userInfo')
                  next();
                }
              }
            }
            // 未登录状态：不能去购物车和订单结算
            else {
              // if (to.path == '/shopcart') {
              //   next('/home');
              // }
              // else {
              //   next()
              // }
              next()
            }
          })
    
    【一个小bug】:在首次登录时候，跳转到home组件之后没有显示用户信息，而是刷新之后才会显示用户信息？
                 
            解决方法： Login组件中的登录回调函数userLogin ()
                      应该是 服务器请求===> token保存到本地  ===> 路由跳转