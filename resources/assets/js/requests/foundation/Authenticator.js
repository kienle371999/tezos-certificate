import axios from 'axios'
import Vue from 'vue'

class Authenticator {
  constructor () {
    this._init()
  }

  _init () {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        this._user = JSON.parse(storedUser)
      } catch (e) {
        console.log('Invalid stored user: ' + storedUser)
        localStorage.removeItem('user')
        this._user = null
      }
    }

    return this
  }

  logIn (params) {
    return new Promise((resolve) => {
      axios.post(`${process.env.VUE_APP_SERVER_URL || ''}/api/user/login`, params)
        .then(response => {
          const user = response.data
          const userData = JSON.stringify(user)
          this._user = JSON.parse(userData)
          localStorage.setItem('user', userData)
          resolve(user)
        })
        .catch(err => {
          window.EventBus.$emit('ERROR', err.response.data.error)
        });
    });
  }

  logOut () {
    localStorage.removeItem('user')
    return { message: "Done" }
  }
}

const auth = new Authenticator()
Vue.prototype.$auth = auth
export default auth
