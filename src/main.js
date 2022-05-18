import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VCharts)

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
