import Vue from 'vue'
import VueRouter from 'vue-router'
import DailyRecord from './pages/DailyRecord'
import addRecord from './pages/addRecord'
Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/daily_record',
    component: DailyRecord,
    children: []
  },
  {
    path: '/record/:page',
    component: addRecord,
    props: true
  },
]

const router = new VueRouter({
  routes
})

export default router