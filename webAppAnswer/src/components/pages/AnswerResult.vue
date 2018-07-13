<template>
  <div class="container">
    <Header
      :title="title"
      :href="href"
    />

    <div class="container answer">
      <!--主内容-->
      <div class="content">
        <!--标题-->
        <div class="subject">
          <b>{{examName}}</b>
        </div>
        <!--答案-->
        <div class="result">
          <!--item-->
          <div class="result-item" v-for="(item,index) in examinationPaperList" :key="index">
            <div>
              <!--题目-->
              <div class="title">
                {{item.QUESTIONS_CONTENT}}
              </div>
              <!--item-->
              <div class="box-item single" v-if="item.QUESTIONS_TYPE==0">

                <div class="box" v-for="(child,idx) in item.option_content" :key="idx">
                  <input type="radio"
                         :id="'radio'+item.ID+idx"
                         :value="child"
                         v-model="item.ANSWER"
                         disabled
                  />
                  <label :for="'radio'+item.ID+idx">{{child}}</label>
                </div>

                <div class="success" v-if="item.answer_results==0">你答对了</div>
                <div class="danger" v-else>你答错了,正确答案：{{item.REFERENCE_ANSWER}}</div>
              </div><!--单选-->

              <div class="box-item multi" v-if="item.QUESTIONS_TYPE==1">

                <div class="box" v-for="(child,idx) in item.option_content" :key="idx">
                  <input type="checkbox"
                         :id="'checkbox'+item.ID+idx"
                         :value="child"
                         v-model="item.ANSWER"
                         disabled
                  />
                  <label :for="'checkbox'+item.ID+idx">{{child}}</label>
                </div>

                <div class="success" v-if="item.answer_results==0">你答对了</div>
                <div class="danger" v-else>你答错了,正确答案：{{item.REFERENCE_ANSWER}}</div>
              </div><!--多选-->
            </div>
          </div>
        </div>


      </div>
    </div>

    <div class="btn-group">
      <button @click="back">返回首页</button>
    </div>


    <!--loading-->
    <!--<Loading v-if="loading"/>-->
  </div>
</template>

<script>
  import Header from '../common/Header';
  import Loading from '../common/Loading';
  import {_post} from '../../api/index'
  import {__BASE64} from "../../api/base64";
  import req from '../../api/index';
  import browser from '../../api/checkVersion';

  export default {
    name: 'Answer',
    components: {
      Header,
      Loading,

    },
    data() {
      return {
        title: '考试结果',
        examName: '同济党建知识竞赛学习试题',
        examinationPaperList: [],
        // jumpState: true,
        href: -2,
        res:{},
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(to);
      console.log(from);
      next(vm => {
        console.log(vm.global.isLogin);
        if (!vm.global.isLogin) {
          console.log(vm.$router);
          vm.$router.push({path: 'login'});
        } else {
          next();
        }
      });
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建
    },
    beforeRouteLeave(to, from, next) {
      console.log(to.path);
      console.log(from.path);
      console.log(this.$router);
      console.log(history);
      var alerts = e => {
        console.log(e);
        if (!e.index) {
          next();
        }
        else {
          this.global.isLogin = true;
          next(false);
        }
      };

      if ((to.path == "/main"||to.path == "/answer") && this.global.isLogin) {
        console.log(this.global.isLogin);
        // next();
        // this.$router.push({ path: "login" });
        // mui.confirm("是否退出登录", "退出", ["是", "否"], alerts, "div");
        console.log('-------------1------------')
        next();
        // this.$router.go(-1);
        var userInfo = JSON.stringify(this.res);
        this.$router.replace({path:'main',query:{userInfo}});
      } else {
        console.log('-------------2------------')
        next();
      }

      // next();
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
    },
    created: function () {
      console.log(this.$route.query.res)
      // console.log(JSON.parse(this.$route.query.res))
      if(this.$route.query.res){
        var res = JSON.parse(this.$route.query.res);
        this.res = res.userInfo;
        res.examinationPaperList.map(val => {
          if (val.QUESTIONS_TYPE == 1) {
            if (val.ANSWER != '') {
              val.ANSWER = val.ANSWER.split('|');
            }
          }
        });
        this.examinationPaperList = res.examinationPaperList;
      }
    },
    methods: {
      back(){
        console.log(this.res)
        var userInfo = JSON.stringify(this.res);
        // this.$router.go(-1);
        this.$router.replace({path:'main',query:{userInfo}});
        // this.$router.push({path:'main'});
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../variable';

  .container {
    width: @max;
    height: @max;
    padding-top: 88px;
    box-sizing: border-box;
    position: relative;
  }

  .answer {
    position: absolute;
    top: 0;
    /*padding-bottom: 152px;*/

    .content {
      padding: 0 24px 88px;
      box-sizing: border-box;
      .subject {
        b {
          .base(@answer-col-62, @answer-font-32);
          line-height: 88px;
          width: 728px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .result {
        box-sizing: border-box;
        .result-item {
          padding: 30px 0;
          border-bottom: 1px solid @answerList-col-a8;
        }
        .title {
          .base(@answer-col-62, @answer-font-28);
          line-height: 56px;
        }
        .single {
          .box {
            width: 100%;
            min-height: 69px;
            padding: 15px 0;
          }

          input {
            display: none;
          }

          label {
            width: 100%;
            height: 100%;
            display: inline-block;
            position: relative;
            line-height: 69px;
            .base(@answer-col-62, @answer-font-28);
            padding-left: 100px;
            box-sizing: border-box;
          }
          label:active {
            background: #EEEEEE;
          }
          label:after {
            content: ""; /*必须设置*/
            display: inline-block;
            width: 70px;
            height: 70px;
            border: 1px solid @answer-col-c9; /*no*/
            position: absolute;
            top: 0px;
            left: 15px;
            border-radius: 50%;
            box-sizing: border-box;
          }

          input:checked + label:after {
            /*background-color: @theme;*/
            background: url(../../assets/raido.png) no-repeat;
            background-size: 100%;
          }
        }
        .multi {
          .box {
            width: 100%;
            min-height: 70px;
            padding: 15px 0;
          }
          input {
            display: none;
          }
          label {
            width: 100%;
            height: 100%;
            display: inline-block;
            line-height: 75px;
            position: relative;
            .base(@answer-col-62, @answer-font-28);
            padding-left: 100px;
            box-sizing: border-box;
          }
          label:active {
            background: #EEEEEE;
          }
          label:after {
            content: "";
            width: 71px;
            height: 71px;
            /*border: 1px solid @answer-col-c9; !*no*!*/
            display: inline-block;
            position: absolute;
            top: 0;
            left: 15px;
            background: url(../../assets/no-multi.png) no-repeat;
            background-size: 100%;
          }
          input:checked + label:after {
            content: "";
            /* color: @white;
             text-align: center;
             font-size: 60px;*/
            background: url(../../assets/multi.png) no-repeat;
            background-size: 100%;
          }

        }
      }
    }

    .submit {
      position: fixed;
      bottom: 0;
      background-color: @white;
      width: @max;
      height: 152px;
      padding-top: 32px;
      box-sizing: border-box;
      text-align: center;
      div {
        flex-grow: 1;
        button {
          background-color: @theme;
          border-radius: 5px; /*no*/
          border: 0;
          width: 258px;
          line-height: 88px;
          .base(@white, @answer-font-30);
        }
        button.no {
          color: @answer-col-62;
          background-color: @white;
          border: 1px solid @answer-col-c9; /*no*/
        }
      }

    }
  }

  .answerCard {
    padding-bottom: 152px;
    .subject {
      padding: 0 27px;
      box-sizing: border-box;
      border-bottom: 1px solid @answer-col-c9; /*no*/
      b {
        .base(@answer-col-62, @answer-font-32);
        line-height: 88px;
        width: 728px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      a {
        display: inline-block;
        font-size: 50px;
        height: 50px;
        line-height: 88px;
      }
    }
    .guide {
      padding-top: 36px;
      dl {
        width: @max;
        dt {
          .base(@answer-col-62, @answer-font-28);
          padding: 0 24px;
          box-sizing: border-box;

        }
        dd {
          .base(@answer-col-62, @answer-font-28);
          width: 20%;
          height: 108px;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            display: block;
            border-radius: 50%;
            border: 4px solid @answer-col-c9; /*no*/
            .base(@answer-col-62, @answer-font-28);
            width: 68px;
            height: 68px;
            line-height: 68px;
            text-align: center;
          }
          span.sel {
            background-color: @theme;
            color: @white;
          }
          span.sign {
            border-color: #1F86FF
          }
        }
      }
    }
    .submit {
      position: fixed;
      bottom: 0;
      background-color: @white;
      width: @max;
      height: 152px;
      padding-top: 32px;
      box-sizing: border-box;
      text-align: center;
      button {
        background-color: @theme;
        border-radius: 5px; /*no*/
        border: 0;
        width: 500px;
        line-height: 88px;
        .base(@white, @answer-font-30);
      }

    }
  }

  .modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: @max;
    height: @max;
    background-color: rgba(0, 0, 0, .4);
    z-index: 1000;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 300px;
      margin-left: -150px;
      margin-top: -150px;
    }
    .modal-diag {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -310px;
      margin-top: -309px;
      .modal-bg {
        width: 620px;
        height: 520px;
        background: url(../../assets/modal-bg.png) no-repeat;
        background-size: cover;
        position: relative;
        p {
          width: 520px;
          color: @theme;
          font-size: 30px;
          position: absolute;
          bottom: 46px;
          left: 50%;
          margin-left: -260px;
          text-align: center;
        }
      }
      .btn-group {
        width: @max;
        height: 98px;
        display: table;
        content: '';
        clear: both;
        button {
          color: @white;
          font-size: 30px;
          background-color: @theme;
          height: 98px;
          line-height: 98px;
          border: 0;
          width: @max/2;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          float: left;
        }
        button:last-child {
          background-color: #918181;
        }
      }
    }
  }
  .danger{
    color:#d9534f;
  }
  .success{
    color:#5cb85c;
  }
  .btn-group {
    position: fixed;
    bottom: 0;
    background-color: @white;
    width: @max;
    height: 88px;
    padding: 0 24px;
    box-sizing: border-box;
    button {
      border: 0;
      border-radius: 5px;
      width: @max;
      height: 88px;
      background-color: @theme;
      color: @white;
      font-size: 30px;
    }
  }

</style>
