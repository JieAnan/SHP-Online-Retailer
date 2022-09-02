
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogOut } from '@/api'

// 注册与登录模块
const state = {
  code: '',
  token: '',
  userInfo: {},       // 存储用户信息
}
const mutations = {
  // 存储用户的验证码
  GETCODE (state, data) {
    state.code = data;
  },
  // 存储用户的token
  USERLOGIN (state, token) {
    state.token = token
  },

  // 存储token返回的用户信息
  USERINFO (state, info) {
    state.userInfo = info;
  },

  // 清空state中的信息：token userInfo
  CLEAR (state) {
    state.token = '';
    state.userInfo = {};
  },
}
const actions = {
  // 发送手机验证码action
  async getCode ({ commit }, phone) {
    try {

      let result = await reqGetCode(phone)
      if (result.code == 200) {
        commit('GETCODE', result.data)
        return 'ok'
      } else {
        return Promise.reject(new Error('验证码发送失败！'))
      }
    } catch (error) {
      // 没有发送成功
      alert('未发送成功！请核对手机号码')
    }
  },

  // 用户注册
  async userRegister ({ commit }, user) {
    let result = await reqUserRegister(user)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  },

  // 用户登录
  async userLogin ({ commit }, user) {
    let result = await reqUserLogin(user)
    // 服务器下发给用户的token是用户的唯一标识符，需要进行本地存储。
    if (result.code == 200) {
      commit('USERLOGIN', result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  },

  // 获取用户信息
  async userInfo ({ commit }) {
    let result = await reqUserInfo()
    if (result.code == 200) {
      commit('USERINFO', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  },

  // 退出登录
  // 注意：actions里面不能操作state
  async logOut ({ commit }) {
    let result = await reqLogOut()
    if (result.code == 200) {
      commit('CLEAR')
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
}
const getters = {
}

export default {
  state,
  mutations,
  actions,
  getters
}