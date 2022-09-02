<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派：父盒子控制子盒子 的鼠标离开逻辑。-->
      <div @mouseleave="leaveShow()" @mouseenter="enterShow()">
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动 -->
        <!-- 为search页面设置过度动画 -->
        <transition name="sort">
          <div class="sort" v-show="show">
            <!-- 利用【事件委派】对三级目录的路由跳转进行操作 -->
            <div class="all-sort-list2" @click="goSearch">

              <!-- 一级目录 -->
              <div class="item" v-for="(c1,index) in categoryList.slice(0,16)" :key="c1.categoryId" :class="{cur:currentIndex == index}">
                <h3 @mouseenter="changeIndex(index)">
                  <!-- 放置了一级分类名字，点击a标签进行跳转 -->
                  <!-- <a href="">{{c1.categoryName}}</a> -->
                  <!-- <router-link to="/search">{{c1.categoryName}}</router-link> -->
                  <a href="javascript:;" :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{c1.categoryName}}</a>
                </h3>
                <div class=" item-list clearfix" :style="{display:currentIndex == index?'block':'none'}">

                  <!-- 二级目录 -->
                  <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                    <dl class="fore">
                      <dt>
                        <!-- 放置了二级分类名字，点击a标签进行跳转 -->
                        <!-- <a href="">{{c2.categoryName}}</a> -->
                        <!-- <router-link to="/search">{{c2.categoryName}}</router-link> -->
                        <a href="javascript:;" :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{c2.categoryName}}</a>
                      </dt>
                      <dd>
                        <!-- 三级目录 -->
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <!-- 放置了三级分类名字，点击a标签进行跳转 -->
                          <!-- <a href="">{{c3.categoryName}}</a> -->
                          <!-- <router-link to="search">{{c3.categoryName}}</router-link> -->
                          <a href="javascript:;" :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId">{{c3.categoryName}}</a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

      </div>

      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"

// 从lodash 中引入 _进行节流和防抖函数的调用
import { throttle } from "lodash"


// 向search组件暴露目录id：
// this.$bus.$emit('cateid')

export default {
  name: 'TypeNav',
  data () {
    return {
      // 存储用户鼠标移上哪一个一级分类
      currentIndex: -1,
      // 控制三级分类的显示与隐藏
      show: true
    }
  },
  methods: {
    // 1.鼠标进入修改响应数据currentIndex属性
    // changeIndex (index) {
    //   // 将当前鼠标指向的index的颜色设置为选中状态。
    //   this.currentIndex = index;
    //   console.log("我进来了" + index);
    // },

    // throttle节流函数不要出现箭头函数，有可能会出现上下文的this
    // 使用节流函数：20毫秒内只是执行一次。
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 20),

    // 2.鼠标离开时候还原currentIndex属性
    leaveShow () {
      this.currentIndex = -1;
      // 判断在非home组件下的隐藏三级分类
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },

    // 3.进行路由跳转的方法
    goSearch (event) {
      // 最好的解决方案：编程式导航 + 事件委派
      // 利用事件委派时候将所有子元素的click单击操作都给了父元素div：<div class="all-sort-list2" @click="goSearch">。
      // 那么在点击子元素时候不能明确是不是a标签 (为什么要确认获取的是不是a标签？是因为要通过点击事件event来得到对应a元素的属性)。【div、h3、em、a、dl、dt】

      // 1.如何确定点击的一定是a标签？    
      // ----|通过给a连接添加  :data-categoryName="c1.categoryName" 来区分事件委派中的所有a标签
      // 2.如何区分是一级、二级、三级分类的标签？
      // ----|通过给a连接添加属性：:data-category1Id="c1.categoryId"(2,3同理) 来区分123级id。

      let element = event.target;
      // 获取到了触发点击事件的节点，可能是：H3、a、dt、dd、em标签。但是我们需要带有data-categoryname属性的节点才会跳转。
      // 节点有一个dataset属性，可以获取节点的自定义属性与属性值。
      let { categoryname, category1id, category2id, category3id } = element.dataset

      // 如果节点身上有categoryname属性，那么一定是a标签。
      if (categoryname) {
        // 整理路由跳转的参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 判断是一级二级三级分类。
        if (category1id) {
          query.category1Id = category1id
        } else if (category2id) {
          query.category2Id = category2id
        } else if (category3id) {
          query.category3Id = category3id
        }

        // (特殊情况：在搜索页面先 输入keyword + 三级目录选择目录)
        // 此时：应该将二者同时传递给服务器。
        // 进行搜索框内容params参数判断，如果存在params参数也需要传递过去。
        if (this.$route.params) {
          // 合并参数：
          location.params = this.$route.params;
          location.query = query;
          // 路由传参
          this.$router.push(location)
        }

      }
    },

    // 4.控制search页面，当鼠标移入时候显示三级分类。
    enterShow () {
      this.show = true
    }
  },

  // 组件挂载：在调用该组件的时候都会进行挂载，因此选择在挂载的时候设置show属性。
  mounted () {
    // 如果当前路由组件是search组件，show变为false，将三级品类隐藏。
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      // 右侧需要的是一个函数，当时用这个计算属性的时候，右侧函数会执行一次
      // 注入一个参数stete，其为vuex大仓库中的数据。
      categoryList: (state) => {
        return state.home.categoryList
      }
    })
  }

}
</script>

<style lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;
            text-align: left;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }
        // .item:hover {
        //   background: #e1251b;
        // }
        .cur {
          background: skyblue;
        }
      }
    }
    // 过度动画的样式
    // 过度动画开始状态
    .sort-enter {
      height: 0px;
    }
    // 过渡动画结束状态(进入)
    .sort-enter-to {
      height: 461px;
    }
    // 定义动画时间的速率
    .sort-enter-active {
      transition: all 0.5s linear;
    }
  }
}
</style>