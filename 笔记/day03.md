## 1. 完成一级分类动态添加背景颜色
   在全局组件 TypeNav 中添加一级分类选中状态的颜色。
    
    ----|方法一：采用样式添加选中状态的颜色属性。在一级状态item设置样式。
            .item:hover {
               background: #e1251b;
            }
    ----|方法二：通过js去完成。（排他思想）
        ----| 1.添加鼠标进入事件：:class="{cur:currentIndex == index} 表示实际与选中相同才会显示该样式。
        ----| 2.添加选中状态样式：.cur {
                                    background: skyblue;
                                  }
        ----|3.设置鼠标移除事件，清除currentIndex的值。<h3 @mouseenter="changeIndex(index)">
              注意：鼠标离开事件不应该放置在h3中，因为还需要选择其二级和三级分类，因此在离开的范围是整个三级分类盒子。
                    在三级分类盒子外加一个div盒子用于控制鼠标离开事件。
                    <div @mouseleave="leaveIndex()">
                      <div class="sort">...
                    </div>

# 2.通过js控制二级、三级分类动态显示。

  2.1 最开始时候通过css样式diaplsy进行设置。从none转化为block
        &:hover {
          .item-list {
            display: block;
          }
        }
  
  2.2 通过js控制二级、三级分类动态显示。
      <div class=" item-list clearfix" :style="{display:currentIndex == index?'block':'none'}">
      通过当前的currentIndex来决定哪一个模块应该显示，正常情况下，鼠标选中的一级类别会显示其二级和三级类别。


# 3.演示卡顿现象
卡顿原因： 由于用户操作过快或者回调函数太大。
          当事件触发非常频繁，而且每一次的触发，回调函数都要去执行。
          如果事件很短，而且有回调函数执行，那么浏览器就有可能反应不过来，就会有可能出现浏览器卡顿现象。
           
          当然如果使用css样式去替换对应的js函数，一般不会出现卡顿现象。

# 4.函数的防抖与节流

节流(单位时间只触发一次)：在规定的 单位时间 内只能运行执行一次回调函数，主动地把频发触发变为少量触发。（类似与在单位时间内上了锁）

防抖(单位时间只触发最后一次)：多此连续触发可能导致浏览器加载不过来。因此对于连续触发只是执行最后一次。


# 5.完成三级联动节流的操作
1.初始写法：
 // 1.鼠标进入修改响应数据currentIndex属性
    // changeIndex (index) {
    //   // 将当前鼠标指向的index的颜色设置为选中状态。
    //   this.currentIndex = index;
    //   console.log("我进来了" + index);
    // },
  
2.节流写法
// throttle节流函数不要出现箭头函数，有可能会出现上下文的this
    // 使用节流函数：20毫秒内只是执行一次。
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
      console.log("我进来了" + index);
    }, 20),

# 6.三级联动组件的路由跳转与传递参数 
三级联动用户可以点击的：一级分类、二级分类、三级分类，当点击时候：
## 6.1.从Home模块跳转到Search模块。
## 6.2.把选中的一级类别传递给search参数。

路由跳转：
声明式导航：router-link
编程式导航：push | replace

## 6.3.采用route-link进行路由跳转存在的问题：  <router-link to="search">{{c3.categoryName}}</router-link>
  
  ①.使用route-link可以实现路由的导航与传递参数，但是需要注意的是会出现卡顿现象。
  
  ②.router-link:本身是一个组件，当服务器的数据返回值后，循环出很多的router-link组件【创建组件实例的】1000+，创建组件实例的时   候，一瞬间创建1000+非常耗费内存的，因此出现了卡顿现象。
  也就是说声明式导航会一次性全部加载所有的route-link，会消耗大量的内存资源。
  
  ③.如果考虑使用编程式导航，那么只有鼠标点击对应的类别时候，才会加载该数据。

## 6.4.使用编程式导航进行路由跳转。
  1.对每一个类别的a进行编程式路由跳转 
      <a @click="goSearch">{{c3.categoryName}}</a>
      goSearch () {
        this.$router.push("/search")
      }
  上面对每一个a进行了回调绑定，因此回出现1000+的回调函数调用。也不是理想的方法，这里最理想的是采用事件委派。

  2.利用编程式导航结合事件委派进行设置。
     <div class="all-sort-list2" @click="goSearch"> 

## 6.5.使用编程式导航 + 事件委派进行路由跳转存在的问题：
    利用事件委派时候将所有子元素的click单击操作都给了父元素div：<div class="all-sort-list2" @click="goSearch">。
    那么就要确定是不是因为单击a标签，因为单击其余标签包括空白区域不应该跳转。
    存在的问题：
    1.如何确定点击的一定是a标签。（仅仅当点击a标签才会跳转）  添加自定义data属性:data-categoryname="c1.categoryname"(2,3同理)
    2.如何获取参数【1,2,3级产品的名称和id】                 添加自定义data属性:data-category1Id="c1.categoryId"(2,3同理)
    3.携带参数进行路由跳转（对象传参：注意对象传参params要与name属性使用）
    this.$router.push({name:"search",query:{categoryName:xxx}})

    代码：
    goSearch (event) {
      // 最好的解决方案：编程式导航 + 事件委派
      // 利用事件委派时候将所有子元素的click单击操作都给了父元素div：<div class="all-sort-list2" @click="goSearch">。
      // 那么在点击子元素时候不能明确是不是a标签 (为什么要确认获取的是不是a标签？是因为要通过点击事件event来得到对应a元素的属性)。【div、h3、em、a、dl、dt】

      // 1.如何确定点击的一定是a标签？    
      // ----|通过给a连接添加  :data-categoryName="c1.categoryName" 来区分事件委派中的所有a标签
      // 2.如何区分是一级、二级、三级分类的标签？
      // ----|通过给a连接天机属性：:data-category1Id="c1.categoryId"(2,3同理) 来区分123级id。

      let element = event.target;
      // 获取到了触发点击事件的节点，可能是：H3、a、dt、dd、em标签。但是我们需要带有data-categoryname属性的节点才会跳转。
      // 节点有一个dataset属性，可以获取节点的自定义属性与属性值。
      let { categoryname, category1id, category2id, category3id } = element.dataset

      // 如果节点身上有categoryname属性，那么一定是a标签。
      if (categoryname) {
        // 整理路由跳转的参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 判断是一级二级三级分类。
        if (category1id) {
          query.category1Id = category1id
        } else if (category2id) {
          query.category2Id = category2id
        } else if (category3id) {
          query.categor3Id = category3id
        }
        // 合并参数：
        location.query = query;
        // 路由传参
        this.$router.push(location)
      }
    }

