
# 开发详情页:某一个产品的详情页
流程步骤：0.【router】中注册路由组件
         1.书写静态页面
         2.书写数据请求api
         3.书写状态管理vuex
         4.动态展示数据

# 1.在router中注册组件时候需要传递skuid参数(query)，因此在路由配置时候需要使用占位符。
    {
      path: '/detail/:skuid?',
      component: Detail,
      meta: { showFooter: true }
    },

# 2.在search组件之中，找到商品详情的图片部分，添加router-link标签，进行声明式导航。
    <router-link :to="`/detail/${good.id}`">
      <img :src="good.defaultImg" />
    </router-link>
  此处使用动态绑定和模板字符串，对当前详情商品的值的id进行绑定。

# 3.书写API数据请求接口。
  // 5.获取商品详情页的数据，需要传递商品id    get  /api/item/{skuid}
    export function reqGoodsInfo (skuid) {
      return requests({
        url: `/item/${skuid}`,
        method: 'get',
      });
    }

# 4.书写vuex仓库管理。（同时使用getters简化state中的数据）

# 5.在Detail组件的mouted中发送数据请求。

# 6.开始绑定动态数据。

# 7.设置放大镜组件和轮播图组件之间进行兄弟组件通信： 
    this.$bus.$emit('名称'，参数)   this.$bus.$on('名称'，函数)

   1.在轮播图组件中切换选中图片时候，通知兄弟组件切换放大镜图片。

# 8. zoom组件中   设置放大镜
   练习书写放大镜
   


# 9.进行路由传参跳转添加购物车。
   1.携带params参数要使用路由中的name属性。
   2.skuNum对象数据可以通过state进行获取，也可以通过商品id进行服务器请求获取数据，还可以通过本地暂存数据来获得数据。（注意使用仓库数据时候，可能会丢失用户选择的商品属性）
   
   3.使用本地存储数据的方法（H5新增）：本地存储 和 会话存储
     本地存储：持久化的。
     会话存储：并非持久化的（页面关闭数据消失）。
   
   4.本地存储和会话存储不能够直接存储对象，需要将对象转化为json格式进行存储。
     存：sessionStorage.setItem('SKUINFO', JSON.stringify(this.skuInfo))     对象转json存储
     读：JSON.parse(sessionStorage.getItem('SKUINFO'))                       json转对象

   5.向服务器发送ajax，获取购物车数据，操作vuex三连环、组件获取数据展示数据。

     身份验证：通过数据请求头的形式在 请求拦截器 中添加身份信息
     // 2.请求拦截器：在发送请求之前可以检测到请求。
        requests.interceptors.request.use((config) => {
          // config:配置对象 里面有一个属性很重要，header请求头。
          nprogress.start()
          if (store.state.detail.uuid_token) {
            // 给服务器的请求添加用户信息请求头，该字段是服务器api设置的字段。
            config.headers.userTempId = store.state.detail.uuid_token;
          }
          return config
        })

    6.在对产品的当前数量进行更新时候，会用到上一时刻的skuNum和当前input输入值之间的差值进行发送请求。
      对input 使用:value 和v-model的区别在于：
         1. :value 会读取获取属性中的skuNum，而不会改变值，因此此处使用它计算两者的差值
         2. v-model绑定之后会显示的改变属性中的值，因此不能获取到上一时刻的值。
     
 # 10.使用computed时候遇到的问题：
     1.当标签中用到computed计算属性时候，用到的computed计算属性会先于mouted执行。
       而一般将数据请求放置于 mouted 之中，那么此时computed的计算属性所用到的值可能是undefined，因此需要在computed中对对象{}或者数组[]进行判断，防止出现未得到值而先使用对象属性或者数组情况。
     
       created => computed => mounted => watch。
       参考博客：https://blog.csdn.net/tangran0526/article/details/118525382

     2.computed计算属性特点：
      只是第一次使用该属性时候进行计算，后续再次调用该属性时候直接使用该值而不会计算。
     
  
 # 11.如何一次性删除多个商品？接口只有删除一个的接口，但是需要一次性删除多个如何解决？
      1.使用Promise.all()






