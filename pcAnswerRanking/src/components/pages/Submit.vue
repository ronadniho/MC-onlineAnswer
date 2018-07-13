<template>
  <section>
    <Header
      :title="title"
      :href="href"
    />
    <div class="container">
      <div v-if="!list.length">
        暂无参赛选手！！！
      </div>
      <div class="form-group flex" v-for="item in list">
        <label>{{item.NAME}}：</label>
        <div>
          <input type="text" placeholder="输入积分" v-model="item.scene_player">
          <button @click="submit(item)">提交</button>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
  import Header from '@/components/common/Header';
  import {request} from "../../api/common";

  export default {
    name: "Submit",
    components: {
      Header,
    },
    data() {
      return {
        href: -1,
        title: '提交分数',
        input: '',
        list: [],
      }
    },
    created: function () {
      request.getServerData(
        {},
        'onlineExamination.action.fieldAnswer[getPlayerRankingList]',
        true,
        result => {
          console.log(result);
          if (result) {
            if (result.playerrankingList && result.playerrankingList.length) {
              var list = [];
              result.playerrankingList.map(val => {
                console.log(val)
                list.push({
                  NAME: val.NAME,
                  user_id: val.ID,
                  scene_player: ''
                });
              });
              this.list = list;
            }
          }
        }
      )
    },
    methods: {
      submit(val) {
        console.log(val);
        request.getServerData(
          val,
          "onlineExamination.action.fieldAnswer[updScenePlayerIntegral]",
          true,
          result=>{
            console.log(result);
            mui.toast(result, {duration: 'long', type: 'div'});
            val.scene_player = '';
          }
        )
      },
    }
  }
</script>

<style scoped lang="less">
  @import '../../variable.less';

  section {
    width: @max;
    height: @max;
    padding-top: 1.2rem;
    box-sizing: border-box;
    .container {
      width: @max;
      height: @max;
      padding: .31rem;
      box-sizing: border-box;
      .form-group {
        font-size: .3rem;
        padding: .21rem 0;
        box-sizing: border-box;
        align-items: center;
        label{
          flex-grow: 1;
          width: 20px;
        }
        div{
          flex-grow: 2;
          input {
            padding: 0 .51rem;
            box-sizing: border-box;
            border: 1px solid #626262;
            border-radius: .06rem;
            width: 70%;
            height: .8rem;
            line-height: .8rem;
          }
          button {
            background-color: @theme;
            color: @white;
            width: 1.95rem;
            height: .8rem;
            line-height: .8rem;
            border: 0;
            border-radius: .6rem;
          }
        }

      }
    }
  }
</style>
