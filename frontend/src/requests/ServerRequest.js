import BaseRequest from './foundation/BaseRequest'

class ServerRequest extends BaseRequest {
    getURL(url) {
        const baseUrl = process.env.VUE_APP_SERVER_URL
        return baseUrl.concat(url)
    }
    async registerUser(params) {
        const url = this.getURL('/api/user/register-user')
        return this.post(url, params)
    }
}

const instance = new ServerRequest()
export default instance