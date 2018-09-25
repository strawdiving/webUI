// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store/index'
import '../static/js/global.js'

Vue.config.productionTip = false;
Vue.use(ElementUI);

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     sessionStorage.removeItem('user')
//   }
//   console.log(sessionStorage.getItem('user'))
//
//   // let user
//   // if (sessionStorage.getItem('user') == undefined) {
//   //   user = null
//   // } else {
//   //   let user = JSON.parse(sessionStorage.getItem('user'))
//
//   // }
//   let user = JSON.parse(sessionStorage.getItem('user'))
//   if (!user && to.path !== '/login') {
//     next({path: '/login'})
//   } else {
//     next()
//   }
// })

Vue.directive('numberOnly', {
  bind: function (el) {
    el.handler = function () {
      el.value = el.value.replace(/[^\-?\d.]/g, '')
    };
    el.addEventListener('input', el.handler)
  },
  unbind: function (el) {
    el.removeEventListener('input', el.handler)
  }
});

/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  store,
  render: h => h(App),
  // template: '<App/>'
}).$mount('#app');
