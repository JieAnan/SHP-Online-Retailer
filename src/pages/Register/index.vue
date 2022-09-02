<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">

      <h3>注册新用户
        <span class="go">我有账号，去
          <router-link to="/login">登陆</router-link>
        </span>
      </h3>

      <div class="content">
        <label>手机号:</label>
        <input type="text" placeholder="请输入你的手机号" v-model="phone">
        <span class="error-msg">错误提示信息</span>
      </div>

      <div class="content">
        <label>验证码:</label>
        <input type="text" placeholder="请输入验证码" v-model="code">
        <button style="button" @click="getNumber">获取验证码</button>
        <span class="error-msg">错误提示信息</span>
      </div>

      <div class="content">
        <label>登录密码:</label>
        <input type="password" placeholder="请输入你的登录密码" v-model="password">
        <span class="error-msg">错误提示信息</span>
      </div>

      <div class="content">
        <label>确认密码:</label>
        <input type="password" placeholder="请输入确认密码" v-model="password1">
        <span class="error-msg">错误提示信息</span>
      </div>

      <div class="controls">
        <input name="m1" type="checkbox" :checked="true">
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span class="error-msg">错误提示信息</span>
      </div>

      <div class="btn">
        <button @click="userRegister">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      phone: '',      // 手机号码
      code: '',       // 验证码
      password: '',   // 密码
      password1: '',   // 重复密码
      agree: true,
    }
  },
  methods: {
    // 获取验证码 
    async getNumber () {
      try {
        // 简单验证
        const { phone } = this;
        phone && await this.$store.dispatch('getCode', phone)
        this.code = this.$store.state.user.code
      } catch (error) {
        alert(error.message)
      }
    },

    // 用户完成注册，同时携带参数。
    async userRegister () {
      try {
        const { phone, code, password, password1 } = this;
        if (phone && code && password && (password == password1)) {
          await this.$store.dispatch('userRegister', { phone, code, password })
          // 请求发送完成开始跳转.
          this.$router.push('/login')
          // 将当前的账号信息进行保存到本地
          sessionStorage.setItem('currentPhone', this.phone)
        } else if (password != password1) {
          alert('密码输入不相同！')
        } else {
          alert('表单信息输入不完整！')
        }
      } catch (error) {
        alert(error.message)
      }
    }
  },
}
</script>


<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      text-align: left;
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 411px;
      text-align: left;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      button {
        margin-left: 4px;
        width: 80px;
        height: 40px;
        line-height: 36px;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        font-size: 16px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        padding-left: 20px;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      // text-align: center;
      padding-left: 35px;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        padding-left: 20px;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      // text-align: center;
      padding-left: 42px;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
        border: 1px solid #e1251b;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>
