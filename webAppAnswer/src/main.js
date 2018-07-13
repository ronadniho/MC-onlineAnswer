// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import 'lib-flexible'

import Mui from 'vue-awesome-mui';
import VueScroller from 'vue-scroller'

Vue.config.productionTip = false;
// Vue.prototype.ajax = function (data, type) {
//   _ActionJS.exitCurrentPage();
// };
Vue.prototype.global = {
  isLogin:false,
  allowBack:false,
};
Vue.use(Mui);
Vue.use(VueScroller);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
mui.init({
  keyEventBind: {
    backbutton: true  //关闭back按键监听
  }
});
/* history.replaceState({},null,'');
window.addEventListener("popstate", function (e) {
  console.log("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
  console.log('state:');
  console.log(e);
  console.log('hist state:');
  console.log(history.state);
}, false); */

