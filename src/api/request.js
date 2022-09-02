// 对于axios进行二次封装
import axios from "axios";
// 引入进度条: 通过start 和done进行开始和结束。
import nprogress from "nprogress";
// 引入进度条的样式
import "nprogress/nprogress.css"

// 在当前模块中引入 detail的store，获取游客身份id
import store from '@/store';

// 1.使用axios的create方法创建axios实例
// requext就是实例化的axios。
const requests = axios.create({
  // 配置对象
  baseURL: "/api",         // 基础路径
  timeout: 5000,           // 相应时间5s
});


// 2.请求拦截器：在发送请求之前可以检测到请求。 需要对token和uutoken进行判断.
// ①.先对登录账户进行token判断，如果存在登录账户的token就进行跳转。
// ②.如果没有token，判断是否有游客身份UUIDTOKEN，如果有进行携带。

requests.interceptors.request.use((config) => {
  // config:配置对象 里面有一个属性很重要，header请求头。
  nprogress.start()
  if (localStorage.getItem('TOKEN')) {
    config.headers.token = localStorage.getItem('TOKEN');
  }
  else if (localStorage.getItem('UUIDTOKEN')) {
    // 给服务器的请求添加用户信息请求头，该字段是服务器api设置的字段。
    config.headers.userTempId = store.state.detail.uuid_token;
  }
  return config
})



// 3.响应拦截器
requests.interceptors.response.use(
  (res) => {
    // 成功的回调函数：服务器响应成功以后响应拦截器可以检测到。
    nprogress.done()
    return res.data
  },
  (error) => {
    // 失败的回调函数：服务器响应失败会被拦截器检测到。
    return Promise.reject(new Error(error.message || "faile"))
  })


// 对外暴露
export default requests;