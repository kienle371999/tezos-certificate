import Vue from 'vue'
import VueRouter from 'vue-router'
import LogIn from '@/components/roots/LogIn.vue'
import Home from '@/components/roots/Home'
import Account from '@/components/details/Account.vue'

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
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
