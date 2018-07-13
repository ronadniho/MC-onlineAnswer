<template>
  <div class="warning">
    <div class="diag">
      <div class="message">{{message}}</div>
      <button @click="_close">关闭</button>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Warning',
    props: ['msg'],
    data() {
      return {
        message:this.msg
      }
    },
    created: function () {
    },
    methods: {
      _close(){
        this.$emit('_close',false)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../variable';

  .warning {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, .3);
    .diag {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -200px;
      margin-top: -200px;
      width: 400px;
      height: 400px;
      background-color: @white;
      div.message{
        color:@theme;
        text-align: center;
        height: 300px;
        line-height: 300px;
      }
      button {
        width: @max;
        height: 100px;
        background-color: @theme;
        border: 0;
        color: @white;
      }
    }
  }
</style>
