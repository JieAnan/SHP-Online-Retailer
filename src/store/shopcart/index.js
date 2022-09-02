
import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from '@/api'

// 控制 shopcart 购物车的数据管理
const state = {
  cartList: [],
};
const mutations = {
  GETCARTLIST (state, cartList) {
    state.cartList = cartList;
  }
};
const actions = {

  // 1.获取购物车数据
  async getCartList ({ commit }) {
    let result = await reqCartList();
    // 处理返回的信息
    if (result.code == 200) {
      commit('GETCARTLIST', result.data)
    }
  },

  // 2.删除购物车某项数据
  async deleteCartListById ({ commit }, skuId) {
    let result = await reqDeleteCartById(skuId)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('Delete Error'))
    }
  },

  // 3.修改产品的Checked属性
  async updateCheckedById ({ commit }, { skuId, isChecked }) {
    let result = await reqUpdateCheckedById(skuId, isChecked)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('Update Error'))
    }
  },

  // 4.删除全部勾选状态的产品:可以在actions中通过dispatch调用已有的action，同时能够获取到state仓库的值。
  deleteAllCheckedCart ({ dispatch, getters }) {
    let promise = []
    getters.cartList.cartInfoList.forEach(item => {
      if (item.isChecked == 1) {
        promise.push(dispatch('deleteCartListById', item.skuId))
      }
    });
    // 返回最终的结果。
    return Promise.all(promise)
  },
};

// getters作用在于解放数据。
const getters = {
  // 获取state中的对象数据
  cartList (state) {
    return state.cartList[0] || {}
  },
  // 获取对象数据中的购物车数据
  cartInfoList (state) {
    // 注意返回可能是空数组
    return state.cartList[0] ? state.cartList[0].cartInfoList : []
  }
};

export default {
  state,
  mutations,
  actions,
  getters,
}