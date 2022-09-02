<template>
  <div>
    <!-- 商品分类三级目录 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">

        <!-- bread:面包屑 带有x的架构 -->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 面包屑1：分类面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{searchParams.categoryName}}<i @click="removeCategoryName">×</i></li>
            <!-- 面包屑2：关键字面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyword">×</i></li>
            <!-- 面包屑3：trademark品牌面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{searchParams.trademark.split(":")[1]}}<i @click="removeTradeMark">×</i></li>

            <!-- 面包屑4：品牌售卖属性面包屑 -->
            <li class="with-x" v-for="(prop,index) in searchParams.props" :key="index">
              {{prop.split(":")[1]}}
              <i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector：品牌选择区-->
        <!-- 将 "attrsList", "trademarkList" 参数传递给子组件 -->
        <SearchSelector :attrsList=attrsList :trademarkList=trademarkList @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details：商品详细展示-->
        <div class="details clearfix">

          <!-- 属性排序 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序的结构 -->
              <ul class="sui-nav">
                <!-- 1 表示按照综合排序。 -->
                <li :class="{active:isOne}" @click="changeOrder(1)">
                  <a href="javascript:;">综合 <span v-show="isOne" class=iconfont :class="{'icon-up':isAsc,'iconfont icon-arrowdown':!isAsc }"></span></a>
                </li>
                <!-- 2 表示按照价格排序。 -->
                <li :class="{active:isTwo}" @click="changeOrder(2)">
                  <a href="javascript:;">价格 <span v-show="isTwo" class=iconfont :class="{'icon-up':isAsc,'iconfont icon-arrowdown':!isAsc}"></span></a>
                </li>
              </ul>
            </div>
          </div>

          <!-- 销售产品的列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(good,index) in goodsList" :key="good.id">
                <div class="list-wrap">

                  <!-- 给图片添加声明式导航,同时设置路由出口 -->
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>

                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{good.price}}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html">{{good.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- 分页器 -->
          <Pagenation :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5" @getPageNo="getPageNo"></Pagenation>
          <!-- 原始的分页器 -->
          <!-- <div class="fr page">
            <div class="sui-pagination clearfix">
              <ul>
                <li class="prev disabled">
                  <a href="#">«上一页</a>
                </li>
                <li class="active">
                  <a href="#">1</a>
                </li>
                <li>
                  <a href="#">2</a>
                </li>
                <li>
                  <a href="#">3</a>
                </li>
                <li>
                  <a href="#">4</a>
                </li>
                <li>
                  <a href="#">5</a>
                </li>
                <li class="dotted"><span>...</span></li>
                <li class="next">
                  <a href="#">下一页»</a>
                </li>
              </ul>
              <div><span>共10页&nbsp;</span></div>
            </div>
          </div> -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapState, mapGetters } from "vuex"

export default {
  name: 'Search',
  components: {
    SearchSelector
  },
  data () {
    return {
      // 带给服务器的参数。
      searchParams: {
        "category1Id": "",
        "category2Id": "",
        "category3Id": "",
        "categoryName": "",
        "keyword": "",              //关键字
        "order": "1:desc",          //排序
        "pageNo": 1,
        "pageSize": 10,
        "props": [],
        "trademark": ""
      }

    }
  },
  beforeMount () {
    // 复杂写法：
    // this.searchParams.category1Id = this.$route.query.category1Id
    // 简单写法(合并对象)：Object.assign(A,B,C...) 。将后面对象的属性值合并到A对象对应的属性值。
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },
  // 使用watch对route中的参数进行监视，一旦发送变化就重新保存到本地，然后在update苟子仲发送请求。
  watch: {
    $route: {
      immediate: true,
      handler (newdata, olddata) {
        // 清除相应的三级分类id，方便接收下一次的id
        this.searchParams.category1Id = undefined;
        this.searchParams.category2Id = undefined;
        this.searchParams.category3Id = undefined;
        // 保存数据
        Object.assign(this.searchParams, this.$route.query, this.$route.params)
        // 再次发送请求
        this.getData();
      }
    }
  },

  mounted () {
    // 1.在发送请求之前应该把参数进行存储。
    // 2.派发一个数据请求action
    // this.$store.dispatch("getSearchList", {})
    this.getData();
  },

  computed: {
    // 1.使用mapState进行属性解析, 对象中使用键值对的形式取数据。key：value。
    // 右侧需要的是一个函数，当时用这个计算属性的时候，右侧函数会执行一次
    ...mapState({
      // || [] 防止数据没有返回，出现undefine
      goodsList: state => state.search.searchList.goodsList || [],
      total: state => state.search.searchList.total,
    }),
    // 2.通过getters属性进行赋值,直接使用数组对存在的属性名计算解析.
    ...mapGetters(["attrsList", "trademarkList"]),
    // 注意:对于复杂的属性取值,getters只需要在vuex中书写一次,然后后面直接解析即可.
    // 3.控制order显示的类别
    isOne () {
      return this.searchParams.order.indexOf('1') != -1;
    },
    // 4.控制order显示的类别
    isTwo () {
      return this.searchParams.order.indexOf('2') != -1;
    },
    //  5.监视order属性的升序和降序
    isAsc () {
      return this.searchParams.order.indexOf('asc') != -1;
    },

  },
  methods: {
    // 向服务器发送search商品详情数据请求。
    // 将数据请求封装为函数，在需要调用的部分进行调用。
    getData () {
      // 派发一个数据请求action
      this.$store.dispatch("getSearchList", this.searchParams)
    },
    // 1.删除分类的名字
    removeCategoryName () {
      // 不设置为'',而设置为undefined的作用是为了不把该值传递给服务器。减少服务器的消耗。
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // 保留keyword信息。
      // this.getData();     // 与路由更新重复，语料更新后会自动发送请求
      // 更新路由参数，会自动发送数据请求
      this.$router.push({ name: 'search', params: this.$route.params })
    },
    // 2.删除分类的名字
    removeKeyword () {
      this.searchParams.keyword = undefined;
      // 保留三级目录id
      // this.getData();   // 与路由更新重复，语料更新后会自动发送请求
      // 发送bus事件，通知header将keyword置空
      this.$bus.$emit("clear")
      // 更新路由参数，会自动发送数据请求
      this.$router.push({ name: 'search', query: this.$route.query })

    },
    // 3.1自定义事件的回调,准备发送请求
    trademarkInfo (trademark) {
      // trademark的值形式为 id：名称
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      this.getData();
    },
    // 3.2删除品牌信息 trademark
    removeTradeMark () {
      this.searchParams.trademark = undefined;
      this.getData();
    },
    // 4.1自定义事件的回调，携带属性值准备发送请求
    attrInfo (attr, attrvalue) {
      // 整理参数，准备给服务器发送请求 [属性id，属性值，属性名]
      let props = `${attr.attrId}:${attrvalue}:${attr.attrName}`;
      // 注意：向数组当中添加元素时候，应该判断数组之中是否已经存在该元素。  
      // 数组去重：
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props);
        this.getData();
      }
    },
    removeAttr (index) {
      // 删除数组props中指定index的prop数据: splice(index, 1)表示删除元素索引值，删除一个值。
      this.searchParams.props.splice(index, 1);
      this.getData();
    },
    // 5.点击排序按钮改变箭头或者排序方式,index表示当前点击的按钮，1表示综合，2表示价格
    changeOrder (index) {
      let id = this.searchParams.order.split(":")[0];
      let order = this.searchParams.order.split(":")[1] == "desc" ? "asc" : "desc";

      // 1.在同一标签进行升降序切换
      if (index == id) {
        let temp = index + ":" + order
        this.searchParams.order = temp;
        // 发送请求
        this.getData();
      }
      // 2.切换到另一个属性标签
      else {
        let index = this.searchParams.order.split(":")[0] == "1" ? "2" : "1";
        let temp = index + ":" + "desc"
        this.searchParams.order = temp;
        // 发送请求
        this.getData();
      }
    },
    // 6.自定义事件的回调，获取当前的页数。
    getPageNo (pageNo) {
      // 将传递的pageNo赋值给当前的参数
      this.searchParams.pageNo = pageNo;
      this.getData();
    }
  },
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>