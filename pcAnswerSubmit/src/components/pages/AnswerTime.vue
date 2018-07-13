<template>
  <section>
    <Header
      :title="title"
      :href="href"
      :jumpState="jumpState"
      :alert="alert"
      @child="warning"
    >
      <span class="time">{{time}}秒倒计时</span>
    </Header>
    <!--<Header-->
    <!--:title="title"-->
    <!--/>-->
    <div class="container flex">
      <aside>
        <img src="../../assets/code.png" alt="">
        <p>移动端答题</p>
      </aside>
      <div class="content" >
        <div v-for="(item,index) in singleSelectionList" v-if="index+1==page">
          <!--题目名-->
          <p class="title" @click="selected(item.REFERENCE_ANSWER)">{{item.QUESTIONS_CONTENT}}</p>

          <!--题目选项-->
          <div class="box-item single">

            <!-- item-->
            <div class="box" v-for="(child,idx) in item.option_content">
              <input type="radio"
                     :value="child"
                     :id="'radio'+item.ID+idx"
                     v-model="REFERENCE_ANSWER"
                     disabled
              />
              <label :for="'radio'+item.ID+idx">{{sel[idx]}}&nbsp;&nbsp;&nbsp;{{child}}</label>
            </div>

          </div>
        </div>


        <div class="btn flex">
          <button v-if="show" @click="next">下一题</button>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
  import Header from '@/components/common/Header';
  import $ from 'jquery';
  import {request} from '@/api/common';
  import sel from '@/api/select';
  export default {
    name: "AnswerTime",
    components: {
      Header,
    },
    data() {
      return {
        title: '同济党建知识竞赛',
        time: 120,
        show: true,
        href: -1,
        jumpState:true,
        alert: true,
        REFERENCE_ANSWER: '',
        page:1,
        singleSelectionList:[],
        random:'',
        clear:false,
        sel:[],
      }
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    beforeRouteLeave(to, from, next) {
      console.log(to.path);
      console.log(from.path);
      var alerts = e => {
        console.log(e);
        if (!e.index) {
          this.sendMsg('clear');
          next();

        } else {
          next(false);
        }
      };
      console.log(to.path == "/main")
      if (to.path == "/main"&&!this.clear) {
        //mui.confirm("是否退出", "", ["是", "否"], alerts, "div");
        //next(false);

        this.shifts();
        this.sendMsg('clear');
        location.reload();
        next();
      } else {
        next();
      }

      // next();
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
    },
    created:function(){
      this.sel = sel;
      this.random = this.randomString(32);
      if(localStorage.getItem('singleSelectionList')){
        this.singleSelectionList = JSON.parse(localStorage.getItem('singleSelectionList'));
        console.log(this.singleSelectionList)
      }
      else {
        request.getServerData(
          {},
          "onlineExamination.action.fieldAnswer[getExaminationPaper]",
          true,
          (result) => {
            console.log(result)
            if (result) {
              if (result.singleSelectionList && result.singleSelectionList.length) {
                result.singleSelectionList.map(val => {
                  val.disabled = false;
                  // console.log(val)
                  // for(var i=0;i<val.option_content.length;i++){
                  //   console.log(val.option_content[i])
                  //   val.option_content[i] = `${sel[i]}${val.option_content[i]}`;
                  // }
                });
                this.singleSelectionList = result.singleSelectionList;

                localStorage.setItem('singleSelectionList', JSON.stringify(this.singleSelectionList));
              }
            }
          }
        )
      }
      this.JoinRoomProcess();
    },
    mounted: function () {

      var timer = setInterval(() => {
        if (this.time >= 1) {
          this.time--;
        }
        else {
          this.show = false;
          clearInterval(timer);
        }
      }, 1000);
      var _contentHei = parseFloat($('.content').css('height').replace(/px/, ''));
      var _btnHei = parseFloat($('.btn').css('height').replace(/px/, ''));
      setTimeout(()=>{
        var _titleHei = parseFloat($('.title').css('height').replace(/px/, ''));
        $('.single').css('height', (_contentHei - _btnHei - _titleHei) * 0.01 + 'rem');
      },1100);


    },
    methods: {
      shifts() {
        var del = JSON.parse(localStorage.getItem('singleSelectionList'));
        del.shift();
        localStorage.setItem('singleSelectionList', JSON.stringify(del));
      },
      warning() {
        //var self = this;
        // this.$router.go(-1);
        //mui.confirm('是否退出', '退出', ['是', '否'], self.alerts, 'div');

        this.shifts();
        this.clear = true;
        this.sendMsg('clear');
        this.$router.push({path: 'main'});
        setTimeout(() => {
          location.reload();
        }, 100)
      },
      alerts(e) {
        this.count = 1;
        // !e.index && this.$router.go(-1);
        if(!e.index){
          this.clear = true;
          this.sendMsg('clear');
          this.$router.push({path:'main'});
          location.reload();
        }
      },
      randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      //发送消息
      sendMsg(msg) {
        clientChat.SendJson(msg);
      },
      //加入聊天室
      JoinRoomProcess() {
        var self = this;
        clientChat.Chat("openfireadmin0001", "125132355155885", this.receiveMessage, function () {
          console.log("加入成功回调,可以开始发送消息");
          self.singleSelectionList[0].random = self.random;
          self.sendMsg(self.singleSelectionList[0]);
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
          if (msg_json == 'get') {
            this.singleSelectionList[0].random = this.random;
            this.sendMsg(this.singleSelectionList[0])
          }
        }
        return false;
      },
      selected(arg) {
        console.log(arg)
        this.REFERENCE_ANSWER = arg;
        console.log(this.singleSelectionList[0]);
        this.singleSelectionList[0].disabled = true;
        this.singleSelectionList[0].random = this.random;
        this.sendMsg(this.singleSelectionList[0])
      },
      next(){
        if(this.REFERENCE_ANSWER){
          this.singleSelectionList.shift();
          localStorage.setItem('singleSelectionList',JSON.stringify(this.singleSelectionList));
          this.REFERENCE_ANSWER = '';
          this.singleSelectionList[0].random = this.random;
          this.sendMsg(this.singleSelectionList[0]);
        }
      },
    }
  }
</script>

<style scoped lang="less">
  @import '../../variable.less';

  section {
    width: @max;
    height: @max;
    position: relative;
    padding-top: 1.2rem;
    box-sizing: border-box;
    .container {
      width: @max;
      height: @max;
      padding: .66rem 0 .74rem;
      box-sizing: border-box;
      aside {
        width: 4.61rem;
        border-right: 1px dashed #626262;
        flex-grow: 1;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        img {
          width: 2.72rem;
          height: 2.72rem;
        }
        p {
          padding-top: .54rem;
          color: #636363;
          font-size: .24rem;
        }
      }
      .content {
        position: relative;
        flex-grow: 2;
        width: 14.56rem;
        margin: 0 .65rem 0;
        box-sizing: border-box;
        p.title {
          color: #636363;
          /*font-size: .31rem;*/
          font-size: .4rem;
          line-height: .57rem;
          margin-bottom: .85rem;
          box-sizing: border-box;

        }

        .single {
          /*min-height: 3.6rem;*/
          overflow-y: auto;
          .box {
            width: @max;
            min-height: .69rem;
            padding: .15rem 0;
          }

          input {
            display: none;
          }

          label {
            width: @max;
            height: @max;
            display: inline-block;
            position: relative;
            line-height: .69rem;
            .base(@answer-col-62, .4rem);
            padding-left: 1rem;
            box-sizing: border-box;
          }
          label:active {
            background: #EEEEEE;
          }
          label:after {
            content: ""; /*必须设置*/
            display: inline-block;
            width: .7rem;
            height: .7rem;
            border: 1px solid @answer-col-c9; /*no*/
            position: absolute;
            top: 0;
            left: .15rem;
            border-radius: 50%;
            box-sizing: border-box;
          }

          input:checked + label:after {
            background: url(../../assets/raido.png) no-repeat;
            background-size: 100%;
          }
        }

        div.btn {
          position: absolute;
          bottom: 0;
          width: @max;
          height: .88rem;
          button {
            color: @white;
            font-size: .3rem;
            background-color: @theme;
            border-radius: .04rem;
            border: 0;
            width: 2.6rem;
            height: @max;
            position: absolute;
            right: 0;
          }
        }
      }
    }
  }

  div {
    font-size: .31rem;
  }
</style>
