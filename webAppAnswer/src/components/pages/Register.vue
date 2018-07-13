<template>
  <div>
    <div class="reg">
      <Header
        :title="title"
        :href="href"
        :jumpState="jumpState"
      />
      <div class="reg-content">

        <div class="input-group">
          <div class="input-item">
            <label for="">姓名</label>
            <input type="text" placeholder="" v-model="name">
          </div>
          <div class="input-item">
            <label for="">手机号</label>
            <input type="text" placeholder="" v-model="mobile">
          </div>
          <div class="input-item">
            <label for="">学院</label>
            <select v-model="academy">
              <option :value="val.name" v-for="val in json">{{val.name}}</option>
            </select>
          </div>
          <div class="input-item">
            <label for="">密码</label>
            <input type="password" placeholder="" v-model="password">
          </div>

        </div>
        <div class="button-group">
          <button class="btn reg-btn" @click="reg">注册</button>
        </div>
      </div>
    </div>
    <Loading v-if="loading"/>
    <!--<Warning v-if="warning" :msg="message" @_close="closeWarning"/>-->
  </div>

</template>

<script>
  import Header from '../common/Header';
  import Loading from '../common/Loading';
  import json from '../../api/json';
  // import Warning from '../common/Warning';
  import {request} from '../../api/common';

  export default {
    name: 'reg',
    components: {
      Header,
      Loading,
      // Warning,
    },
    data() {
      return {
        title: '注册',
        href: -1,
        jumpState:false,
        json: [],
        academy: '',
        password: '',
        mobile: '',
        name: '',
        loading: false,
        warning: false,
        message: '',
        checkInfo:'',
      }
    },
    // beforeRouteEnter(to, from, next) {
    //   console.log(to)
    //   console.log(from)
    //   next(vm => {
    //     if (!vm.global.isLogin) {
    //       console.log(vm.$router)
    //       vm.$router.push({path: 'login'})
    //     }
    //     else {
    //       next();
    //
    //     }
    //   });
    //   // 在渲染该组件的对应路由被 confirm 前调用
    //   // 不！能！获取组件实例 `this`
    //   // 因为当守卫执行前，组件实例还没被创建
    // },
    created: function () {
      this.json = json;
      console.log(this.$route.query.state)
      // if(this.$route.query.state){
      //   this.checkInfo = '1';
      // }
      if(this.$route.query.state&&this.$route.query.state==1){
        this.checkInfo = '1';
      }
      else{
        this.checkInfo = '0';
      }
    },
    methods: {
      closeWarning(arg) {
        this.warning = arg;
      },
      reg() {
        this.mobile = this.mobile.replace(/(^\s*)|(\s*$)/g, '');
        this.password = this.password.replace(/(^\s*)|(\s*$)/g, '');
        this.name = this.name.replace(/(^\s*)|(\s*$)/g, '');
        if (!this.name) {
          // this.warning = true;
          mui.alert('用户名不能为空', '', '返回', null, 'div');
          // this.message = '用户名不能为空';
          return;
        }
        if (!this.mobile) {
          // this.warning = true;
          // this.message = '手机号不能为空';
          mui.alert('手机号不能为空', '', '返回', null, 'div');
          return;
        }
        if (!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(this.mobile))) {
          // this.warning = true;
          // this.message = '手机号不能为空';
          mui.alert('手机号格式不正确', '', '返回', null, 'div');
          return;
        }

        if (!this.academy) {
          // this.warning = true;
          // this.message = '学院不能为空';
          mui.alert('学院不能为空', '', '返回', null, 'div');
          return;
        }
        if (!this.password) {
          // this.warning = true;
          // this.message = '密码不能为空';
          mui.alert('密码不能为空', '', '返回', null, 'div');
          return;
        }
        this.postReg();
      },
      postLogin() {
        this.loading = true;
        console.log('checkInfo'+this.checkInfo)
        request.getServerData(
          {
            // mobile:"12345678910",
            // password:"111111",
            mobile: this.mobile,
            password: this.password,
            checkInfo:this.checkInfo
          },
          "onlineExamination.action.examinationAction[login]",
          true,
          (result) => {
            console.log(result)
            if (result.userInfo) {
              var userInfo = JSON.stringify(result.userInfo);
              mui.toast('登录成功', {duration: 'long', type: 'div'});


              sessionStorage.setItem("userInfo",userInfo);
              this.$router.push({
                path: 'main',
              });
            }
            else {
              mui.alert('账号密码有误', '', '返回', null, 'div');
              // this.warning = true;
              // this.message = '账号密码有误';
            }
            this.loading = false;
          });
      },
      postReg() {
        this.loading = true;
        request.getServerData(
          {
            // name:"李四",
            // mobile:"12345678910",
            // password:"111111",
            // academy:"医学院",
            name: this.name,
            mobile: this.mobile,
            password: this.password,
            academy: this.academy,
          },
          "onlineExamination.action.examinationAction[register]",
          true,
          (result) => {
            console.log(result)
            console.log(result.type)
            if (result.type == '001') {
              this.loading = false;
              mui.toast('注册成功',{ duration:'long', type:'div' });
              // this.$router.push({path: 'login'});
              //this.$router.go(-1);
              this.postLogin();
            }
            else if (result.type == '002') {
              this.loading = false;
              mui.alert('手机号已被注册', '', '返回', null, 'div');

            }
          });
      },
    }
  }

</script>

<style scoped lang="less">
  @import '../../variable';
  //function
  .group {
    width: @max;
    padding: 0 24px;
    box-sizing: border-box;
  }

  .form {
    width: @max;
    height: 88px;
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid #ebebeb;/*no*/
    padding: 0 20px;
    background-color:@white;
  }

  //style
  .reg {
    height: @max;
    .reg-content {
      height: @max;
      padding-top: 88px;
      box-sizing: border-box;
      .input-group {
        .group ();
        height: @max;
        padding-bottom: 154px;
        box-sizing: border-box;
        .input-item {
          width: @max;
          label {
            display: block;
            width: @max;
            height: 90px;
            line-height: 110px;
            font-size: 27px;
            color: #626262;
          }
          input {
            .form();
          }
          select {
            .form();
          }
        }
      }
      .button-group {
        .group();
        position: fixed;
        bottom: 0;
        height: 154px;
        z-index: 1000;
        background-color: @white;
        .btn {
          font-size: 29px;
        }
        .reg-btn {
          width: @max;
          height: 88px;
          line-height: 88px;
          background-color: @theme;
          color: @white;
          border: 0;
          border-radius: 5px; /*no*/
          margin-bottom: 29px;
        }
      }
    }
  }
</style>
