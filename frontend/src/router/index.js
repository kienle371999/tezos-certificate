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
import Authentication from '@/components/details/Authentication.vue'


Vue.use(VueRouter)
const storedUser = localStorage.getItem('user')
const isAuthenticated = storedUser ? true : false

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
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      requiresAuth: true
    }
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
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/transaction',
    name: 'Transaction',
    component: Transaction,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/certificate',
    name: 'Certificate',
    component: Certificate,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/authentication',
    name: 'Authentication',
    component: Authentication
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (isAuthenticated) {
      next()
    } else {
      next({ name: 'LogIn' })
    }
  }
  next()
})

export default router
