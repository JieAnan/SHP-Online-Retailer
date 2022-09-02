
# 统一使用账号： 13700000000  111111


# 1.如果不使用vuex，那么api中的多个请求在使用时候均要逐个调用，那么能否将所有api接口挂载到原型链上？
   
   ====> 首先在main.js中，导入全部的api接口： 
          // 统一引入api中的所有接口函数
          import * as API from '@/api';
   
   ====> 接下来在Vue的BeforeCreated钩子函数中挂载API到原型链的API上。
          // 全局事件bus配置
          beforeCreate () {
            Vue.prototype.$bus = this;
            Vue.prototype.$API = API;
          }
   ====> 最后在组件之中使用api时候直接调用即可。
          this.$API.接口

  # 2.路由传参

      传参方式1： this.$router.push({path:'',query:{k:v}})    this.$route.query.k
      
      传参方式2:  this.$router.push({name:'',params:{k:v}})    this.$route.params.k
      
      注意：动态路由也是传递params的，所以在 this.$router.push() 方法中 path不能和params一起使用，否则params将无效。需要用name来指定页面。    

 # 3.（不使用vuex情况下）如果在组件刷新时候需要发送请求，那么需要在什么地方发送呢？
     
     ===> mounted钩子？ 
          由于发送请求会用到异步请求，而实际上不允许在mounted前面加async，因此不能直接在mounted中发送等待数据的请求。
     
     ===> mounted钩子 + methods方法？
          理论上可以通过mounted钩子调用methods函数来获取请求的数据。
     
     ===> computed计算属性？
          当页面的dom用到了计算属性时候，计算属性会优于mounted执行，但是计算属性的异步请求会被搁置，等待异步请求完成之后，页面才会第二次渲染，因此会出现数据跳转现象。

          使用computed获取异步数据存在的问题：有明显的数据延迟感觉（原因是异步请求）

    因此：最佳使用方式是 mounted + methods方式。

  # 4.elementUI中按需引入时候有两种类型方式：
    ====> 直接使用 
          import { Button, Select } from 'element-ui';
          Vue.component(Select.name, Select);
    
    ====> 挂载到原形链之上(多半与事件相关的组件)
          import {MessageBox } from 'element-ui';
          Vue.prototype.$msgbox = MessageBox;
          Vue.prototype.$alert = MessageBox.alert;
    
    因此：使用对应elementui中的组件时候要注意它的使用方式。

  # 5.确认订单支付信息状态：短轮询与长轮询
    ====> 短轮询：发送一次请求之后，得到请求结果。
    ====> 长轮询：发送一次请求之后，使用setTimeInteval

  # 6.个人订单中心二级路由拆分。
    {
      path: '/center',
      name: 'center',
      component: Center,
      meta: { showFooter: true },
      // 二级路由组件
      children: [
        {
          path: 'myorder',
          component: myOrder,
        },
        {
          path: 'grouporder',
          component: groupOrder,
        },
        // 重定向 center 到 myOrder
        {
          path: '/center',
          redirect: "/center/myorder",
        }
      ]
    },

  # 7.完善路由前置守卫中，未登录状态下的跳转部分。

      1.未登录状态下，应该禁止向[center] [shopcart] [trade] [pay] [paysuccess]进行跳转.
        注意：在判断path时候，可以使用indexof对字符串进行判断。 path.indexOf('center') != -1 
      
      2.路由跳转：在未登录向其它路由跳转时候，考虑目标路由的跳转。
        【login】组件中：判断是否有意向的目的地，
                如果没有直接跳转到home，
                如果有目的地，那么登陆之后跳转到目的地。
          
          首先，在router中设置路由跳转时候：添加上to的参数到query。
          let path = to.path;
          // 把没有登录时候想去而没有去成的信息保存下来,存储于地址栏之中。
          next('/login?redirect=' + path);
          
          然后，在【login】组件中进行判断跳转。
          let topath = this.$route.query.redirect || '/home';
          this.$router.push(path);


  

  # 8.路由独享与组件内守卫
      路由独享守卫：在路由配置文件routes中进行配置。选择合适的路由组件进行设置。
      {
        path: '/trade',
        name: 'trade',
        component: Trade,
        meta: { showFooter: true },
        // 路由独享守卫：只能从指定的路径来
        beforeEnter: (to, from, next) => {
          // ...
          if (from.path == '/shopcart') {
            next()
          }else{
            //next(false)
            next(from.path)
          }
        }
      },
      上述代码表示：对当前的路由trade的跳转进行限制，只是接收来自于shopcart页面的路由跳转。

      组件内守卫：在某个组件内部设定跳转，beforeRouteEnter beforeRouteUpdate  beforeRouteLeave

  # 9.图片懒加载   vue-lazyload

  # 10.表单验证  vee-validate

  # 11.路由懒加载  
      {
        path: '/shopcart',
        name: 'shopcart',
        component: () => import('@/pages/ShopCart'),
        meta: { showFooter: true }
      },

   
   # 12.打包上线 npm run build

     项目打包之后代码是经过压缩加密的，如果报错不能直到哪里报错，使用map对代码机型映射能够判断哪一行出现错误。

     vue.config.js配置
     productionSourceMap:false。

  # 13.nginx 反向代理

      前端页面服务器部署：  http://1.15.122.143

      前端页面数据来源服务器：   http://39.98.123.211


      因此，在页面服务器中进行ngnix部署：
          1.首先在服务器1.15.122.143中找到etc/nginx文件，如果没有该文件，需要输入以下命令进行安装：
              在etc目录下：   yum install nginx

          2.当访问时http://1.15.122.143地址时候，能够自动打开该index网页。
              解决办法： 在nginx.conf中的serve对象添加：
              location / {
                root /root/shp/dist;
                index index.html;
                try_files $uri $uri/ /index.html;
              }    
          
          3.为了使该静态页面能够访问到服务器的数据，需要进行以下设置代理：
              解决办法： 在nginx.conf中的serve对象添加：
              location /api {
                proxy_pass http://39.98.123.211;
              } 

      最后运行nginx服务器：在etc文件下输入：
             nginx -s reload 
             
             或者：service  nginx  start
      
      注意：页面出现了500报错，那么需要修改 root权限，右击root更改权限，修改为：读取与执行。