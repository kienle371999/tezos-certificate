import _ from 'lodash';
import axios from 'axios';
import auth from './Authenticator';

// Promised-based request
export default class BaseRequest {
  get (url, params) {
    return this._doSelfRequest('GET', url, { params });
  }

  delete (url, params = {}) {
    return this._doSelfRequest('DELETE', url, { params });
  }

  put (url, data = {}) {
    return this._doSelfRequest('PUT', url, { data });
  }

  post (url, data = {}) {
    return this._doSelfRequest('POST', url, { data });
  }

  _doSelfRequest (method, url, paramsConfig) {
    return this._doRequest(method, url, paramsConfig);
  }

  _doRequest (method, url, paramsConfig) {
    const headers = {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + this._getAuthToken()
    };

    const config = _.assign({
      method,
      url,
      headers
    }, paramsConfig);
    return new Promise((resolve) => {
      axios(config)
        .then(response => {
          if (!response.data) {
            window.EventBus.$emit('ERROR', 'Invalid response format: ' + response);
            return;
          }
          resolve(response.data);
        })
        .catch(err => {
          if (err.response.status === 401) {
            return auth.removeUser()
          }
          window.EventBus.$emit('ERROR', err.response.data.error)
        });
    });
  }

  _getAuthToken () {
    if (!auth._user) {
      return ''
    }

    return auth._user.token
  }
}
