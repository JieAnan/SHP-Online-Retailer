
import { v4 as uuidv4 } from 'uuid';


// (类似单例模式，只能生成惟一的一个)
// 要生成一个随机的字符串，同时吗，每次不会发生变化，同时进行持久化存储。
export const getUUID = () => {
  // 先从本地存储获取uuid，看本地是否有uuid
  let uuid_token = localStorage.getItem('UUIDTOKEN')
  if (!uuid_token) {
    // 开始生成uuid，并保存到本地。
    uuid_token = uuidv4()
    localStorage.setItem('UUIDTOKEN', uuid_token)
    // console.log('我在detail的vuex仓库中哦，我将uuidtoken保存到了本地哦');
  }
  return uuid_token
}