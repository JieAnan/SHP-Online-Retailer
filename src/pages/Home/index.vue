<template>
  <div>
    <!-- 三级联动全局组件：已经注册为全局组件，不需要再进行引入了。 -->
    <TypeNav></TypeNav>
    <!-- 轮播图及list组件 -->
    <ListContainer></ListContainer>
    <!-- 推荐静态组件 -->
    <Recommed></Recommed>
    <!-- 商品排行组件 -->
    <Rank></Rank>
    <!-- 喜欢组件 -->
    <Like></Like>
    <!-- Floor组件-->
    <Floor v-for="(floor,index) in floorList" :key="floor.id" :list="floor"></Floor>
    <!-- 商标组件Brand -->
    <Brand></Brand>

    <!-- 测试仓库store -->
  </div>
</template>

<script>
// 引入轮播图和listcontainer组件---局部组件
import ListContainer from "@/pages/Home/ListContainer"
// 引入推荐组件 Recommed---局部组件
import Recommed from "@/pages/Home/Recommed"
// 引入商品排行 Rank
import Rank from "@/pages/Home/Rank"
// 引入喜欢 Like
import Like from "@/pages/Home/Like"
// 引入Floor组件
import Floor from "@/pages/Home/Floor"
// 引入Brand组件
import Brand from "@/pages/Home/Brand"

import { mapState } from "vuex"
export default {
  name: 'Home',
  components: { ListContainer, Recommed, Rank, Like, Floor, Brand },
  computed: {
    // 结构出 floorList
    ...mapState({
      floorList: state => state.home.floorList
    })
  },
  mounted () {
    this.$store.dispatch("getFloorList");
    // this.$store.dispatch('userInfo')
  },
  methods: {
    add () {
      // 派发actions:调用actions里面的 addCount 函数。
      this.$store.dispatch('addCount')
    },
    sub () {
      // 派发actions:调用actions里面的 subCount 函数。
      this.$store.dispatch('subCount')
    }
  },
}
</script>

<style>
</style>