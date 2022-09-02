
## 编程式路由在多次跳转时候的错误解决。 NavigationDuplicated。

    路由跳转方式有两种：编程式导航和声明式导航。
    --->声明式导航不存在异常问题。因为vue-router底层已经处理好了该异常。
    --->在使用编程式路由导航时候，如果连续多次跳转到当前路由(参数不变)，就会抛出异常：NavigationDuplicated。
    1.为什么对于编程式导航会出现该种情况呢？
        ---->  "vue-router": "^3.5.3"引入了promise
        ----> 报错的原因是因为当第二次或者多次点击重复该路由时候，没有成功或者失败的回调，因此会报错。
    2.如何解决该问题呢？其解决办法就是在router配置文件中 重写push方法，当多次点击该路由而没有回调时候手动添加回调。
        代码如下：
        解决方法：重写 push|replace

         ①.暂存原生的push
        let originPush = VueRouter.prototype.push;
        let originReplace = VueRouter.prototype.replace;
        // ②.重写push方法，添加多次调用状态下的回调
        // 第一个参数：告诉原来的push方案，你往哪里跳转。后面两个参数表示跳转成功或者失败的回调。
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

# 2.Home组件拆分

  Home组件业务流程：
  ----| 完成静态页面html css布局书写
  ----| 拆分出静态组件                       【HTML + CSS + 图片资源】
  ----| 获取服务器的数据进行展示
  ----| 完成动态业务

## 2.1 静态组件一：三级联动组件
  ----| 在home、search、detail等组件中均使用，因此将三级组件拆分。
  ----| 全局组件注册：Vue.component(TypeNav.name, TypeNav)  // 第一个参数：全局组件的名字。第二个参数：哪一个组件

## 2.2 静态组件二：轮播图和List组件 ListConytainer
  ----| 局部组件注册： components: { ListContainer }     // 键值合一，简写。
  ----| 此处轮播图目前只是用了一份图片，先完成静态页面，多了会报错。

## 2.3 静态组件三：商品推荐组件Recommed
 ----| 局部组件注册： components: { Recommed }           // 键值合一，简写。

## 2.4 静态组件四：热卖排行组件 Rank
----| 局部组件注册： components: { Rank }                // 键值合一，简写。

## 2.5 静态组件五：喜欢组件
----| 局部组件注册： components: { Like }                // 键值合一，简写。

## 2.6 静态组件六：Floor组件
----| 局部组件注册： components: { Floor }                // 键值合一，简写。

## 2.6 静态组件七：商标组件Brand
----| 局部组件注册： components: { Brand }                // 键值合一，简写。

# 3.postman || apipost进行接口测试。
----|最新接口地址： http://gmall-h5-api.atguigu.cn
----|1.如果服务器返回200，代表请求成功！
----|2.整个项目地址前缀都存在api/

# 4.完成axios二次封装用于发送请求。
----|常见的发送请求方式： XMLHttpRequest、fetch、JQ、axios、promise

## 4.1 为什么需要二次封装axios？
----|请求拦截器：在发送请求之前处理一些业务。
----|相应拦截器：在服务器返回数据之后处理数据或者逻辑。

## 4.2 项目当中经常出现【API】文件夹，该文件夹是用来存放【axios】
--|api
    ----|request.js: 对axios进行二次封装
        ----|baseURL: "/api" 表示自动在url地址后面统一跟上“api”
    ----|index.js:   利用封装的requests进行api的管理。

# 5 跨域问题
1.什么是跨域：协议、域名、端口号不同请求，称之为跨域。
2.如何解决跨域问题？ JSONP CROS 代理服务器

# 6.发请求进度条使用：nprogress

// 1.引入进度条: 通过start 和done进行开始和结束。
import nprogress from "nprogress";
// 2.引入进度条的样式
import "nprogress/nprogress.css"
// 3.通过start和done控制进度条
start：开始。在请求发出之前开始动
done：结束。 在请求成功之后结束

# 7.vuex@3.6.2组件全局通信（适用于项目组件很多，组件之间通信复杂等）
    
    ----|1.vuex是什么？：官方提供的统一管理数据的插件，集中式管理项目共用的数据。
    
    ----|2.vuex的组成部分？
        ----|actions:处理业务逻辑
        ----|mutations:真正修改数据地方
        ----|getters:类似于计算属性。
        ----|state:存储数据
    
    ----|3.vuex的基本使用。（存放于store文件夹之中）
        ----|3.1首先新建store文件夹，里面新建index.js文件存放仓库store。
        ----|3.2在index.js中分别新建对象 state actions mutations getters。在各自对象中书写逻辑和函数。
        ----|3.3在index.js的最后暴露出一个vuex实例对象 new Vuex.Store({}),里面配置新建的state actions mutations getters对象。
        ----|3.4在main.js中引入和注册仓库。
                import store from "@/store";
        ----|3.5在需要使用仓库store的组件中：
                ①.引入： import { mapState } from "vuex"
                ②.结构出state需要用到的数据：...mapState(['count'])
                ③.在methods中通过$store来派发action： this.$store.dispatch('addCount') 
                ④.在store的actions中书写addCount，同时commit到mutations进行数据修改。
                    addCount ({ commit }) {
                        commit('ADD')
                    },
    
    ----|4.vuex实现模块式开发：将每一个组件用到/生成的数据单独放置于每一个文件夹下。
        ----|home
        ----|search
        ----|1.在store下的index.js中暴露store时候使用modules属性来加载小仓库数据。
        ----|2.使用数据时候直接 $store.state.modulea.属性 即可。
        ----|每一个小仓库都存储了自己的数据，方便既取既掉，而不用一次加载许多仓库数据。



# 8.完成TypeNav三级联动展示数据业务
    1.this.$store.dispatch('categorylist') 向服务器发送请求获取数据。(在挂载时候发送请求数据) 在actions中书写。
    2.在mutations中保存数据。
