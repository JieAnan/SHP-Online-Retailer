<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(slide,index) in skuImageList" :key="slide.skuid">
        <img :src="slide.imgUrl" :class="{active:currentImg == index}" @click="changeImg(index)">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>

import Swiper from 'swiper'
export default {
  name: "ImageList",
  data () {
    return {
      currentImg: 0
    }
  },
  props: ['skuImageList'],
  watch: {
    // 监听数据：可以保证数据一定是ok的，但是不能保证v-for遍历的结构是完整的。
    skuImageList (newValue, oldValue) {
      this.$nextTick(() => {
        new Swiper(this.$refs.cur, {

          // 控制分页器图片显示个数
          slidesPerView: 3,
          // 控制分页器图片每次点动的数量
          slidesPerGroup: 3,
          // 如果需要前进后退按钮
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        })
      })
    },
  },
  methods: {
    // 修改当前点击的图片索引
    changeImg (index) {
      this.currentImg = index;
      // 通知兄弟组件放大镜开始切换对应图片
      this.$bus.$emit('getIndex', this.currentImg);
    },
  },
}
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>