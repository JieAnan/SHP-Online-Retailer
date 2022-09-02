
# 1.开发floor组件中的轮播图组件
  写静态组件---->写数据请求api【index.js】---->写vuex三件套【store】下的【home】---->swiper调用数据。
  在vuex中的state数据格式要正确书写，数据格式取决于服务器返回的数据。

## 1.1 floor数据在哪里触发？
  getFloorList这个action应该在哪触发？在home路由组件当中发送，因为要遍历数据形成两个floor组件（复用）

## 1.2 组件如何使用v-for进行遍历？
初始：
    <Floor></Floor>
    <Floor></Floor>
遍历： 
    <Floor v-for="(floor,index) in floorList" :key="floor.id" :list="floor"></Floor>

## 1.3 父组件【home】需要传递给子组件【floor】数据。可以使用props
   组件通信方式：
   1.props：用于负罪通信
   2.自定义事件： $on #emit   实现父子组件通信
   3.全局事件总线：$bus  全能通信
   4.vuex等等

   这里使用简单的props传值
   发送：  :list="floor"
   接收：props:['list']     使用属性名接收

## 1.4 样式值动态绑定：
    <li :class="{'active':index == 0}" v-for="(item,index) in list.navList" :key="index">
              <a href="#tab1" data-toggle="tab">{{item.text}}</a>
    </li>

    用法： :class="{'active':index == 0}"
  
## 1.5 将floor和listContainer中的轮播图转换为单独的组件。在vue中注册为全局组件[Carousel]，方便任何子组件使用。

1.为了拆分出listContainer和floor中的轮播图组件，将floor中的Swiper实例同样使用 watch + nextTick进行编写，同时使用immedate:true(保证psops的数据list能被监听到)

2.多个组件中共用的部分应该拆分为全局组件，要保证每个组件所使用的结果和js代码一致才能拆分。

3.将拆分的全局组件放置于 【components】之中。


# 2.search 模块开发：
--> 1.静态页面 + 静态页面拆分。
--> 2.发送请求（api）。
--> 3.写仓库vuex（action、motutions、state）。
--> 4.组件获取仓库数据，组件动态展示数据。

## 2.1 注意：如何从vuex中获取队员的数据？
1.导入mapState，import { mapState } from "vuex"2
2.使用计算属性获取队员属性值。
  computed: { 
      ...mapState({
        // 对象中使用键值对的形式取数据。key：value。
        // 右侧需要的是一个函数，当时用这个计算属性的时候，右侧函数会执行一次
        goodsList: state => state.search.searchList.goodsList,
        attrsList: state => state.search.searchList.attrsList,
        trademarkList: state => state.search.searchList.trademarkList,
      })
  }
  注意：state => state.search.searchList.goodsList,表示es6语法的简写形式，完整写法为：
  (state)=>{
    return state.search.searchList.goodsList
  }

3.以上方法中没有在vuex中的getter经过处理，实际上可以在getter中将上述过程简化，进行属性映射。
   首先,在vuex中对属性值计算计算:
    const getters = {
      goodsList (state) {
        return state.searchList.goodsList || []
      },
    }
   其次,在组件的computed中,使用mapGetters进行属性名解析:
   ...mapGetters(["goodsList"])

## 2.2 如何将路由传参传递的参数保存到本地当中？
  当前，我们在【TypeNav】组件之中进行了路由跳转，并传递了params和query参数，那么如何在store中取出对应的数据。
  我们在beforeMouted钩子之中进行参数初始化，将store中的参数保存到本地。

  方法一：直接使用属性值进行赋值。
         this.searchParams.category1Id = this.$route.query.category1Id
  
  方法二：使用Object.assign()进行对象属性合并。  
         Object.assign(this.searchParams, this.$route.query, this.$route.params)

## 2.3 目前在search页面只能够发送一次请求，原因是，请求放在mouted苟子仲，那么如何发送多次请求？
  
  思路：理论上只要搜索了数据或者点击了三级导航部分那么都会在route中更新参数，因此只要我们监视route的参数更新，然后将更新的参数保存到本地，此时再次发送请求即可？
  那么发送请求时候是放置于updated钩子？还是直接使用watch监视呢？

  ---->页面通过watch监视route的params和query对参数进行本地保存，然后进行服务器数据请求！！！！！！！
            watch: {
              $route: {
                immediate: true,
                handler (newdata, olddata) {
                  // 保存数据
                  Object.assign(this.searchParams, this.$route.query, this.$route.params)
                  // 再次发送请求
                  this.getData();
                  // 清除相应的三级分类id，方便接收下一次的id
                  this.searchParams.category1Id = '';
                  this.searchParams.category2Id = '';
                  this.searchParams.category3Id = '';
                  this.searchParams.keyword = '';
                }
              }
            },
  ---->当使用updated钩子发送数据请求时候页面加载流程会一直转圈，为什么呢？？