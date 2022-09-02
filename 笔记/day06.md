

# 1.search顶部组件中面包屑的处理。
    
    面包屑1：动态展示用户选择【三级目录】选择的目录名称。通过回调函数将removeCategoryName通知数据进行重置。
          <!-- 面包屑1：分类面包屑 -->
          <li class="with-x" v-if="searchParams.categoryName">{{searchParams.categoryName}}<i @click="removeCategoryName">×</i></li>
    
    面包屑2：动态展示用户传递的【关键字】面包屑。通过回调函数将removeKeyword通知数据进行重置。
          <!-- 面包屑2：关键字面包屑 -->
          <li class="with-x" v-if="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyword">×</i></li>
    
    面包屑3：动态展示用户选择【trademark】品牌面包屑。通过回调函数将removeKeyword通知数据进行重置。
          <!-- 面包屑3：trademark品牌面包屑 -->
          <li class="with-x" v-if="searchParams.trademark">{{searchParams.trademark.split(":")[1]}}<i @click="removeTradeMark">×</i></li>
    
    面包屑4：动态展示用户选择【属性】面包屑
          <!-- 面包屑4：品牌售卖属性面包屑 -->
          <li class="with-x" v-for="(prop,index) in searchParams.props" :key="index">
            {{prop.split(":")[1]}}
            <i @click="removeAttr(index)">×</i>
          </li>


# 2.排序处理（重点）：只需要将排序参数传递给服务器进行数据请求即可。
  1：综合排序  2：价格排序   asc：升序    desc:降序
  示例：“1：desc” 表示综合降序     “2：asc” 表示价格升序

## 2.1 order属性的属性值最多由多少种写法？
  “1：desc” “1：asc” “2：desc” “2：asc”

## 2.2谁应该有active的类名？
  1.通过order的属性值中存在的属性进行判断。
    <li :class="{active:isOne}">
      <a href="#">价格</a>
    </li>

  2.谁应该有箭头？
    解决方式：谁有类名谁有箭头。

  3.箭头用什么制作？
    使用icon图标。
    ①.在html页面中导入：<link rel="stylesheet" href="https://at.alicdn.com/t/font_3449902_pa6ns96g1wr.css">
    ②.在指定位置通过样式引入：<span v-show="isTwo" class="iconfont icon-arrowdown"></span>  arrowdown表示图标的名称

  4.通过changeOrder (index)函数传入index，判断是否是升降序还是标签切换。
    点击后先判断当前的order中存储的值是否于当前点击的idex值相等，
       如果相等，那么切换上下箭头。
       如果不相等，那么切换另一个属性。

# 3.为什么需要分页器？   电商组件三件套：【轮播】 【分页器】 【日历】
 【掌握自定义分页器】
## 3.1 分页器所需要的数据？
  pageNo：字段代表了当前页数。
  pageSize: 字段代表了每页展示的条数。
  total:    数据的总条数。
  continues: 连续的页码数。一般是5|7为什么？ 对称的。

## 3.2 自定义分页器在开发的时候先自己传递数据，然后后续再进行微调。
  目前使用props进行负组件search向子组件pagenation传递数据。

## 3.3 对于分页器而言，最重要的就是要算出：连续页面的【起始数字】和【结束数字】。
  ①.当前是第一页，连续页码数为5页。  [start 小于1的情况进行递增]
    1 2 3 4 5....10
  ①.当前是第二页，连续页码数为5页。
    1 2 3 4 5....10
  ①.当前是第三页，连续页码数为5页。
    1 2 3 4 5....10
  
  ①.当前是第四页，连续页码数为5页。
    1....2 3 4 5 6....10
  ①.当前是第7页，连续页码数为5页。
    1....5 6 7 8 9....10

  ①.当前是第8页，连续页码数为5页。  [end 大于totakPage的情况进行递减]
    1....6 7 8 9 10
  ①.当前是第9页，连续页码数为5页。
    1....6 7 8 9 10
  ①.当前是第10页，连续页码数为5页。
    1....6 7 8 9 10


## 3.4 分页器动态展示数据。   分为【上、中、下】三部分进行动态展示。
  v-for可以对数字进行遍历。

## 分页器手写总结：
   1.新建一个分页器子组件                  【pagenation】
   2.通过父组件传入值：   pageNo pageSize total continues.
   3.计算出中间连续部分的 【开始页码数】 【结束页码数】。(函数返回start和end)
      ①.注意判断总页码数不足连续页码数的情况。
      ②.注意对开头部分和结尾部分进行截取处理。
   4.子组件使用$emit('fun'，参数)进行函数触发，在父组件中进行函数调用(@fun="fun1")。