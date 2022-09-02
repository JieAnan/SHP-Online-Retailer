// 2.引入自定义的路由组件
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Detail from '@/pages/Detail';
import AddCartSuccess from '@/pages/AddCartSuccess';

// import ShopCart from '@/pages/ShopCart';
import Trade from '@/pages/Trade';
import Pay from '@/pages/Pay';
import PaySuccess from '@/pages/PaySuccess';
import Center from '@/pages/Center';

// 引入二级路由组件
import myOrder from '@/pages/Center/myOrder';
import groupOrder from '@/pages/Center/groupOrder';



// 路由配置信息
export default [
  // 第一个表示重定向。
  {
    path: '/',
    redirect: "/home",
  },
  {
    path: '/addcartsuccess',
    name: 'addcartsuccess',
    component: AddCartSuccess,
    meta: { showFooter: true }
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    component: () => import('@/pages/ShopCart'),
    meta: { showFooter: true }
  },
  {
    path: '/trade',
    name: 'trade',
    component: Trade,
    meta: { showFooter: true },
    // 路由独享守卫：只能从指定的路径来
    beforeEnter: (to, from, next) => {
      // ...
      if (from.path == '/shopcart') {
        next()
      } else {
        next(from.path)
      }
    }

  },
  {
    path: '/pay',
    name: 'pay',
    component: Pay,
    meta: { showFooter: true },
    beforeEnter: (to, from, next) => {
      // ...
      if (from.path == '/trade') {
        next()
      } else {
        next(from.path)
      }
    }
  },
  {
    path: '/paysuccess',
    name: 'paysuccess',
    component: PaySuccess,
    meta: { showFooter: true },
    beforeEnter: (to, from, next) => {
      // ...
      if (from.path == '/pay') {
        next()
      } else {
        next(from.path)
      }
    }
  },
  {
    path: '/center',
    name: 'center',
    component: Center,
    meta: { showFooter: true },
    // 二级路由组件
    children: [
      {
        path: 'myorder',
        component: myOrder,
      },
      {
        path: 'grouporder',
        component: groupOrder,
      },
      // 重定向 center 到 myOrder
      {
        path: '/center',
        redirect: "/center/myorder",
      }
    ]
  },
  {
    path: '/home',
    component: Home,
    // 表示在此路由页面是否显示footer组件。
    meta: { showFooter: true }
  },
  {
    path: '/detail/:skuid?',
    component: Detail,
    meta: { showFooter: true }
  },
  {
    path: "/search/:keyword?",
    component: Search,
    meta: { showFooter: true },
    // 使用对象形式传递参数时候需要name
    name: 'search',
    // 路由组件能否传递props数据？ 能常用函数方式传递。

    // 方式1：布尔值写法：只包括params参数。将params参数传递到路由组件的props属性中。需要在跳转路由中设置同名参数接收
    // props: true,

    // 方式2：对象写法。额外的给路由传递一些props属性。 需要在跳转路由中设置同名参数接收
    // props: { a: 1, b: 2 },

    // 方式3：函数写法，可以给params参数、query参数，通过params传递给路由组件。
    props: ($route) => {
      return { keyword: $route.params.keyword, k: $route.query.k };
    }
  },
  {
    path: '/login',
    component: Login,
    meta: { showFooter: false }
  },
  {
    path: '/register',
    component: Register,
    meta: { showFooter: false }
  }
]