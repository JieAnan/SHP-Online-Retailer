// search相关的store
import { reqGetSearchInfo } from "@/api"

const state = {
  searchList: {},
}
const actions = {
  // 调用 reqGetSearchInfo qpi获取 search商品信息
  async getSearchList ({ commit }, dataObj = {}) {
    let result = await reqGetSearchInfo(dataObj)
    if (result.code == 200) {
      // 提交mutations数据处理
      commit('GETSEARCHLIST', result.data)
    }
  }
}
const mutations = {
  GETSEARCHLIST (state, searchList) {
    state.searchList = searchList
  }
}


// 在项目当中，为【简化仓库中的数据】而生的。
// 如在组件中使用mapState解析属性时候使用： goodsList: state => state.search.searchList.goodsList,
// 实际上，在getters中可以将后面的属性进行映射简写。
const getters = {
  // 参数state表示当前仓库的state属性值。
  goodsList (state) {
    // 当前这样书写是有问题的：当请求发送失败时候searchList为空对象没有goodsList属性，因此需要判断
    return state.searchList.goodsList || []
  },
  trademarkList (state) {
    // 当前这样书写是有问题的：当请求发送失败时候searchList为空对象没有goodsList属性，因此需要判断
    return state.searchList.trademarkList || []
  },
  attrsList (state) {
    // 当前这样书写是有问题的：当请求发送失败时候searchList为空对象没有goodsList属性，因此需要判断
    return state.searchList.attrsList || []
  },

}

export default {
  state,
  actions,
  mutations,
  getters
}