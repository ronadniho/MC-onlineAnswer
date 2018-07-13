<template>
  <div class="main">
    <Header
      :title="title"
      :href="href"
      :jumpState="jumpState"
      :alert="alert"
      @child="warning"
    />
    <div class="main-content">

      <div class="action flex">
        <div class="user">欢迎回来，{{userInfo.NAME}}</div>
        <div class="tabber flex">
          <div class="tab-item" :class="[current==0?'active':'']" @click="toggleTab(0)">积分</div>
          <div class="tab-item" :class="[current==1?'active':'']" @click="toggleTab(1)">排行榜</div>
        </div>
      </div>

      <div class="content">
        <!--积分-->
        <div class="tab-ctx" v-if="!current">
          <div class="bg">
            <div class="bg-pos">
              <!--<WaterPolo :num="num" v-if="state"/>-->
              <span>{{userInfo.INTEGRAL}}</span>
            </div>
          </div>
        </div>
        <!--排名-->
        <div class="tab-ctx" v-if="current">
          <div class="wrapper-header flex">
            <div class="grid-header">排名</div>
            <div class="grid-header">姓名</div>
            <div class="grid-header">学院</div>
            <div class="grid-header">积分</div>
          </div>
          <div class="wrapper-content active flex" v-if="userRanking&&my">
            <div class="grid-item">{{userRanking.ROWNO}}</div>
            <div class="grid-item">{{userRanking.NAME}}</div>
            <div class="grid-item">{{userRanking.ACADEMY}}</div>
            <div class="grid-item">{{userRanking.INTEGRAL}}</div>
          </div>
          <div class="scroller-con" :style="{'height':h}">
            <scroller
              :on-refresh="refresh"
              :on-infinite="infinite"
              :noDataText="'没有数据'"
              ref="my_scroller"
            >
              <!--<div style="height: 1px;"></div>-->
              <!-- content goes here -->
              <div id="wrapper-list" class="wrapper-list">

                <!--item-->
                <div class="wrapper-content flex" v-for="(val,index) in rankingList"
                     :class="[val.hasClass?'active':'']">
                  <div class="grid-item">{{index+1}}</div>
                  <div class="grid-item">{{val.NAME}}</div>
                  <div class="grid-item">{{val.ACADEMY}}</div>
                  <div class="grid-item">{{val.INTEGRAL}}</div>
                </div>

              </div>


            </scroller>

          </div>


        </div>

      </div>


      <div class="btn-group">
        <!-- <button class="btn start" @click="goLink('start')">开始答题</button> -->
        <button class="btn increment" @click="goLink('increment')">参加活动</button>
        <button class="btn read" @click="goLink('read')">查看题库</button>
      </div>
    </div>
    <!--loading-->
    <Loading v-if="loading"/>
  </div>
</template>

<script>
  import Header from "../common/Header";
  import Loading from "../common/Loading";
  import WaterPolo from "../common/WaterPolo";
  import {request} from "../../api/common";
  import $ from "jquery";

  export default {
    name: "Main",
    components: {
      Header,
      Loading,
      WaterPolo
    },
    data() {
      return {
        title: "首页",
        href: "login",
        jumpState: true,
        alert: true,
        current: 0,
        num: 40,
        score: 80,
        userInfo: {},
        user_id: "",
        loading: false,
        rankingList: [], //排行集合
        userRanking: {}, //个人排名
        rankingItemH: 68, //每条高度
        PAGESTART: 0,
        PAGECOUNT: 9, //每次加载十条
        loadList: true,
        h: "",
        my: true,
      };
    },
    beforeRouteEnter(to, from, next) {
      console.log(to);
      console.log(from);
      var userInfo = sessionStorage.getItem("userInfo");
      next(vm => {
        if (!userInfo) {
          vm.$router.push({path: "login"});
        } else {
          next();
        }
      });
    },
    beforeRouteLeave(to, from, next) {
      console.log(to.path);
      console.log(from.path);
      var alerts = e => {
        console.log(e);
        if (!e.index) {
          this.userInfo = '';
          sessionStorage.removeItem('userInfo');
          next();
        } else {
         // next(false);
        }
      };
      console.log(this.userInfo)
      if (to.path == "/login" && this.userInfo) {
        mui.confirm("是否退出登录", "", ["是", "否"], alerts, "div");
        next(false);
      } else {
        next();
      }
    },
    created: function () {
      console.log(this.$route.query)
      var userInfo = sessionStorage.getItem("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
        this.user_id = this.userInfo.ID;
        this.PAGESTART = -1;
      }
    },
    mounted: function () {
      var htmlFS = $("html")
        .css("fontSize")
        .replace("px", "");
      console.log(htmlFS);
      this.h = this.PAGECOUNT * this.rankingItemH / 2 / htmlFS + "rem";
      $(".scroller-con").css("height", this.h);
      // $('._v-container').css('height', this.h + 'rem')
      console.log(history);

    },
    methods: {
      pushHistory() {
        console.log(location.origin);
        // var state = {
        //   title: "login",
        //   url: "/login"
        // };

        //window.history.replaceState(state, "main", location.origin + "/login");
        // window.history.pushState(state, "main", location.origin + "/main");
      },
      warning() {
        var self = this;
        this.$router.go(-1);
        // this.$router.push({path: "login"});
        //mui.confirm('是否退出登录', '退出', ['是', '否'], self.alerts, 'div');
      },
      alerts(e) {
        if(!e.index){
          this.$router.go(-1);
          // this.$router.push({path: "login"});
        }
      },
      refresh(done) {
        setTimeout(() => {
          this.PAGESTART = -1;
          this.loadList = true;
          this.rankingList = [];
          this.postList(done);
        }, 1500);
      },
      infinite(done) {
        setTimeout(() => {
          console.log("加载");

          if (this.loadList) {
            this.postList(done);
          } else {
            done(true);
          }
          // this.postList(done);
        }, 1500);
      },
      postList(fn) {
        this.PAGESTART++;
        // this.loading = true;
        request.getServerData(
          {
            PAGESTART: this.PAGESTART * this.PAGECOUNT,
            PAGECOUNT: this.PAGECOUNT,
            user_id: this.user_id
          },
          "onlineExamination.action.examinationAction[getRankingList]",
          true,
          result => {
            console.log(result);
            console.log("PAGESTART:" + this.PAGESTART);
            if (result.rankingList) {
              if (this.PAGESTART) {
                if (result.rankingList.length) {
                  //如果是数组//一条以上是数组
                  result.rankingList.map(val => {
                    if (val.ID == result.userRanking.ID) {
                      val.hasClass = 1;
                      this.my = false;
                    } else {
                      val.hasClass = 0;
                    }
                    this.rankingList.push(val);
                  });
                } else {
                  //否则是对象//一条数据是对象
                  if (val.ID == result.userRanking.ID) {
                    result.rankingList.hasClass = 1;
                    this.my = false;
                  } else {
                    result.rankingList.hasClass = 0;
                  }

                  this.rankingList.push(result.rankingList);
                }
              } else {
                this.userRanking = result.userRanking;
                result.rankingList.map(val => {
                  if (val.ID == result.userRanking.ID) {
                    val.hasClass = 1;
                    this.my = false;
                  } else {
                    val.hasClass = 0;
                  }
                });
                this.rankingList = result.rankingList;
              }
              fn();
            } else {
              this.loadList = false;
              fn(true);
            }

            // this.loading = false;
          }
        );
      },
      toggleTab(e) {
        console.log(e);
        this.current = e ? 1 : 0;
        // this.state = !e ? 1 : 0;
      },

      goLink(arg) {
        console.log(this.userInfo);
        if (arg == "increment") {
          this.$router.push({
            path: "answer",
          });
        } else {
          this.$router.push({path: "readAnswer"});
        }
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../../variable";
  //function

  /* .myGrid {
      display: grid;
      grid-template-columns: 98px 148px 313px 138px;
      grid-template-rows: 68px;
      grid-gap: 1px;
    }

    .myGridItem {
      box-sizing: border-box;
      line-height: 68px;
      font-size: 28px;
      text-align: center;
    }*/

  //style
  .main {
    height: @max;
    .main-content {
      padding-top: 88px;
      box-sizing: border-box;
      height: @max;
      background: linear-gradient(@white, #e5e5e5);
      position: relative;

      .action {
        padding: 32px 24px 96px;
        box-sizing: border-box;
        .user {
          font-size: 27px;
          line-height: 70px;
          color: #626262;
          flex-grow: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tabber {
          .tab-item {
            width: 141px;
            height: 70px;
            line-height: 70px;
            text-align: center;
            background-color: @white;
            border: 1px solid @theme; /*no*/
            color: #626262;
            flex-grow: 1;
            box-sizing: border-box;
          }
          .tab-item.active {
            background-color: @theme;
            color: @white;
          }
          .tab-item:first-child {
            border-top-left-radius: 5px; /*no*/
            border-bottom-left-radius: 5px; /*no*/
          }
          .tab-item:last-child {
            border-top-right-radius: 5px; /*no*/
            border-bottom-right-radius: 5px; /*no*/
          }
        }
      }

      .content {
        height: 817px;
        padding: 0 24px;
        box-sizing: border-box;
        .tab-ctx {
          .bg {
            width: @max;

            .bg-pos {
              width: 630px;
              height: 630px;
              background: url(../../assets/score.png) no-repeat 100%;
              background-size: 100%;
              margin: 0 auto;
              text-align: center;

              span {
                line-height: 630px;
                font-size: 150px;
                color: @white;
              }
            }
          }
          .wrapper-header {
            .grid-header {
              color: @white;
              border: 2px solid @theme;
              background: linear-gradient(#f99f9f, #f34141);
              height: 68px;
              line-height: 68px;
              flex-grow: 1;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              box-sizing: border-box;
            }
            .grid-header:first-child {
              width: 98px;
              border-top-left-radius: 3px; /*no*/
            }
            .grid-header:nth-child(2) {
              width: 148px;
            }
            .grid-header:nth-child(3) {
              width: 313px;
            }
            .grid-header:last-child {
              width: 138px;
              border-top-right-radius: 3px; /*no*/
            }
          }
          /*.wrapper-header {
              .myGrid();
              .grid-header:first-child {
                border-top-left-radius: 3px; !*no*!
              }
              .grid-header {
                .myGridItem();
                color: @white;
                border: 2px solid @theme; !*no*!
                border-bottom: 0;
                background: linear-gradient(#f99f9f, #f34141);
              }
              .grid-header:last-child {
                border-top-right-radius: 3px; !*no*!
              }
            }*/
          .wrapper-content {
            .grid-item {
              flex-grow: 1;
              background: linear-gradient(#f9f9f9, #e6e6e6);
              border: 1px solid #c9c9c9;
              color: #626262;
              height: 68px;
              line-height: 68px;
              text-align: center;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              box-sizing: border-box;
            }
            .grid-item:first-child {
              width: 98px;
            }
            .grid-item:nth-child(2) {
              width: 148px;
            }
            .grid-item:nth-child(3) {
              width: 313px;
            }
            .grid-item:last-child {
              width: 138px;
            }
          }
          /*.wrapper-content {
              .myGrid();
              .grid-item {
                .myGridItem();
                background: linear-gradient(#f9f9f9, #e6e6e6);
                border: 1px solid #c9c9c9; !*no*!
                color: #626262;
              }
            }*/
          .wrapper-content.active {
            .grid-item {
              color: @theme;
            }
          }
        }
      }
      .scroller-con {
        position: relative;
        width: @max;
      }
      .btn-group {
        /* position: absolute;
          bottom: 0;*/
        width: @max;
        height: 226px;
        text-align: center;
        background-color: #e5e5e5;
        .btn {
          width: 702px;
          padding: 0;
          border: 0;
          font-size: 30px;
          height: 88px;
          line-height: 88px;
          box-sizing: border-box;
          border-radius: 5px; /*no*/
        }
        .increment {
          color: @white;
          background-color: @theme;
          margin-bottom: 32px;
        }
        .read {
          color: #636363;
          background-color: @white;
          border: 1px solid #c9c9c9; /*no*/
        }
      }
    }
  }
</style>
