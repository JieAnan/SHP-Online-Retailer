<template>
  <div>
    <div class="swiper-container" ref="cur">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in data" :key="item.id">
          <img :src="item.imgUrl">
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>

      <!-- 如果需要导航按钮 -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>

</template>

<script>
// swiper插件使用流程：
// 1.第一步：引包,引入对应的js包和css包。
// 2.第二步：创建相应的div结构，结构中包含css的样式。
// 3.第三步：书写script函数部分。
// 使用swiper轮播三部：引包 结构 实例化Swiper
import Swiper from 'swiper';

export default {
  name: 'Carousel',
  props: ['data'],
  watch: {
    data: {
      immediate: true,           // 代表立即监听，防止props数据不能被监听到(list数据从来没有发生变化)。
      handler () {
        this.$nextTick(() => {
          var mySwiper = new Swiper(
            this.$refs.cur,
            {
              // direction: 'vertical', // 垂直切换选项
              loop: true,              // 循环模式选项
              // 如果需要分页器
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
              },
              // 如果需要前进后退按钮
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
            })
        })
      }
    }
  }
}
</script>

<style>
</style>