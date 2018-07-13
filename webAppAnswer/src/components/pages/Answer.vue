<template>
  <div>
    <Header
      :title="title"
      :href="href"
      :jumpState="jumpState"
      :alert="alert"
      @child="warning"
    />
    <!--答题-->
    <div class="container answer" v-if="layerToggle&&!message">
      <!--页码-->
      <!--<div class="action flex">
        <div class="tip">
          <span>{{page}}</span>
          <span>/{{totalPage}}</span>
        </div>
        <div class="action-btn flex flex-align-center">
          <a @click="answerCardToggle">
            <img src="../../assets/answer.png" alt="">
            <span>答题卡</span>
          </a>
          <a @click="signToggle" v-for="(item,index) in examlist" v-if="index+1==page">
            <img src="../../assets/sign.png" alt="">
            <span>{{item.sign?'已标记':'标记'}}</span>
          </a>
        </div>
      </div>-->
      <!--主内容-->
      <div class="content">
        <!--标题-->
        <div class="subject">
          <b>{{examName}}</b>
        </div>
        <!--答案-->
        <div class="result">
          <!--item-->
          <div class="result-item">
            <div>
              <!--题目-->
              <div class="title">
                {{msg_json.QUESTIONS_CONTENT}}
              </div>
              <!--item-->
              <div class="box-item single">

                <div class="box" v-for="(child,idx) in msg_json.option_content" :key="idx" @click="setsSession">
                  <input type="radio"
                         :id="'radio'+msg_json.ID+idx"
                         :value="child"
                         v-model="msg_json.ANSWER"
                         :disabled="msg_json.disabled"
                  />
                  <label :for="'radio'+msg_json.ID+idx"
                         :class="[
                         msg_json.disabled&&child==msg_json.REFERENCE_ANSWER?'pass':'',
                         msg_json.disabled&&child==msg_json.ANSWER&&child!==msg_json.REFERENCE_ANSWER?'no':''
                         ]">{{sel[idx]}}&nbsp;&nbsp;&nbsp;{{child}}</label>
                </div>

              </div><!--单选-->

            </div>
          </div>
          <!--
                    <div class="result-item" v-for="(item,index) in examlist" :key="item.ID">
                      <div v-if="index+1==page">
                        &lt;!&ndash;题目&ndash;&gt;
                        <div class="title">
                          {{item.QUESTIONS_CONTENT}}
                        </div>
                        &lt;!&ndash;item&ndash;&gt;
                        <div class="box-item single" v-if="item.QUESTIONS_TYPE==0">

                          <div class="box" v-for="(child,idx) in item.option_content" :key="idx">
                            <input type="radio"
                                   :id="'radio'+item.ID+idx"
                                   :value="child"
                                   v-model="item.ANSWER"
                                   :disabled="statue"
                            />
                            <label :for="'radio'+item.ID+idx">{{child}}</label>
                          </div>

                        </div>&lt;!&ndash;单选&ndash;&gt;

                        <div class="box-item multi" v-if="item.QUESTIONS_TYPE==1">

                          <div class="box" v-for="(child,idx) in item.option_content" :key="idx">
                            <input type="checkbox"
                                   :id="'checkbox'+item.ID+idx"
                                   :value="child"
                                   v-model="item.ANSWER"
                            />
                            <label :for="'checkbox'+item.ID+idx">{{child}}</label>
                          </div>
                        </div>&lt;!&ndash;多选&ndash;&gt;
                      </div>
                    </div>
          -->
        </div>

      </div>
      <!--控制器-->
      <!-- <div class="submit flex flex-justify-center">
        <div>
          <button :class="page>1?'':'no'" @click="prev">上一题</button>
        </div>
        <div v-if="page<totalPage">
          <button :class="page<totalPage?'':'no'" @click="next">下一题</button>
        </div>
        <div v-if="page==totalPage">
          <button @click="submit">交卷</button>
        </div>
      </div> -->
    </div>

    <!--答题卡-->
    <!--<div class="container answerCard" v-if="!layerToggle&&!message">
      <div class="subject flex">
        <b>
          党的十九大精神学习试题
        </b>
        <a @click="answerCardToggle">&times;</a>
      </div>
      <div class="guide">
        <dl class="clr">
          <dt>单选题</dt>

          <dd class="lt" v-for="(item,index) in examlist" v-if="item.QUESTIONS_TYPE==0">
            <span @click="guide(index)" :data-index="index+1"
                  :class="[(item.ANSWER.length||item.ANSWER!='')?'sel':'', item.sign?'sign':'']">{{index+1}}</span>
          </dd>
        </dl>
      </div>
      <div class="guide">
        <dl class="clr">
          <dt>多选题</dt>
          <dd class="lt" v-for="(item,index) in examlist" v-if="item.QUESTIONS_TYPE==1">
            <span @click="guide(index)" :data-index="index+1"
                  :class="[(item.ANSWER.length||item.ANSWER!='')?'sel':'', item.sign?'sign':'']">{{index+1}}</span>
          </dd>
        </dl>
      </div>
      <div class="submit">
        <button @click="submit">交卷并查看结果</button>
      </div>
    </div>-->

    <!--loading-->
    <!--<Loading v-if="loading"/>-->
    <Tip v-if="loading"/>

  </div>
</template>

<script>
  import Header from "../common/Header";
  import Tip from "../common/Tip";
  import {request} from "../../api/common";
  import {times} from "../../api/time";
  import $ from "jquery";
  import sel from "@/api/select";

  export default {
    name: "Answer",
    components: {
      Header,
      Tip,
    },
    data() {
      return {
        title: "竞赛",
        href: -1,
        jumpState: true,
        alert: true,
        layerToggle: true, //true为默认答题状态
        totalPage: 0, //总页数
        page: 1, //当前页码
        user_id: "",
        user_name: "",
        integral: "",
        sessionId: "",
        examlist: [], //题目集合
        examName: "同济党建知识竞赛", //标题
        exampass: 0, //通过分数线
        loading: true, //加载动画
        result: false, //得分页状态
        message: "",
        endTime: "",
        startTime: "",
        state: false,
        clo: true,
        version: "",
        count: 0,
        statue: false,
        userInfo: {},
        msg_json: {},
        alertStatus: false,
        clear: false,
        sel:[],
      };
    },
    beforeRouteEnter(to, from, next) {
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

      var alerts = e => {
        if (!e.index) {
          location.reload();
          next();
          // this.$router.push('main');
          this.$router.go(-1);
        } else {
          next(false);
        }
      };
      if (to.path == "/main" && !this.alertStatus && !this.clear) {
        mui.confirm("是否退出", "", ["是", "否"], alerts, "div");
        next(false);
      }
      else if (this.clear) {
        next();
        // this.$router.go(-1);
        // // this.$router.push({path:'main'});
        location.reload();
      }
      else {
        next();
      }

      // next();
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
    },
    created: function () {
      this.sel = sel;
      var userInfo = sessionStorage.getItem('userInfo');
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
        this.user_id = this.userInfo.ID;
        this.user_name = this.userInfo.user_name;
        this.integral = this.userInfo.integral;
      }
      var self = this;
      // this.user_id = this.$route.query.user_id;
      // this.user_name = this.$route.query.user_name;
      // this.integral = this.$route.query.integral;
      // this.getAnswercnt();

      /*观众*/
      this.JoinRoomProcess();
    },


    mounted() {
      mui.back = function () {
        /*函数体*/
      };
    },
    methods: {
      setsSession() {
        if (!this.msg_json.disabled) {
          var singleExam = JSON.parse(localStorage.getItem(this.msg_json.random));
          if (singleExam) {
            for (var i = 0; i < singleExam.length; i++) {
              if (singleExam[i].ID == this.msg_json.ID) {
                break;
              }
            }
            if (i < singleExam.length) {
              singleExam[i] = this.msg_json;
            }
            else {
              singleExam.push(this.msg_json);
            }
            setTimeout(() => {
              localStorage.setItem([this.msg_json.random], JSON.stringify(singleExam));

            }, 200)
          }
          else {
            setTimeout(() => {
              localStorage.setItem([this.msg_json.random], JSON.stringify([this.msg_json]));
            }, 200)
          }
        }
      },
      //发送消息
      sendMsg(msg) {
        clientChat.SendJson(msg);
      },
      //加入聊天室
      JoinRoomProcess() {
        var self = this;
        console.log('user_id:'+this.user_id)
        clientChat.Chat(this.user_id, "125132355155885", this.receiveMessage, function () {
          console.log("加入成功回调,可以开始发送消息");
          self.sendMsg('get');
        });
      },
      //接收消息
      //IsSelfMsg 该消息是否为用户发出的
      receiveMessage(msg, IsSelfMsg) {
        if (IsSelfMsg) {
          //这里主要来检测发送出去的消息是否成功分发到聊天室内
          let msg_json = $.parseJSON(msg.content);
          console.log("1");
          console.log(msg_json);
        }
        else {
          let msg_json = $.parseJSON(msg.content);
          console.log("2");
          console.log(msg_json);

          // console.log(Object.assign(this.msg_json,msg_json))
          if (msg_json != 'clear') {
            if (!msg_json.ANSWER) {
              msg_json.ANSWER = '';
              console.log(msg_json.random)
              var list = JSON.parse(localStorage.getItem(msg_json.random));
              if (list) {
                for (var i = 0; i < list.length; i++) {
                  if(list[i].ID == msg_json.ID)break;
                }
                if (i < list.length) {
                  if (list[i].ANSWER) {
                    msg_json.ANSWER = list[i].ANSWER;
                  }
                  list[i] = msg_json;
                }
                else {
                  list.push(msg_json)
                }
                console.log(list)

                localStorage.setItem(msg_json.random, JSON.stringify(list));
              }
              else {
                console.log(msg_json)

                localStorage.setItem(msg_json.random, JSON.stringify([msg_json]));
              }
            }
            // if (!msg_json.ANSWER) {
            //   delete msg_json['ANSWER'];
            // }
            this.msg_json = Object.assign({}, this.msg_json, msg_json);
            console.log(this.msg_json)

            this.loading = false;

          }
          else if (msg_json == 'clear') {//TODO:退出页面提交答题
            this.clear = true;
            console.log(this.msg_json.random);
            var list = JSON.parse(localStorage.getItem(this.msg_json.random));

            console.log(list)
            console.log(this.userInfo.ID)
            console.log(this.userInfo.NAME)
            console.log(this.userInfo.SCENE_INTEGRAL)
            request.getServerData(
              {
                examinationPaperList: list,
                user_id: this.userInfo.ID,    //当前用户ID
                user_name: this.userInfo.NAME,     //当前用户名
                start_time: "2018-6-26 15:00:00",   //开始考试时间
                end_time: "2018-6-27 20:00:00",      //结束考试时间
                scene_player: this.userInfo.SCENE_INTEGRAL            //当前现场观众的积分

              },
              'onlineExamination.action.fieldAnswer[markingPapers]',
              true,
              result => {
                console.log(result);
                console.log(result.userInfo);
                localStorage.setItem('userInfo',JSON.stringify(result.userInfo));
                localStorage.removeItem(this.msg_json.random);
                this.$router.go(-1);
              }
            )
            //localStorage.removeItem(this.msg_json.random);
            //this.$router.go(-1);
          }
        }
        return false;
      },
      pushHistory() {
        var state = {
          title: "answer",
          url: ""
        };
        //window.history.pushState(state, "answer", "");
      },
      warning() {
        var self = this;
        mui.confirm('是否退出', '退出', ['是', '否'], self.alerts, 'div');
      },
      alerts(e) {
        this.count = 1;
        // !e.index && this.$router.go(-1);
        if (!e.index) {
          this.alertStatus = true;

          // this.$router.push('main');
          this.$router.go(-1);
          setTimeout(()=>{
            location.reload();
          },100)
          /*clientChat.LogOut(()=>{
            // this.$router.go(-1);
          });*/
        }

      },
      getAnswercnt() {
        var self = this;
        request.getServerData(
          {
            user_id: this.user_id
          },
          "onlineExamination.action.examinationAction[getAnswercnt]",
          true,
          result => {
            console.log(result);
            console.log(result.responsesnum.RESPONSESNUM);
            if (result.responsesnum.RESPONSESNUM == "1") {
              //今天次数用完了
              this.count = 1;
              mui.alert(
                "今日答题次数已用完明天再来",
                "",
                "返回",
                self.$router.go(-1),
                "div"
              );
            } else {
              this.getClassExamlist(this.user_id);
            }
          }
        );
      },
      /*getClassExamlist(user_id) {
        request.getServerData(
          {user_id: user_id},
          "onlineExamination.action.examinationAction[getExaminationPaper]",
          true,
          result => {
            alert(result);
            this.startTime = times();
            if (result.msg) {
              /!*次数用完*!/
              this.loading = false;
              this.message = result.msg;
            } else {
              if (result.multipleSelectionList.length) {
                result.multipleSelectionList.map(val => {
                  result.singleSelectionList.push(val);
                });
              }
              result.singleSelectionList.map(val => {
                val.startTime = this.startTime;
                val.QUESTIONS_TYPE == 0 ? (val.ANSWER = "") : (val.ANSWER = []);
                val.sign = false;
              });
              this.examlist = result.singleSelectionList;
              alert(this.examlist);
              this.totalPage = this.examlist.length;
              this.loading = false;
            }
          }
        );
      },*/
      common(data) {
        this.examlist = data;
        this.totalPage = data.length;
        // this.examName = data[0].answerList[0].category;

        this.loading = false;
        this.setSession(data);
        alert(data);
      },
      guide(e) {
        alert(e);
        this.layerToggle = !this.layerToggle;
        this.page = e + 1;
      },
      submit() {
        this.endTime = times();
        var self = this;
        alert(this.examlist);
        this.loading = true;
        this.examlist.map(val => {
          alert(val.QUESTIONS_TYPE);
          val.endTime = this.endTime;
          if (val.QUESTIONS_TYPE == 1) {
            //多选
            alert(val.ANSWER.length);
            if (val.ANSWER.length > 1) {
              val.ANSWER = Array.prototype.join.call(val.ANSWER, "|");
            } else if (val.ANSWER.length == 0) {
              val.ANSWER = "";
            } else {
              val.ANSWER = Array.prototype.join.call(val.ANSWER, "");
            }
          }
        });
        alert(this.examlist);
        alert(this.user_id);
        alert(this.user_name);
        alert(this.integral);
        // this.setSession(this.examlist)

        request.getServerData(
          {
            examinationPaperList: this.examlist,
            user_id: this.user_id,
            user_name: this.user_name,
            integral: this.integral,
            start_time: this.startTime,
            end_time: this.endTime
          },
          "onlineExamination.action.examinationAction[markingPapers]",
          true,
          result => {
            alert(result);
            if (result == "请求失败") {
              mui.alert("服务器出错", "", "返回", self.back, "div");
            } else {
              var res = JSON.stringify(result);
              this.$router.push({
                path: "answerResult",
                query: {res}
              });
            }
          }
        );
      },
      setSession(val) {
        localStorage.setItem([this.classid], JSON.stringify(val));
      },
      getSession(classid) {
        return JSON.parse(localStorage.getItem([classid]));
      },
      answerCardToggle() {
        this.layerToggle = !this.layerToggle;
        this.setSession(this.examlist);
      },
      close() {
        this.$router.go(-1);
      },
      back() {
        this.$router.go(-1);
      },
      signToggle() {
        alert(this.page);
        this.examlist[this.page - 1].sign = !this.examlist[this.page - 1].sign;
        this.setSession(this.examlist);
      },
      next() {
        if (this.page < this.totalPage) {
          this.page++;
          this.setSession(this.examlist);
        }
      },
      prev() {
        if (this.page > 1) {
          this.page--;
          this.setSession(this.examlist);
        }
      }
    }
  }
  ;
</script>

<style scoped lang="less">
  @import "../../variable";

  .container {
    width: @max;
    height: @max;
    padding-top: 88px;
    box-sizing: border-box;
  }

  .answer {
    padding-bottom: 152px;
    .action {
      padding: 0 24px;
      box-sizing: border-box;
      border-bottom: 1px solid @answer-col-c9; /*no*/
      .tip {
        flex-grow: 1;
        .base(@answer-col-62, @answer-col-62);
        line-height: 88px;
        span {
          .base(@theme, @answer-font-32);
        }
        span + span {
          .base(@answer-col-62, @answer-font-24);
        }
      }
      .action-btn {
        flex-grow: 1;
        justify-content: flex-end;
        a {
          width: 138px;
          height: 58px;
          border: 1px solid @answer-col-c9; /*no*/
          border-radius: 3px; /*no*/
          padding-left: 22px;
          margin-left: 10px;
          img {
            width: 26px;
            height: 33px;
            vertical-align: middle;
          }
          span {
            padding-left: 10px;
            vertical-align: middle;
            line-height: 58px;
            .base(@answer-col-62, @answer-font-20);
          }
        }
      }
    }

    .content {
      padding: 0 24px;
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
        padding-top: 46px;
        box-sizing: border-box;
        .title {
          .base(@answer-col-62, @answer-font-28);
          line-height: 56px;
          padding-bottom: 60px;
        }
        .single {
          .box {
            width: 100%;
            min-height: 69px;
            padding: 30px 0;
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
            padding-right: 100px;
            box-sizing: border-box;
          }
          label:active {
            background: #eee;
          }
          label:after {
            content: ""; /*必须设置*/
            display: inline-block;
            width: 70px;
            height: 70px;
            border: 1px solid @answer-col-c9; /*no*/
            position: absolute;
            top: 50%;
            margin-top: -35px;
            left: 15px;
            border-radius: 50%;
            box-sizing: border-box;
          }

          input:checked + label:after {
            /*background-color: @theme;*/
            background: url(../../assets/raido.png) no-repeat;
            background-size: cover;
          }

          input:disabled + label.pass {
            background: url(../../assets/dui.png) no-repeat right center;
            background-size: 70px;
          }
          input:disabled + label.no {
            background: url(../../assets/ca.png) no-repeat right center;
            background-size: 70px;
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
            padding-right: 100px;
            box-sizing: border-box;
          }
          label:active {
            background: #eee;
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
            border-color: #1f86ff;
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
    background-color: rgba(0, 0, 0, 0.4);
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
        content: "";
        clear: both;
        button {
          color: @white;
          font-size: 30px;
          background-color: @theme;
          height: 98px;
          line-height: 98px;
          border: 0;
          width: @max / 2;
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

  /*.modal {
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
          background-size: 100%;
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
        .btn {
          width: @max;
          height: 98px;
          button {
            color: @white;
            font-size: 30px;
            background-color: @theme;
            height: 98px;
            line-height: 98px;
            border: 0;
            width: @max;
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
        }
      }
    }*/
</style>
