import Vue from 'vue'
import VueRouter from 'vue-router'
import LogIn from '@/components/roots/LogIn.vue'
import Home from '@/components/roots/Home'
import Account from '@/components/details/Account.vue'
import ForgotPassword from '@/components/roots/ForgotPassword.vue'
import Register from '@/components/roots/Register.vue'
import Information from '@/components/details/Information.vue'
import Transaction from '@/components/details/Transaction.vue'
import Certificate from '@/components/details/Certificate.vue'


Vue.use(VueRouter)
const storedUser = localStorage.getItem('user')
const isAuthenticated = storedUser ? true : false
const authentication = ((to, from, next) => {
  if (to.name !== 'LogIn' && !isAuthenticated) next({ name: 'LogIn' })
  else next({ replace: true })
})

  const routes = [
  {
    path: '/',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: authentication
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter: authentication
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
  },
  {
    path: '/information',
    name: 'Information',
    component: Information,
    beforeEnter: authentication
  },
  {
    path: '/transaction',
    name: 'Transaction',
    component: Transaction,
    beforeEnter: authentication
  },
  {
    path: '/certificate',
    name: 'Certificate',
    component: Certificate,
    beforeEnter: authentication
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
