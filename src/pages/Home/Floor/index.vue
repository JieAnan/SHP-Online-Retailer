<template>
  <!--楼层-->
  <div class="floor">
    <div class="py-container">
      <div class="title clearfix">
        <h3 class="fl">{{list.name}}</h3>
        <div class="fr">
          <ul class="nav-tabs clearfix">
            <!-- 第一个关键字添加class样式 -->
            <li :class="{'active':index == 0}" v-for="(item,index) in list.navList" :key="index">
              <a href="#tab1" data-toggle="tab">{{item.text}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-content">
        <div class="tab-pane">
          <div class="floor-1">
            <div class="blockgary">
              <ul class="jd-list">
                <li v-for="(keyword,index) in list.keywords" :key="index">{{keyword}}</li>
              </ul>
              <img :src="list.imgUrl" />
            </div>

            <div class="floorBanner">
              <!-- 轮播图 -->
              <Carousel :data=list.carouselList></Carousel>
            </div>
            <!-- 左边部分 -->
            <div class="split">
              <span class="floor-x-line"></span>
              <div class="floor-conver-pit">
                <img :src="list.recommendList[0]" />
              </div>
              <div class="floor-conver-pit">
                <img :src="list.recommendList[1]" />
              </div>
            </div>

            <!-- 中间部分 -->
            <div class="split center">
              <img :src="list.bigImg" />
            </div>

            <!-- 右边部分 -->
            <div class="split">
              <span class="floor-x-line"></span>
              <div class="floor-conver-pit">
                <img :src="list.recommendList[2]" />
              </div>
              <div class="floor-conver-pit">
                <img :src="list.recommendList[3]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>



export default {
  name: "Floor",
  // 接收父组件传递过来的属性名
  props: ['list'],
  // 组件挂载完毕的地方:此时数据是从父组件传递过来的，不存在异步请求向服务器请求数据的情况，（数据+结构）能够完成。
  // mounted () {
  //   var mySwiper = new Swiper(
  //     this.$refs.floor1Swiper,
  //     {
  //       // direction: 'vertical', // 垂直切换选项
  //       loop: true,              // 循环模式选项
  //       // 如果需要分页器
  //       pagination: {
  //         el: '.swiper-pagination',
  //         clickable: true,
  //       },
  //       // 如果需要前进后退按钮
  //       navigation: {
  //         nextEl: '.swiper-button-next',
  //         prevEl: '.swiper-button-prev',
  //       },
  //     })
  // },
  // 注意：1.当使用服务器异步请求数据时候，需要等数据+结构全部渲染完成，因此使用 watch + nextTick.
  //      2.使用props接收父组件的数据时候，在子组件的created钩子中就已经将props数据进行渲染完成，因此此时数据和结结构以已经完毕。

}
</script>

<style lang="less" scoped>
.floor {
  margin-top: 15px;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .title {
      .fl {
        float: left;
        color: #c81623;
        font-size: 20px;
        line-height: 30px;
        margin: 9px 0;
        font-weight: 700;
      }

      .fr {
        float: right;

        .nav-tabs {
          margin: 10px 0 0;
          display: inline-block;

          li {
            float: left;
            line-height: 18px;

            a {
              padding-top: 1px;
              font-weight: 400;
              background-color: #fff;

              &::after {
                content: "|";
                padding: 0 10px;
              }
            }

            &:nth-child(7) {
              a {
                &::after {
                  content: "";
                }
              }
            }

            &.active {
              a {
                color: #e1251b;
              }
            }
          }
        }
      }
    }

    .tab-content {
      border-top: 2px solid #c81623;
      border-bottom: 1px solid #e4e4e4;

      .tab-pane {
        .floor-1 {
          height: 360px;
          display: flex;

          .blockgary {
            width: 210px;
            height: 100%;
            background: #f7f7f7;

            .jd-list {
              padding: 15px 0;
              overflow: hidden;

              li {
                list-style-type: none;
                float: left;
                width: 40%;
                margin: 0 10px;
                border-bottom: 1px solid #e4e4e4;
                text-align: center;
                line-height: 26px;
              }
            }

            img {
              width: 100%;
            }
          }

          .floorBanner {
            width: 330px;
            height: 100%;
          }

          .split {
            width: 220px;
            height: 100%;
            position: relative;

            .floor-x-line {
              position: absolute;
              background: #e4e4e4;
              width: 220px;
              height: 1px;
              top: 180px;
            }

            .floor-conver-pit {
              width: 100%;
              height: 50%;

              img {
                width: 100%;
                height: 100%;
                transition: all 400ms;

                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }

          .center {
            border: 1px solid #e4e4e4;
          }
        }
      }
    }
  }
}
</style>