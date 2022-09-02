//  store 存储与vuex集中数据相关的。

import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

// 引入小仓库
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import user from './user'
import trade from './trade'


// 1.需要使用vuex
// 2.配置state：存储数据的地方
// 3.配置actions：处理action，可以书写自己的业务逻辑
// 4.配置mutations:修改state的唯一手段。
// 5.配置getters:理解计算属性，用于简化仓库数据，让组件获取仓库数据更方便。
// 6.对外暴露Store类的一个实例

// 对外暴露Store类的一个实例
export default new Vuex.Store({
  // 实现Vuex仓库模块式开发
  modules: {
    home,
    search,
    detail,
    shopcart,
    user,
    trade,
  }
});