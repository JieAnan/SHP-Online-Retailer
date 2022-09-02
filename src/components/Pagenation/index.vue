<template>
  <div class="pagination">
    <button :disabled="pageNo==1" @click="$emit('getPageNo',pageNo-1)">上一页</button>
    <!-- 前半部分：通过start是否大于1决定 -->
    <button v-if="startNumberAndEndnumber.start>1" @click="$emit('getPageNo',1)" :class="{active:pageNo==1}">1</button>
    <!-- 对于2-6时候，1和2之间不应该有省略符号 -->
    <button v-if="startNumberAndEndnumber.start>2">···</button>

    <!-- 中间结构 -->
    <button v-for="(page,index) in startNumberAndEndnumber.end" :key="index" v-show="page>= startNumberAndEndnumber.start" @click="$emit('getPageNo',page)" :class="{active:pageNo==page}">{{page}}</button>

    <!-- 后半部分 -->
    <button v-if="startNumberAndEndnumber.end<this.totalPage -1">···</button>
    <button v-if="startNumberAndEndnumber.end<this.totalPage" @click="$emit('getPageNo',totalPage)" :class="{active:pageNo==totalPage}">{{totalPage}}</button>

    <button :disabled="pageNo==totalPage" @click="$emit('getPageNo',pageNo+1)">下一页</button>
    <button style="margin-left: 30px">共 {{totalPage}} 页</button>
  </div>
</template>


<script>
export default {
  name: 'Pagenation',
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    // 1.计算总共包含多少页
    totalPage () {
      return Math.ceil(this.total / this.pageSize)
    },

    // 2.计算出连续的页码起始数字于结束数字，【连续的页码数：5】
    startNumberAndEndnumber () {
      let start = 0, end = 0;                   // 存储起始数字和结束数字。
      if (this.totalPage < this.continues) {    // 总页码不足continues
        start = 1;
        end = this.totalPage;
      }
      else {                                    // 总页码大于continues
        start = this.pageNo - Math.floor(this.continues / 2)
        end = this.pageNo + Math.floor(this.continues / 2)
      }
      // 对start小于1、end大于totalPage的情况进行处理。
      if (start < 1) {
        start = 1;
        end = this.continues;
      }
      if (end > this.totalPage) {
        end = this.totalPage;
        start = this.totalPage - this.continues + 1;
      }
      return { start, end };
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 书写控制分页器的函数

  },
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>