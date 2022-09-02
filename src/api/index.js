
// 统一管理所有的api接口
import requests from "./request"
import mockrequests from "./mockRequest"


/* 获取二级分类的接口 GET  /admin/product/getCategory2/{category1Id}

// 1.箭头函数写法
// export const reqCategory2List = (id1) => request({ url: `/admin/product/getCategory2/${id1}`, methods: 'get' })

// 2.函数写法
export function reqCategory2List (id1) {
    return request({
        url: `/admin/product/getCategory2/${id1}`,
        method: 'get',
    })
} */

// 1.三级联动接口：/api/product/getBaseCategoryList   Get   无参数
export function reqCategoryList () {
  // 发请求：axios返回结果Promise对象
  return requests({
    url: "/product/getBaseCategoryList",
    method: 'get',
  });
}

// 2.给mock数据发送请求，使用mockRequest.js
// 获取banner轮播图数据。
export function reqGetBannerList () {
  return mockrequests({
    url: "/banner",
    method: 'get',
  });
}

// 3.获取floor轮播图数据。
export function reqFloorList () {
  return mockrequests({
    url: "/floor",
    method: 'get',
  });
}

// 4.获取搜索页面数据
// 参数： 带参数 对象参数
// 带的参数：至少是一个空对象。 reqGetSearchInfo ({}) ，因此此处可以使用空对象作为默认值
export function reqGetSearchInfo (dataObj = {}) {
  return requests({
    url: "/list",
    method: 'post',
    data: dataObj
  });
}


// 5.获取商品详情页的数据，需要传递商品id    get  /api/item/{skuid}
export function reqGoodsInfo (skuid) {
  return requests({
    url: `/item/${skuid}`,
    method: 'get',
  });
}

// 6.见将产品添加到购物车中，获取更新某一个产品的个数。  post   /api/cart/addToCart/{skuId}/{skuNum}
export function reqAddOrUpdateShopCart (skuId, skuNum) {
  return requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: 'post',
  })
}


// 7.获取购物车列表数据的接口   get  /api/cart/cartList
export function reqCartList () {
  return requests({
    url: "/cart/cartList",
    method: 'get',
  })
}


// 8.删除某一个商品  delete    /api/cart/deleteCart/{skuId}
export function reqDeleteCartById (skuId) {
  return requests({
    url: `/cart/deleteCart/${skuId}`,
    method: 'delete',
  })
}

// 9.修改单个产品的选中状态     get     /api/cart/checkCart/{skuId}/{isChecked}
export function reqUpdateCheckedById (skuId, isChecked) {
  return requests({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'get',
  })
}

// 10.注册用户获取验证码接口：  get    /api/user/passport/sendCode/{phone} 
export function reqGetCode (phone) {
  return requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'get',
  })
}

// 11.注册用户      post       /api/user/passport/register     phone, code, password
export function reqUserRegister (data) {
  return requests({
    url: "/user/passport/register",
    data: data,
    method: 'post',
  })
}

// 12.登录用户  post    /api/user/passport/login     phone,password
export function reqUserLogin (data) {
  return requests({
    url: "/user/passport/login",
    data: data,
    method: 'post',
  })
}


// 13.使用token获取用户的信息   get /api/user/passport/auth/getUserInfo
export function reqUserInfo () {
  return requests({
    url: "/user/passport/auth/getUserInfo",
    method: 'get',
  })
}


// 14.退出登录       get  /api/user/passport/logout
export function reqLogOut () {
  return requests({
    url: "/user/passport/logout",
    method: 'get',
  })
}


// 15.获取用户地址信息   get  /api/user/userAddress/auth/findUserAddressList
export function reqAddressInfo () {
  return requests({
    url: "/user/userAddress/auth/findUserAddressList",
    method: 'get',
  })
}

// 16.获取用户订单交易页信息  get /api/order/auth/trade
export function reqTradeInfo () {
  return requests({
    url: "order/auth/trade",
    method: 'get',
  })
}

// 17.获取trade中的tradeNo交易编号，向服务器发送支付请求。 post  /order/quth/submitOrder?tradeNo={tradeNo}
export function reqSubmitOrder (tradeNo, data) {
  return requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: 'post',
    data,
  })
}

// 18.根据订单号获取订单信息，在pay组件中进行展示。  get  /api/payment/weixin/createNative/{orderId}
export function reqPayOrder (orderId) {
  return requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'get',
  })
}

// 19.根据orderId查询是否支付成功   get  /api/payment/weixin/queryPayStatus/{orderId}
export function reqPayStatus (orderId) {
  return requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: 'get',
  })
}

// 20.获取个人订单列表      get   /api/order/auth/{page}/{limit}
export function reqOrderList (page, limit) {
  return requests({
    url: `/order/auth/${page}/${limit}`,
    method: 'get',
  })
}
