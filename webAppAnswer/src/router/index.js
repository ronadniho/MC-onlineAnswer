import Vue from 'vue'
import Router from 'vue-router'
// import Main from '@/components/pages/Main'
// import Login from '@/components/pages/Login'
// import Register from '@/components/pages/Register'
// import ReadAnswer from '@/components/pages/ReadAnswer'
// import AnswerList from '@/components/pages/AnswerList'
// import AnswerResult from '@/components/pages/AnswerResult'
//import Answer from '@/components/pages/Answer'
const Login = r => require.ensure([], () => r(require('@/components/pages/Login')), 'Login')
const Main = r => require.ensure([], () => r(require('@/components/pages/Main')), 'Main')
const Register = r => require.ensure([], () => r(require('@/components/pages/Register')), 'Register')
const ReadAnswer = r => require.ensure([], () => r(require('@/components/pages/ReadAnswer')), 'ReadAnswer')
const AnswerList = r => require.ensure([], () => r(require('@/components/pages/AnswerList')), 'AnswerList')
const Answer = r => require.ensure([], () => r(require('@/components/pages/Answer')), 'Answer')
Vue.use(Router)
/*
* routes: [
    {
      path: '/',
      redirect: '/login'   //重定向
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {allowBack: false}
    },
    {
      path: '/readAnswer',
      name: 'ReadAnswer',
      component: ReadAnswer,
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      meta: {allowBack: false}
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {allowBack: false}
    },
    {
      path: '/answerList',
      name: 'AnswerList',
      component: AnswerList
    },
    {
      path: '/answer',
      name: 'Answer',
      component: Answer,
      meta: {allowBack: false},
      props: true
    },
    {
      path: '/answerResult',
      name: 'AnswerResult',
      component: AnswerResult,
      props: true
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
* */
export const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'   //重定向
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {allowBack: false}
    },
    {
      path: '/readAnswer',
      name: 'ReadAnswer',
      component: ReadAnswer,
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      meta: {allowBack: false}
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {allowBack: false}
    },
    {
      path: '/answerList',
      name: 'AnswerList',
      component: AnswerList
    },
    {
      path: '/answer',
      name: 'Answer',
      component: Answer,
      meta: {allowBack: false},
      props: true
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  //mode:'history'
});

/*// 全局路由守卫
router.beforeEach((to, from, next) => {


  /!*console.log('navigation-guards');
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

  const nextRoute = ['Register','Login', 'Main', 'Answer', 'ReadAnswer'];
  // console.log(sessionStorage.getItem('loginState'))
  // isLogin = isLogin?parseInt(isLogin):isLogin;
  console.log(isLogin)
  console.log('to.name:'+to.name)
  console.log('from.name:'+from.name)
  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  if (nextRoute.indexOf(to.name) >= 0&&to.name!='Login') {
    if (!isLogin) {
      console.log('what fuck');
      console.log(router)
      router.push({ name: 'Login' })
    }
  }
  // 已登录状态；当路由到login时，跳转至home
  if (to.name === 'Login') {
    if (isLogin) {
      router.push({ name: 'Main' });
    }
  }
  next();*!/
});*/
