<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 没有登录，显示请登录 -->
          <p v-if="!userName">
            <span>请</span>
            <router-link to="/login" class="root">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-else>
            <a style="color:tomato">{{userName}}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="center">我的订单</router-link>
          <router-link to="shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="">
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyword" />
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">搜索</button>
          <!-- 此处不是 <router-link> ,而是button按钮，因此不能使用 to="/register"。-->
          <!-- 第二种路由跳转方式： 使用this.$router.push("/register")进行跳转。-->
        </form>
      </div>
    </div>
  </header>
</template>

<script>


export default {
  name: 'Header',
  data () {
    return {
      // 尽量输入英文
      keyword: ''
    }
  },
  mounted () {
    // 通过全局事件总线清楚关键字
    this.$bus.$on('clear', () => {
      this.keyword = '';
    })
  },
  methods: {
    // 搜索按钮的回调函数：使用编程式导航进行路由
    goSearch () {

      // 路由传递参数
      // 方式一：字符串形式：传递params参数 this.keyword和query参数：this.keyword.toUpperCase()
      // this.$router.push("/search/" + this.keyword + "?k=" + this.keyword.toUpperCase())

      // 方式二：模板字符串：传递params参数 this.keyword和query参数：this.keyword.toUpperCase()
      // this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)

      // 方式三：对象写法,需要组件的name属性作为传参对象。(params只能和name使用)
      // this.$router.push({ name: 'search', params: { keyword: this.keyword }, query: { k: this.keyword.toUpperCase() } })

      /* **************************************** 面试题总结 ****************************************** */
      // 面试题1.使用路由传参 对象 写法时候，是否可以将path和params一起使用？ 

      //       答：不可以。params参数需要在路由配置文件中的path中设置占位符，因此params使用对象传参时候必须使用name属性。
      // this.$router.push({ path: '/search', params: { keyword: this.keyword }, query: { k: this.keyword } })


      // 面试题2.传递params参数时候需要在路由配置path中添加占位符，那么如何控制可传递可不传递呢？

      // 答：当路由配置path添加了占位符之后，使用push传递参数时候不传递params参数时候会出现以下问题：
      //       ①.路由跳转问题：此时地址url变为：http://localhost:8080/?k=iphone
      //                              正常为：http://localhost:8080/search?k=iphone
      //       ②.实现params参数是否传递的管理。
      //                       在路由配置文件path中的占位符末尾添加？问号即可。path: "/search/:keyword?",
      // this.$router.push({ name: 'search', query: { k: this.keyword } })



      // 面试题3：params参数可以传递也可以不传递(通过path中占位符添加?实现)，那么如何解决传递空串问题？
      //      答：使用undefined解决。params可以传递、不传递(空字符串)
      // this.$router.push({ name: "search", params: { keyword: "" || undefined }, query: { k: this.keyword } })

      // 面试题4：路由组件能否传递props数据？
      //       答：可以的，总共有三种写法。 布尔值、对象、函数
      // 方式1：布尔值写法：只包括params参数。将params参数传递到路由组件的props属性中。需要在跳转路由中设置同名参数接收
      // props: true,

      // 方式2：对象写法。额外的给路由传递一些props属性。 需要在跳转路由中设置同名参数接收
      // props: { a: 1, b: 2 },

      // 方式3：函数写法，可以给params参数、query参数，通过params传递给路由组件。
      // props: ($route) => {
      //   return { keyword: $route.params.keyword, k: $route.query.k };
      // }

      // 需要进行目录id内容判断，判断是否有categoryid的选择 (query参数)
      if (this.$route.query) {
        let location = {
          name: 'search',
          params: { keyword: this.keyword || undefined },
        }
        location.query = this.$route.query;
        this.$router.push(location)
      }
    },
    // 退出登录业务
    async logout () {
      try {
        // 1.需要发送服务器请求，派发action清除 token(包含本地)
        await this.$store.dispatch('logOut');
        // 2.清除本地存储的token信息。
        localStorage.clear();
        // 3.跳转到首页
        this.$router.push('/home')
      } catch (error) {
        alert(error.message)
      }
    }
  },
  computed: {
    // 动态计算用户信息
    userName () {
      return this.$store.state.user.userInfo.name;
    }
  }
}
</script>


<style lang="less" scoped>
// 头部less样式
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
            color: tomato;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>