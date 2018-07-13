<template>
  <section>
    <Header
      :title="title"
      :href="href"
    />
    <div class="container">
      <div class="content1">
        <div class="wrapper wrapper-header">
          <div>排名</div>
          <div>姓名</div>
          <div>学院</div>
          <div>积分</div>
        </div>
      </div>
      <div class="content">
        <!--:on-refresh="refresh"-->
        <scroller
          :on-refresh="refresh"
          :on-infinite="infinite"
          :noDataText="'没有数据'"
          ref="my_scroller"
        >

          <div><!--此处不能删--></div>
          <div class="wrapper wrapper-body" v-for="(item,index) in spectatorrankingList" :class="[index<3?'top':'']">
            <div>
              <em></em>
              <span>{{index+1}}</span>
            </div>
            <div>{{item.NAME}}</div>
            <div>{{item.ACADEMY}}</div>
            <div>{{item.SCENE_INTEGRAL}}</div>
          </div>


        </scroller>

      </div>
    </div>
  </section>
</template>

<script>
  import Header from "@/components/common/Header";
  import $ from "jquery";
  import {request} from '@/api/common';

  export default {
    name: "AudienceRanking",
    components: {
      Header
    },
    data() {
      return {
        title: "排行榜",
        href: -1,
        PAGESTART: 0,
        PAGECOUNT: 9,
        spectatorrankingList: [],
        loadList: true,
      };
    },
    created: function () {
      this.PAGESTART = -1;
    },
    mounted: function () {
      console.log($('body').height())
      console.log($('.container').height())
      var _bodyHei = $('body').height();
      var _containerHer = $('.container').height();
      var _content1Her = $('.content1').height();
      var _contentHei = _bodyHei - _containerHer;
      $('.content').css('height', (_containerHer - _content1Her) * 0.01 + 'rem');
      setTimeout(
        ()=>{
          this.PAGESTART = -1;
          this.loadList = true;
          this.rankingList = [];
          this._postList();
        },5000
      );
    },
    methods: {
      infinite(done) {
        setTimeout(() => {
          console.log('加载')

          if (this.loadList) {
            this.postList(done)
          }
          else {
            done(true);
          }
          ;
          // this.postList(done);
        }, 10)
      },
      refresh(done) {
        setTimeout(() => {
          this.PAGESTART = -1;
          this.loadList = true;
          this.rankingList = [];
          this.postList(done);
        }, 10)
      },
      _postList() {
        this.PAGESTART++;
        request.getServerData(
          {
            PAGESTART: this.PAGESTART * this.PAGECOUNT,
            PAGECOUNT: this.PAGECOUNT,
          },
          "onlineExamination.action.fieldAnswer[getSpectatorRankingList]",
          true,
          (result) => {
            console.log(result);
            if (result) {
              if (result.spectatorrankingList && result.spectatorrankingList.length) {
                if (this.PAGESTART) {
                  if (result.spectatorrankingList.length) {//如果是数组//一条以上是数组
                    result.spectatorrankingList.map(val => {
                      this.spectatorrankingList.push(val);
                    });
                  }
                }
                else {
                  this.spectatorrankingList = result.spectatorrankingList;
                }
                // fn();

              }
              else {
                this.loadList = false;
                // fn(true);
              }
            }
          }
        )
      },
      postList(fn) {
        this.PAGESTART++;
        request.getServerData(
          {
            PAGESTART: this.PAGESTART * this.PAGECOUNT,
            PAGECOUNT: this.PAGECOUNT,
          },
          "onlineExamination.action.fieldAnswer[getSpectatorRankingList]",
          true,
          (result) => {
            console.log(result);
            if (result) {
              if (result.spectatorrankingList && result.spectatorrankingList.length) {
                if (this.PAGESTART) {
                  if (result.spectatorrankingList.length) {//如果是数组//一条以上是数组
                    result.spectatorrankingList.map(val => {
                      this.spectatorrankingList.push(val);
                    });
                  }
                }
                else {
                  this.spectatorrankingList = result.spectatorrankingList;
                }
                fn();

              }
              else {
                this.loadList = false;
                fn(true);
              }
            }
          }
        )
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../../variable.less";
  /*function*/
  /*style*/
  section {
    width: @max;
    height: @max;
    .container {
      position: relative;
      height: @max;
      padding-top: 1.47rem;
      box-sizing: border-box;
      .content1 {
        position: relative;
        box-sizing: border-box;
        margin: 0 0.3rem;
        .wrapper {
          display: grid;
          grid-template-columns: 11.5% 16.5% 56.5% 15.5%;
          grid-template-rows: 0.68rem;
          div {
            line-height: 0.68rem;
            background-color: @theme;
            color: @white;
            text-align: center;
            font-size: 0.27rem;
          }
        }
        .wrapper-header {
          div {
            border: 1px solid @white;
            border-bottom-color: #c9c9c9;
          }
          div:first-child {
            border-top-left-radius: 0.05rem;
          }
          div:last-child {
            border-top-right-radius: 0.05rem;
          }
        }
      }
      .content {
        position: relative;
        height: @max;
        box-sizing: border-box;
        margin: 0 0.3rem;
        .wrapper {
          display: grid;
          grid-template-columns: 11.5% 16.5% 56.5% 15.5%;
          grid-template-rows: 0.68rem;
          div {
            line-height: 0.68rem;
            background-color: @theme;
            color: @white;
            text-align: center;
            font-size: 0.27rem;
          }
        }
        .wrapper-body {
          div {
            background-color: #f2f2f2;
            color: #626262;
            border: 1px solid #c9c9c9;
          }
        }
        .top {
          div {
            background-color: #ffe5e6;
            color: @theme;
            position: relative;
          }
          div:first-child {
            em {
              position: absolute;
              left: 10%;
              top: 50%;
              margin-top: -0.235rem;
              width: 0.26rem;
              height: 0.47rem;
              background: url(../../assets/one.png) no-repeat;
              background-size: 0.26rem 0.47rem;
            }
          }
        }
        .top + .top {
          div:first-child {
            em {
              background-image: url(../../assets/two.png);
            }
          }
        }
        .top + .top + .top {
          div:first-child {
            em {
              background-image: url(../../assets/three.png);
            }
          }
        }
      }
    }
  }
</style>
