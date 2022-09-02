<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(item,index) in cartInfoList" :key=item.id>

          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="item.isChecked == 1" @change="updateChecked(item,$event)">
          </li>

          <li class="cart-list-con2">
            <img :src="item.imgUrl">
            <div class="item-msg">{{item.skuName}}</div>
          </li>

          <li class="cart-list-con4">
            <span class="price">{{item.skuPrice}}</span>
          </li>
          <!-- 对加减、输入两个部分进行数量传值，请求服务器 -->
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('sub',-1,item)">-</a>
            <input autocomplete="off" type="text" :value="item.skuNum" minnum="1" class="itxt" @change="handler('change',$event.target.value,item)">
            <a href="javascript:void(0)" class="plus" @click="handler('add',1,item)">+</a>
          </li>

          <li class="cart-list-con6">
            <span class="sum">{{item.skuPrice * item.skuNum}}</span>
          </li>

          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCartById(item)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllCheck&&cartInfoList.length>0 " @change="updateAllCartChecked">
        <span> 全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>{{totalNum}}</span>件商品
        </div>
        <div class="sumprice">
          <em>总价(不含运费)：</em>
          <i class="summoney">{{totelPrice}}元</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" @click="$router.push('/trade')">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// 从lodash 中引入 _进行节流和防抖函数的调用
import { throttle } from "lodash"

export default {
  name: 'ShopCart',
  //  created => computed => mounted => watch
  mounted () {
    this.getShopData();
  },
  computed: {
    // 获取游客身份添加的购物车的数据。
    ...mapGetters(['cartInfoList']),

    //计算产品总价：应该先过滤出选择的商品，然后再累计总额
    totelPrice () {
      let sum = 0;
      this.cartInfoList.forEach(item => {
        if (item.isChecked == 1) {
          sum += item.skuPrice * item.skuNum
        }
      });
      return sum
    },
    // 计算所有选择的尚欧品数量
    totalNum () {
      let num = 0;
      this.cartInfoList.forEach(item => {
        if (item.isChecked == 1) {
          num += 1
        }
      });
      return num
    },

    // 判断底部复选框是否全选
    isAllCheck () {
      // every表示一假全假 && 。而some表示一真全真 ||.
      return this.cartInfoList.every((item) => item.isChecked == 1)
    },
  },
  methods: {
    // 1.获取个人购物车数据。
    getShopData () {
      this.$store.dispatch('getCartList');
    },

    // 3.对产品数量差值进行发起请求，防止多次点击出现负值，这里使用节流函数。
    // throttle节流函数不要出现箭头函数，有可能会出现上下文的this 使用节流函数：20毫秒内只是执行一次。
    handler: throttle(async function (str, num, item) {
      let skuId = item.skuId;
      let skuNum;
      // 整理参数：skuNum代表的是输入前后的差值。
      switch (str) {
        case 'change':
          skuNum = (isNaN(num) || num < 0) ? skuNum = 0 : parseInt(num) - item.skuNum
          break;
        case 'sub':
          skuNum = item.skuNum > 1 ? -1 : 0;
          break;
        case 'add':
          skuNum = 1
          break;
      }
      // 发送请求。
      try {
        await this.$store.dispatch('addOrUpdateShopCart', { skuId: skuId, skuNum: skuNum })
        this.getShopData();
      } catch (error) {
        console.log(error.message);
      }
    }, 1000),

    // 4.删除某一个商品
    async deleteCartById (item) {
      try {
        await this.$store.dispatch('deleteCartListById', item.skuId);
        this.getShopData();
      } catch (error) {
        alert(error.message)
      }
    },

    // 5.修改产品的Checked属性
    async updateChecked (item, $event) {
      try {
        let isChecked = $event.target.checked ? "1" : "0";
        await this.$store.dispatch('updateCheckedById', { skuId: item.skuId, isChecked: isChecked })
        this.getShopData();
      } catch (error) {
        console.log(error.message);
      }
    },

    // 6.删除选中的所有商品：使用Promise.all
    async deleteAllCheckedCart () {
      try {
        await this.$store.dispatch('deleteAllCheckedCart')
        this.getShopData();
      } catch (error) {
        alert(error.message);
      }
    },

    // 7.对全部按钮进行设置
    updateAllCartChecked (event) {
      let checked = event.target.checked ? "1" : 0
      this.cartInfoList.forEach(async (item) => {
        if (checked != item.isChecked) {
          try {
            await this.$store.dispatch('updateCheckedById', { skuId: item.skuId, isChecked: checked })
            this.getShopData();
          } catch (error) {
            alert(error.message);
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    text-align: left;
    font-size: 14px;
    line-height: 14px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        // width: 5%;
        padding-left: 10px;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 42%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          // width: 5%;
          padding-left: 10px;
        }

        .cart-list-con2 {
          // width: 40%;
          padding-left: 130px;
          font-size: 12px;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          // width: 30%;
          padding-left: 160px;
          font-size: 14px;
        }

        .cart-list-con5 {
          // width: 8%;
          padding-left: 100px;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 32px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          // width: 10%;
          padding-left: 70px;

          .sum {
            font-size: 14px;
          }
        }

        .cart-list-con7 {
          // width: 13%;
          padding-left: 115px;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      padding-left: 20px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 50px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 50px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>