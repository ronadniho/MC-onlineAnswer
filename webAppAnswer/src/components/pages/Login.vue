<template>
  <div class="login">
    <div class="login">
      <Header
        :title="title"
      />
      <div class="login-content">
        <!--logo-->
        <div class="logo">
          <img src="../../assets/logo.png" alt="">
        </div>
        <div class="input-group">
          <input type="text" placeholder="请输入账号" v-model="mobile">
          <input type="password" placeholder="请输入密码" v-model="password">
        </div>
        <div class="button-group">
          <button class="btn login-btn" @click="login">登录</button>
          <button class="btn register-btn" @click="toLink">注册</button>
        </div>
      </div>
    </div>
    <Loading v-if="loading"/>
    <!--<Warning v-if="warning" :msg="message" @_close="closeWarning" />-->
  </div>
</template>

<script>
  import Header from '../common/Header';
  import Loading from '../common/Loading';
  // import Warning from '../common/Warning';
  import {request} from '../../api/common';

  export default {
    name: 'Login',
    components: {
      Header,
      Loading,
      // Warning,
    },
    data() {
      return {
        title: '登录',
        href: '/',
        mobile: '',
        password: '',
        loading: false,
        warning: false,
        message: '',
        checkInfo:'0',
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(to);
      console.log(from);
      var userInfo = sessionStorage.getItem("userInfo");
      next(vm => {
        if (!userInfo) {
          console.log(vm.$router);
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

      next();

      // next();
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
    },
    created:function(){
      console.log('state:'+this.$route.query.state)
      if(this.$route.query.state&&this.$route.query.state==1){
        this.checkInfo = '1';
      }
      else{
        this.checkInfo = '0';
      }
    },
    mounted: function () {
      var userInfo = sessionStorage.getItem("userInfo");
      if(userInfo){
        this.$router.push({
          path:'main'
        })
      }
    },
    methods: {
      toLink() {
        console.log(this.checkInfo)
        this.$router.push({path: 'register',query:{state:this.checkInfo}});
      },
      login() {
        this.mobile = this.mobile.replace(/(^\s*)|(\s*$)/g, '');
        this.password = this.password.replace(/(^\s*)|(\s*$)/g, '');
        console.log(this.mobile, this.password)
        if (!this.mobile) {
          mui.alert('手机号不能为空', '', '返回', null, 'div');
          // this.warning = true;
          // this.message = '手机号不能为空';
          return;
        }
        if (!this.password) {
          mui.alert('密码不能为空', '', '返回', null, 'div');
          // this.warning = true;
          // this.message = '密码不能为空';
          return;
        }
        this.postLogin();
      },
      closeWarning(arg) {
        this.warning = arg;
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
      }
    }
  }

</script>

<style scoped lang="less">
  @import '../../variable';
  //function
  .group {
    width: @max;
    padding: 0 75px;
    box-sizing: border-box;
    text-align: center;
  }

  .bg(@src,@sizeA,@sizeB) {
    background: url(@src) 12px center no-repeat;
    background-size: @sizeA @sizeB;
  }

  //style
  .login {
    height: @max;
    .login-content {
      height: @max;
      padding-top: 88px;
      box-sizing: border-box;
      background: url(../../assets/bg.png) 88px 100%;
      background-size: 100%;
      .logo {
        padding-top: 80px;
        padding-bottom: 124px;
        text-align: center;
        box-sizing: border-box;

        img {
          width: 671px;
          height: 371px;
        }
      }
      .input-group {
        .group();
        /*padding-bottom: 171px;*/
        input {
          width: @max;
          height: 88px;
          line-height: 88px;
          border: 2px solid @theme;
          border-radius: 5px; /*no*/
          box-sizing: border-box;
          padding: 0 64px;
          margin-bottom: 24px;
          .bg('../../assets/user.png', 36px, 40px);
        }
        input:last-child {
          .bg('../../assets/pwd.png', 36px, 40px);
        }
      }
      .button-group {
        /*position: absolute;*/
        /*bottom: 40px;*/
        .group();
        .btn {
          font-size: 29px;
        }
        .login-btn {
          width: @max;
          height: 88px;
          line-height: 88px;
          background-color: @theme;
          color: @white;
          border: 0;
          border-radius: 5px; /*no*/
          margin-bottom: 29px;
        }
        .register-btn {
          color: @theme;
          width: 64px;
          height: 67px;
          line-height: 67px;
          border: 0;
          border-bottom: 3px solid @theme;
          box-sizing: border-box;
          background-color: transparent;
          padding: 0;

        }
      }
    }
  }
</style>
