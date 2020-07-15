import Vue from 'vue'
import VueRouter from 'vue-router'
import LogIn from '@/components/roots/LogIn.vue'
import Home from '@/components/roots/Home'
import Account from '@/components/details/Account.vue'
import ForgotPassword from '@/components/roots/ForgotPassword.vue'
import Register from '@/components/roots/Register.vue'

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
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    component: ForgotPassword
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
