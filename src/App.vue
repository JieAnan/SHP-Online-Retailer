<template>
  <div id="app">
    <Header></Header>
    <!-- 路由组件出口 -->
    <router-view></router-view>
    <!-- 在Home、Search显示的，在Login、Register 时候进行隐藏：通过控制data中$route\或者使用每个路由的元信息-->
    <Footer v-show="$route.meta.showFooter"></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header/index'
import Footer from '@/components/Footer/index'

export default {
  name: 'App',
  components: {
    Footer,
    Header
  },
  mounted () {
    // 根组件只是执行一次。
    // 通过vuex派发action
    this.$store.dispatch('categorylist')
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
