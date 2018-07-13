<template>
  <header>
    <div>
      <p v-if="title!='登录'">
        <a @click="go" v-if="!JUMPSTATE"></a>
        <a @click="alerts" v-else-if="JUMPSTATE&&ALERT"></a>
        <a @click="jump" v-else></a>
      </p>
      <span>{{title}}</span>
    </div>
  </header>
</template>

<script>

  export default {
    name: 'Header',
    props: ['title', 'href', 'jumpState', 'alert'],
    data() {
      return {
        HREF: this.href,
        ALERT: this.alert,
        JUMPSTATE: this.jumpState,
      }
    },
    created: function () {
    },
    methods: {
      go() {
        console.log(this.HREF)
        this.$router.go(this.HREF);
      },
      jump() {
        this.$router.push({path: this.HREF});
      },
      alerts() {
        this.$emit('child');
      },
      // clo() {
      //   if (this.android) {
      //     this.$emit('warning', 'android');
      //   }
      //   else if (this.ios) {
      //     this.$emit('warning', 'ios');
      //   }
      // },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../variable';

  header {
    background-color: @theme;
    height: 88px;
    display: flex;
    align-items: center;
    z-index: 1000;
    padding: 0 15px;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    width: @max;
    div {
      width: @max;
      display: flex;
      align-items: center;
      justify-content: center;
      .base(@white, @Header-font-28);
      text-align: center;
      position: relative;
      box-sizing: border-box;
      a {
        display: inline-block;
        width: 26px;
        height: 42px;
        background: url(../../assets/back.png) no-repeat center center;
        background-size: 26px 42px;
        vertical-align: middle;
        position: absolute;
        left: 0;
        top: 50%;
        padding-right: 40px; /*no*/
        margin-top: -21px;
      }
      span {
        display: block;
        vertical-align: middle;
        padding-left: 40px;
        font-size: 34px;
      }
    }
  }

</style>
