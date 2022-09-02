# vue-cli 脚手架初始化项目。
--- node + webpack + 淘宝镜像

# 1.项目文件夹介绍
|app
----|node-modules：      放置项目的相关包依赖。
----|public:             放置单页面，静态资源。(注意：在public中的静态资源打包时候会放置于dist文件中)
----|src:                原代码文件夹
    ----|assets:         放置静态资源，一般放置多个组件共用的静态资源。(注意：在assets中的静态资源打包时候会当做一个模块打包到js文件之中。)
    ----|components：    一般放置非路由组件或者全局组件。
    ----|pages:          放置路由组件。
    ----|APP.vue：       项目的唯一主组件，调用其他组件。
    ----|main.js         项目的入口文件
----|.gitignore          git配置文件
----|babel.config.js:    配置文件，与babel相关。
----|package.json:       项目中使用的依赖以及相关版本。
----|package-lock.json:  缓存性文件。缓存依赖下载的地址。

# 2.项目的其他配置
## 2.1项目运行时候自动打开配置。
    ---- package.json 中的serve添加 --open
        "scripts": {
        "serve": "vue-cli-service serve --open",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint"
    },

## 2.2 eslint校验工具的关闭。
    vue.config.js
    lintOnSave：false   

## 2.3 src文件夹简写方法，配置别名：@   @表示 src目录。
    jsconfig.json配置别名@，@代表的是src文件夹。
    "compilerOptions": {
        "target": "es5",
        "module": "esnext",
        "baseUrl": "./",
        "moduleResolution": "node",
        "paths": {
        "@/*": [
            "src/*"
        ]
        },

# 3.项目路由的分析：
    工具：vue-router
    前端所谓路由：K:V 键值对
    key:    URL(地址栏中的路径)
    value:  相应的路由组件内容

    注意：项目中上下结构布局。
    路由组件：  (发生变化的部分)
            Home首页路由组件、Search路由组件、login组件、注册组件

    非路由组件：(不发生变化的部分)
            Header组件 【首页、搜索页】
            footer组件 【首页、搜索页】，在登录组件没有footer。

# 4.完全非路由组件 Header 与 Footer
    1.主要以业务和逻辑为主，不在以HTML、CSS为主。
    2.在开发项目时候流程：
        1.书写静态页面(HTML + CSS)
        2.拆分组件。
        3.axios或者promise获取服务器的数据动态展示。
        4.完成相应的动态业务逻辑。

    注意： 1.数据准备： 组件结构 + 组件的样式 + 图片资源
          2.目前项目所采用的的是less样式，因此需要安装 less、less-loader（安装版本6）进行处理。
          3.如果想让组件识别样式，得在组件的script中设置 lang=:"less" 属性。

## 4.1 使用组件的步骤（非路由组件）
    1.创建组件。
    2.引入组件。
    3.注册使用组件。

# 5.路由组件搭建步骤（路由组件包括：Home首页路由组件、Search路由组件、login组件、注册组件）
    注意： 1.使用vue-router路由插件进行搭建路由组件。(vue-router@3.5.3)
          2. components目录文件主要存放非路由组件。
          3. pages|views主要存放路由组件。

## 5.1 配置路由--放置于router文件夹中
    1.配置路由流程：
     ----|1.1.从vue和vue-router中引入vue和VueRouter
     ----|1.2.利用vue的use使用VueRouter： Vue.use(VueRouter)
     ----|1.3.配置向外暴露的路由配置：
            export default new VueRouter({
                routes:[{path:'/',component:组件},{path:'/...',component:组件}],
                mode:'history'
            })
     ----|1.4.在mian.js中引入路由，同时在vue实例中挂载路由
     ----|1.5.在组件中使用路由时候在路由入口和路由出口处进行设置。
            路由入口：<router-link：to= >
            路由出口：<router-view></router-view>
            注意：路由组件的放置位置是在路由出口的位置。

## 5.2 路由总结：
    1.路由组件和非路由组件有什么区别？
      ----|1.路由组件一般放置于pages|views文件夹之中，而非路由组件一般放置于components文件之中。
      ----|2.路由组件一般在router文件中通过配置路由时候的component属性进行使用，非路由组件在组件间通过标签形式使用。
      ----|3.注册完成路由之后，无论路由组件还是非路由组件其身上都有属性： $route、$routers。

    2.$route和$router的区别？ route是获取数据，router是用于路由编程跳转。
      ----|$route：一般获取路由信息 [路径、query、parmas等等] $route.path
      ----|$router: 一般进行编程式导航进行路由跳转 [push|replace]
    
## 5.3 路由如何实现跳转？（声明式导航、编程式导航）

    ----|1.声明式导航 router-link,可以进行路由的跳转。
    ----|2.编程式导航 push|relace,可以进行路由跳转。
    ----|3.二者区别：声明式导航能够操作的编程时导航都可以操作。
                    编程式导航除了可以路由跳转，还能进行其他的业务逻辑。（如在点击登录跳转路由之前进行用户信息判断等等）

# 6.Footer组件显示与隐藏
    1.显示Footer组件： 在Home、Search组件显示Footer。  
    2.隐藏Footer组件：在登录、注册时候隐藏组件。
    3.v-if(直接操作dom，适用切换频率少) || v-show(经常切换时候使用)
## 6.1 控制显示或者隐藏组件方式：
    1.使用 $route.path来获得path信息。<Footer v-show="$route.path=='/home' ||$route.path=='/search'"></Footer>

    2.上述方法在大量path时候会显得复杂，因此可以使用路由元信息给每一个路由添加meta对象属性。
     meta{ showFooter: true}       <Footer v-show="$route.meta.showFooter"></Footer>
     在路由页面都有自己的元信息，因此直接调用每个路由的对应属性即可。
## 6.2 路由配置时候的信息
    1.可以在元信息meta对象中书写自己定义需要的属性和值。
    2.除了meta对象以外的属性都必须按照给定的属性去书写。

# 7.路由跳转和路由传参
## 7.1 路由跳转的方式：
    1.声明书导航：使用router-link进行跳转。
    2.编程式导航：使用$router.push或者$route.replace进行跳转。
    二者区别在于：编程式导航可以在路由跳转之前进行逻辑处理与判断。
## 7.2 路由传参的方式

需要传递的参数：
    1.params传参：params属于路由路径中的一部分，在配置路由时候需要提前占位。
    2.query参数：query参数不属于路由的组成部分，传递参数时候在路径后面跟上键值对。 /home?k=v&kv=value.

传递参数的方式：
    方式一：字符串形式：传递params参数 this.keyword和query参数：this.keyword.toUpperCase()
    this.$router.push("/search/" + this.keyword + "?k=" + this.keyword.toUpperCase())

    方式二：模板字符串：传递params参数 this.keyword和query参数：this.keyword.toUpperCase()
    this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)

    方式三：对象写法,需要组件的name属性作为传参对象。
    this.$router.push({ name: 'search', params: { keyword: this.keyword }, query: { k: this.keyword.toUpperCase() } })

    eg:在页面的搜索组件输入内容，路由跳转到搜索组件，同时携带内容。
## 7.3 路由传参的面试题：
    1.使用路由传参对象写法时候，是否可以将path和params一起使用？
        答：不可以。params参数需要在路由配置文件中的path中设置占位符，因此params使用对象传参时候必须使用name属性。
        this.$router.push({ path: "/search", params: { keyword: this.keyword }, query: { k: this.keyword } })
    
    2.传递params参数时候需要在路由配置path中添加占位符，那么如何控制可传递可不传递呢？
        答：当路由配置path添加了占位符之后，使用push传递参数时候不传递params参数时候会出现以下问题：
            ①.路由跳转问题：此时地址url变为：http://localhost:8080/?k=iphone
                                正常为：http://localhost:8080/search?k=iphone
            ②.实现params参数是否传递的管理。
                            在路由配置文件path中的占位符末尾添加？问号即可。
    
    3.params参数可以传递也可以不传递(通过path中占位符添加?实现)，那么如何解决传递空串问题？
        答：使用undefined解决。params可以传递、不传递(空字符串)
           this.$router.push({ name: "search", params: { keyword: "" || undefined }, query: { k: this.keyword } })
    
    4.路由组件能否传递props数据？
        答：可以传递props数据，总共有三种传递方式。
            在路由配置中添加props属性为true之后，同时在路由组件中设置props属性接收参数。该方法可以在路由组件中直接调用该参数，而不必使用$route信息。
## 7.4 编程式路由在多次跳转时候的错误解决。
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