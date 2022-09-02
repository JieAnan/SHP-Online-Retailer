
import { reqAddressInfo, reqTradeInfo, } from '@/api'

// 注册与登录模块
const state = {
  address: [],
  trade: {},
}
const mutations = {
  // 处理返回的地址数据
  GETADDRESSINFO (state, data) {
    state.address = data;
  },
  // 处理返回的交易信息
  GETTRADEINFO (state, data) {
    state.trade = data;
  }
}
const actions = {
  // 1.发送请求获取用户地址信息。
  async getAddressInfo ({ commit }) {
    let result = await reqAddressInfo()
    if (result.code == 200) {
      commit('GETADDRESSINFO', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  },

  // 2.发送请求获取用户订单交易信息。
  async getTradeInfo ({ commit }) {
    let result = await reqTradeInfo()
    if (result.code == 200) {
      commit('GETTRADEINFO', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  },
}
const getters = {
}

export default {
  state,
  mutations,
  actions,
  getters
}