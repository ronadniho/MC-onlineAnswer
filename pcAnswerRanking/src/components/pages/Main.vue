<template>
  <section>
    <div class="btn-group">
      <button @click="location('answer')">普通答题</button>
      <button @click="location('answerTime')">竞赛答题</button>
      <button @click="location('audRanking')">观众排行榜</button>
      <button @click="location('ranking')">参赛排行榜</button>
      <button @click="location('submit')">提交分数</button>
    </div>

  </section>
</template>

<script>
  import Header from "@/components/common/Header";
  import {request} from '@/api/common';

  export default {
    name: "Main",
    components: {
      Header
    },
    data() {
      return {
        singleSelectionList: [],

      };
    },
    created: function () {
      if (localStorage.getItem('singleSelectionList')) {
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
                result.singleSelectionList.map(val => val.disabled = false);
                this.singleSelectionList = result.singleSelectionList;

                localStorage.setItem('singleSelectionList', JSON.stringify(this.singleSelectionList));
              }
            }
          }
        )
      }
    },
    methods: {
      location(arg) {
        console.log(arg)
        switch (arg) {
          case "answer":
            this.$router.push({
              path: "answer"
            });
            break;

          case "answerTime":
            this.$router.push({
              path: "answerTime"
            });
            break;

          case "ranking":
            this.$router.push({
              path: "ranking"
            });
            break;

          case "audRanking":
            this.$router.push({
              path: "audienceRanking"
            });
            break;

          case "submit":
            this.$router.push({
              path: "submit"
            });
            break;
        }
      }
    }
  };
</script>

<style scoped lang="less">
  @import '../../variable';

  section {
    width: @max;
    height: @max;
    background: url(../../assets/main2.png) no-repeat 100% 100%;
    background-size: cover;
    .btn-group{
      position: fixed;
      bottom: 0;
      width: @max;
      height: 40px;
      display: flex;
      align-items:center;
      flex-flow: row nowrap;
      button{
        flex-grow:1;
        text-align: center;
        background-color:#f51416;
        color:@white;
      }

    }
  }
</style>
