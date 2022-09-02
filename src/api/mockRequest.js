
// 对于axios进行二次封装
import axios from "axios";
// 引入进度条: 通过start 和done进行开始和结束。
import nprogress from "nprogress";
// 引入进度条的样式
import "nprogress/nprogress.css"

// 1.使用axios的create方法创建axios实例
// requext就是实例化的axios。
const requests = axios.create({
  // 配置对象
  baseURL: "/mock",         // mock虚拟数据
  timeout: 5000,           // 相应时间5s
});

// 2.请求拦截器：在发送请求之前可以检测到请求。
requests.interceptors.request.use((config) => {
  // config:配置对象 里面有一个属性很重要，header请求头。
  nprogress.start()
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