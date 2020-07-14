import _ from 'lodash';
import axios from 'axios';
import auth from './Authenticator';

// Promised-based request
export default class BaseRequest {
  get (url, params) {
    return this._doSelfRequest('GET', url, { params });
  }

  delete (url, params = {}) {
    return this._doSelfRequest('delete', url, { params });
  }

  put (url, data = {}) {
    return this._doSelfRequest('put', url, { data });
  }

  post (url, data = {}) {
    return this._doSelfRequest('post', url, { data });
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
            window.EventBus.$emit('EVENT_COMMON_ERROR', 'Invalid response format: ' + response);
            return;
          }
          resolve(response.data);
        })
        .catch(err => {
          if (!err.response) {
            window.EventBus.$emit('EVENT_COMMON_ERROR', err);
            return;
          }
          if (!err.response.status) {
            window.EventBus.$emit('EVENT_COMMON_ERROR', err);
            return;
          }
          if (err.response.status === 401) {
            return auth.removeUser();
          }
          window.EventBus.$emit('EVENT_COMMON_ERROR', err);
        });
    });
  }

  _getAuthToken () {
    if (!auth._user) {
      return '';
    }

    return auth._user.token;
  }
}
