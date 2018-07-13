<template>

</template>

<script>
  export default {
    name: "test",
    created: function () {
      this.JoinRoomProcess();
    },
    mounted() {

    },
    methods: {
      //发送消息
      sendMsg(msg) {
        window.clientChat.SendJson(msg);
      },
      //加入聊天室
      JoinRoomProcess() {
        var self = this;
        window.clientChat.Chat("63ed351bc5b947b78162eeb4a49ddab3", "125132355155885", function receiveMessage(msg, IsSelfMsg) {
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
            this.msg_json = msg_json;
            this.loading = false;
          }
          return false;
        }, function () {
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
          this.msg_json = msg_json;
          this.loading = false;
        }
        return false;
      },
    }
  }
</script>

<style scoped>

</style>
