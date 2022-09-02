

import { reqGoodsInfo, reqAddOrUpdateShopCart } from '@/api'

//封装的临时游客身份id----->不能再改变。
// import { getUUID } from '@/utils/uuid_token'

const state = {
  goodInfo: {},
  // 游客临时身份，此时虽然有取到获取，但是要刷新一次才会有uuid生成，是不是没有使用的原因？
  // uuid_token: getUUID(),
}

const actions = {

  // 获取产品信息的action
  async getGoodInfo ({ commit }, skuid) {
    let result = await reqGoodsInfo(skuid);
    if (result.code === 200) {
      commit('GETGOODINFO', result.data)
    }
  },
  // 将产品添加到购物车:
  // 同时在请求头中添加身份信息：游客 或者 登录
  async addOrUpdateShopCart ({ commit }, { skuId, skuNum }) {
    // 服务器写入数据成功，并没有返回其他的数据，知识返回code==200，代表这次请求完成
    // 因此：没有必要进行三连环仓库存储。
    let result = await reqAddOrUpdateShopCart(skuId, skuNum);
    // 当前的这个函数如果执行返回Promise（不return默认undefined，return 非promise值，return promise对象）
    if (result.code === 200) {    // 加入购物车成功
      return 'ok'
    } else {   // 加入购物车失败
      return Promise.reject(new Error('fail'))
    }
  },


}

const mutations = {
  GETGOODINFO (state, goodinfo) {
    state.goodInfo = goodinfo;
  }
}

// 简化state的数据
const getters = {
  categoryView (state) {
    // 比如：state.goodinfo初始状态空对象，空对象的categoryView属性值undefined。
    return state.goodInfo.categoryView || {};
  },
  skuInfo (state) {
    return state.goodInfo.skuInfo || {};
  },
  // 产品售卖属性的简化
  spuSaleAttrList (state) {
    return state.goodInfo.spuSaleAttrList || [];
  },

}

export default {
  state,
  actions,
  mutations,
  getters
}