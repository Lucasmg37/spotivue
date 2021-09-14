import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import routes from './routes/routes.js'
import store from './store'

Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  routes, mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

