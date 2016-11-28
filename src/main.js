import Vue from 'vue'
import Router from 'vue-router'
import Paco from 'paco-ui-vue';

import App from './view/app.vue'


Vue.use(Router)
Vue.use(Paco)

window.vm=new Vue()

Vue.config.debug = true
// edit.vue

const router = new Router({
  // mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: App, name: 'app'}
  ]
})
router.beforeEach((to, from, next) => {
  next()
})
const app = new Vue({
    router,
}).$mount('#app')





