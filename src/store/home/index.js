// home相关的search

// 1.需要使用vuex
// 2.配置state：存储数据的地方
// 3.配置actions：处理action，可以书写自己的业务逻辑
// 4.配置mutations:修改state的唯一手段。
// 5.配置getters:理解计算属性，用于简化仓库数据，让组件获取仓库数据更方便。
// 6.对外暴露Store类的一个实例

import { reqCategoryList, reqGetBannerList, reqFloorList } from "@/api"


//封装的临时游客身份id----->不能再改变。
import { getUUID } from '@/utils/uuid_token'

const state = {
  // 根据服务器接口返回数据初始化的。
  categoryList: [],
  // banner数据
  bannerList: [],
  // floor数据
  floorList: [],

  // 游客临时身份，此时虽然有取到获取，home组件一开始就存储到本地等待调用。
  uuid_token: getUUID(),
}

const actions = {
  // 1.发送商品目录请求：通过api里面的函数请求向服务器发送请求。
  async categorylist ({ commit }) {
    let result = await reqCategoryList();
    if (result.code == 200) {
      commit("CATEGORYLIST", result.data)
    }
  },

  // 2.发送banner数据请求：在ListContainer组件中派发请求
  async getBannerList ({ commit }) {
    let result = await reqGetBannerList();
    if (result.code == 200) {
      commit("GETBANNERLIST", result.data)
    }
  },

  // 3.发送floor数据请求
  async getFloorList ({ commit }) {
    let result = await reqFloorList();
    if (result.code == 200) {
      commit("GETFLOORLIST", result.data)
    }
  },
}

const mutations = {
  CATEGORYLIST (state, data) {
    // 将传入的参数存储到state之中。
    state.categoryList = data
  },
  GETBANNERLIST (state, data) {
    state.bannerList = data
  },
  GETFLOORLIST (STATE, data) {
    state.floorList = data
  }
}

const getters = {

}

export default {
  state,
  actions,
  mutations,
  getters
}