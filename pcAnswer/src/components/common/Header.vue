<template>
  <header>
    <div>
      <p class="flex">
        <span v-if="HEADERSTATE=='no'"></span>
        <span v-if="HEADERSTATE!=='no'">
          <a @click="go" v-if="!JUMPSTATE"></a>
      <a @click="alerts" v-else-if="JUMPSTATE&&ALERT"></a>
        </span>
        <!--<a @click="jump" v-else></a>-->
        <b>{{title}}</b>
      </p>
      <!--<p class="flex" v-if="title!='登录'">-->
      <!--<a @click="go" v-if="!JUMPSTATE"></a>-->
      <!--<a @click="alerts" v-else-if="JUMPSTATE&&ALERT"></a>-->
      <!--<a @click="jump" v-else></a>-->
      <!--<span>{{title}}</span>-->
      <!--</p>-->

      <p>
        <slot name="defaults"></slot>
        <slot name="time">

        </slot>
      </p>
    </div>
  </header>
</template>

<script>

  export default {
    name: 'Header',
    props: ['title', 'href', 'jumpState', 'alert', 'headerState'],
    data() {
      return {
        HREF: this.href,
        ALERT: this.alert,
        JUMPSTATE: this.jumpState,
        HEADERSTATE: this.headerState,
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
    background: url(../../assets/header-bg.jpg) no-repeat;
    background-size: cover;
    height: 1.2rem;
    display: flex;
    align-items: center;
    z-index: 1000;
    padding: 0 .48rem;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    width: @max;
    div {
      width: @max;
      display: flex;
      align-items: center;
      position: relative;
      box-sizing: border-box;
      p {
        flex-grow: 1;
      }
      p:first-child {
        align-items: center;
        a {
          display: inline-block;
          width: .22rem;
          height: .38rem;
          background: url(../../assets/back.png) no-repeat center center;
          background-size: .22rem .38rem;
          vertical-align: middle;
        }
        b {
          padding-left: .59rem;
          .base(@white, @Header-font-28);
          vertical-align: middle;
          font-size: .4rem;
        }
      }
      p:last-child {
        text-align: right;
        span {
          padding-left: .7rem;
          font-size: .4rem;
          color: @white;
        }
        span.time {
          background: url(../../assets/time.png) no-repeat .14rem center;
          background-size: .42rem;

        }
      }
    }
  }

</style>
