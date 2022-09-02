import Vue from 'vue'
import App from './App.vue'

// 引入配置完成的路由
import router from '@/router';
// 引入vuex仓库
import store from "@/store";

// 引入swiper的样式，方便所有组件使用。
import "swiper/css/swiper.css";

// 统一引入api中的所有接口函数
import * as API from '@/api';




// 引入三级联动组件---全局组件
import TypeNav from "@/components/TypeNav"
// 引入轮播图组件---全局组件
import Carousel from "@/components/Carousel"
// 引入分页器组件---全局组件
import Pagenation from "@/components/Pagenation"

import { Button, Select, MessageBox } from 'element-ui';
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);



// 注册全局组件：第一个参数：全局组件的名字。第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagenation.name, Pagenation)


// 引入 vue-lazyload图片懒加载
import VueLazyLoad from 'vue-lazyload';
// 引入默认的gif图片
import atm from '@/assets/default.gif';

Vue.use(VueLazyLoad, {
  // 懒加载默认的图片
  loading: atm
});

// 引入MockServe.js虚拟数据
import "@/mock/mockServe.js"
Vue.config.productionTip = false

new Vue({
  // 注册路由
  router: router,
  // 注册vuex仓库:每一个组件实例身上多了$store属性。
  store: store,

  render: h => h(App),
  // 全局事件bus配置
  beforeCreate () {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;        // 全局可使用API

    // el-button使用原型挂载
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
  }
}).$mount('#app')
