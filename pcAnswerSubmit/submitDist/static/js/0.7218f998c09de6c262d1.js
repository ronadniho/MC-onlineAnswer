webpackJsonp([0],{"+pcn":function(e,t){},ICXI:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("GgDs"),a=n("t5DY"),r={name:"Submit",components:{Header:i.a},data:function(){return{href:-1,title:"提交分数",input:"",list:[]}},created:function(){var e=this;a.a.getServerData({},"onlineExamination.action.fieldAnswer[getPlayerRankingList]",!0,function(t){if(console.log(t),t&&t.playerrankingList&&t.playerrankingList.length){var n=[];t.playerrankingList.map(function(e){console.log(e),n.push({NAME:e.NAME,user_id:e.ID,scene_player:""})}),e.list=n}})},methods:{submit:function(e){console.log(e),a.a.getServerData(e,"onlineExamination.action.fieldAnswer[updScenePlayerIntegral]",!0,function(t){console.log(t),mui.toast(t,{duration:"long",type:"div"}),e.scene_player=""})}}},o={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",[n("Header",{attrs:{title:e.title,href:e.href}}),e._v(" "),n("div",{staticClass:"container"},[e.list.length?e._e():n("div",[e._v("\n      暂无参赛选手！！！\n    ")]),e._v(" "),e._l(e.list,function(t){return n("div",{staticClass:"form-group flex"},[n("label",[e._v(e._s(t.NAME)+"：")]),e._v(" "),n("div",[n("input",{directives:[{name:"model",rawName:"v-model",value:t.scene_player,expression:"item.scene_player"}],attrs:{type:"text",placeholder:"输入积分"},domProps:{value:t.scene_player},on:{input:function(n){n.target.composing||e.$set(t,"scene_player",n.target.value)}}}),e._v(" "),n("button",{on:{click:function(n){e.submit(t)}}},[e._v("提交")])])])})],2)],1)},staticRenderFns:[]};var l=n("VU/8")(r,o,!1,function(e){n("+pcn")},"data-v-f1081e5c",null);t.default=l.exports}});
//# sourceMappingURL=0.7218f998c09de6c262d1.js.map