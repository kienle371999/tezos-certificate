import Vue from 'vue'
import VueRouter from 'vue-router'
import LogIn from '@/components/LogIn.vue'
import Home from '@/components/Home'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
