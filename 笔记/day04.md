
# 复习：
(1).商品分类的三级列表由静态变为动态形式【获取服务器数据：解决跨域问题】
(2).函数的防抖与节流。
(3).路由跳转：
    1.声明式导航在大量a标签中的卡顿问题---->使用编程式导航+事件代理。
        使用事件代理的原因：如果给每一个a标签绑定路由跳转，当点击次数过快依然会出现卡顿问题，因此使用事件代理。
    
    2.编程式导航使用事件代理时候确定目标标签---->使用自定义属性data-xxxx进行确定。


# 1.开发适用于search页面的三级路由TypeNav组件：
    1.在TypeNav组件中设置show属性来控制是否显示和隐藏三级目录。

    2.在typenav组件挂载时候就判断search页面，设置为false，那么就可以隐藏该三级目录。

    3.给三级目录添加消失和出现的过度动画（元素必须有v-if或者v-show才能使用过度动画）


# 2.如何优化全局组件的数据请求？
    search页面的数据性能优化： 【在App根根组件moute钩子函数中发送请求】
       1.对三级导航部分重复发送请求，除了可以进行本地缓存。下一次先从本地加载。
       2.最优解决办法是：将组件TypeNav的数据请求派发放置于App.vue中的mouted钩子函数中，就保证了只是请求一次数据，同时数据存储在了仓库vuex之中。this.$store.dispatch('categorylist')
       3.但是不能放置于main.js文件中，因为此时没有$store。不是个组件。而组件身上才有$store属性。

# 3.合并参数：params 和 query参数
       1.在home首页当点击三级目录页面进入搜索页面时候，如果使用搜搜框搜索内容需要传递参数：三级目录id + 搜索内容
             因此：在Header组件中需要判断是否携带query参数
       2.在home首页通过搜索内容进入搜索页面时候，如果使用三级导航目录需要传递参数： 搜索内容 + 三级目录id
             因此：在nav组件中需要判断是否携带params参数

# 4.开发Home首页当中的ListContainer组件和Floor组件。
    服务器的数据接口只有商品分类接口，因此这两部分的数据需要mock。

## 4.1 mockjs模拟数据使用的步骤：
    1）在项目文件夹下的【src】中创建【mock】文件夹。
    2）准备JSON数据。在【mock】文件夹中创建相应的json文件。
        banner.json:轮播图数据
        floor.json：推荐数据
    3）把mock数据需要的数据放置到【public】文件夹中，上线时候【public】在打包时候会原封不动打包到【dist】。
    4）准备mockServe.js文件，开始mock，通过mockjs模块实现。
    5）在main.js中引入mockServe.js文件，                 import "@/mock/mockServe";

    6）在api中，再次创建一个request请求文件 mockRequest.js 用于请求mock数据。
    7) 在组件【ListContainer】组件中dispatch请求   this.$store.dispatch('getBannerList')
    8) 在组件【ListContainer】组件中解构vuex中state中的数据bannerList。


# 5.ListContainer中Swpier插件使用流程

## 5.1安装Swiper插件5版本： 
    npm install --save swiper@5

## 5.2使用swiper插件
  1.第一步：引入对应的js包和css包，方便所有组件可以使用。【main.js中引入css,在ListContainer中引入js】
  2.第二步：创建相应的div结构，结构中包含css的样式。
  3.第三步：书写script函数部分。

## 5.3思考，new Swiper 实例应该放在组件什么位置？
    首先，new Swiper实例化应该在结构渲染完成知识，其中包括dom几个和数据全部获取完全。
    
    1.放置于motuned中？ 此时，由于图片数据是异步请求任务，因此直接在mouted中使用new Swiper可能数据还没有请求完毕，此时是不成功的，
                    改进方法：如果需要放置于mouted之中，可以在new Swpier实例化外边包裹一个定时器，设置延迟执行。等待数据全部请求完毕在执行。
    
    2.放置于updated中？首先，updated钩子是用来更新数据的，当data中数据发送更新时候就会重新执行updated钩子，因此如果将new Swiper放置于updated之中，虽然会成功执行轮播图效果，但是随着data数据变化轮播图会重新执行，存在额外消费的状况。

    3.使用new Swiper实例化的关键是：【图片数据 bannerList 必须全部接收到，结构必须全部渲染完毕】
      最完美的解决方案：使用watch监听，监听已有数据的变换。+ nextTick 进行完美解决。
    1.  watch:{
               bannerList:{
                   handler(new,old){
                       实例化Swiper
                   }
               }
           }
        上述中，虽然数据加载完成了，但是模板中使用v-for进行遍历的时候依然没有完成结构渲染，因此直接直接执行上述代码依然会不成功。
     2.使用 watch + nextTick
        nextTick: 在下次DOM更新循环之后 执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM。
        【下次DOM更新】：bannerList数组从空数组到非空数组。
        【循环结束之后】：代表使用v-for遍历数据之后bannerList数组。
        【执行延迟回调】：执行延迟的回调函数。
        注意：在修改完数据之后，调用nextTick方法可以对绑定在该数据上的v-for进行遍历，完成之后在执行回调函数。
        this.$nextTick(() =>{
            <!-- 当你执行这个回调时候，已经保证服务器数据返回了，v-for执行完毕了 -->
        })
    


