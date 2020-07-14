import _ from 'lodash';
import axios from 'axios';
import Vue from 'vue';

const LOGIN_URL = '/login';
const Utils = {

  qs: function (key) {
    key = key.replace(/[*+?^$.[]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    let match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
  }
};
class Authenticator {
  constructor () {
    this._init();
  }

  _init () {
    this._user = null;

    // If there's auth token in query string
    const authToken = Utils.qs('access_token');
    if (authToken && authToken.length > 0) {
      if (window.G_USER) {
        this._user = window.G_USER;
      } else {
        this._user = {
          token: authToken
        };

        this.refreshUser(authToken);
      }

      return this;
    }

    // Otherwise get stored user in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this._user = JSON.parse(storedUser);
      } catch (e) {
        console.log('Invalid stored user: ' + storedUser);
        localStorage.removeItem('user');
        this._user = null;
      }
    }

    return this;
  }

  login (credentials) {
    return new Promise((resolve) => {
      axios.post(`${process.env.VUE_APP_API_URL}/api/user/login`, credentials)
        .then(response => {
          const user = response.data;
          const userData = JSON.stringify(user);
          this._user = JSON.parse(userData);
          localStorage.setItem('user', userData);
          resolve(user);
        })
        .catch(err => {
          window.EventBus.$emit('EVENT_COMMON_ERROR', err);
        });
    });
  }

  logout () {
    const headers = {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + this._user.token
    };
    const config = _.assign({
      method: 'get',
      url: `${process.env.VUE_APP_API_URL}/api/user/logout`,
      headers
    });
    localStorage.removeItem('user');
    Utils.vueRedirect(LOGIN_URL);
    location.reload();
    axios(config)
      .then(() => {
      })
      .catch(err => {
        console.log(err);
      });
  }
  removeUser () {
    this._user = null;
    localStorage.removeItem('user');
    Utils.vueRedirect(LOGIN_URL);
    location.reload();
  }

  getUser () {
    if (!this._user) {
      Utils.vueRedirect(LOGIN_URL);
    }

    return this._user;
  }

  refreshUser (authToken) {
    const headers = {
      'x-auth-token': authToken || this._user.token,
      'accept': 'application/json'
    };
    const config = Object.assign({}, {
      headers,
      method: 'GET',
      url: `${process.env.VUE_APP_API_URL}/user/me`
    });
    axios(config)
      .then(res => {
        this._user = _.assign(this._user, res.body.data);
      })
      .catch(err => {
        window.EventBus.$emit('EVENT_COMMON_ERROR', err);
      });
  }
}

const auth = new Authenticator();
Vue.prototype.$auth = auth;
export default auth;
