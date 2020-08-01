import BaseRequest from './foundation/BaseRequest'

class BlockchainRequest extends BaseRequest {
    getURL(url) {
        const baseUrl = process.env.VUE_APP_BLOCKCHAIN_URL
        return baseUrl.concat(url)
    }
    async generateKey() {
        const url = this.getURL('/api/init-account')
        return this.get(url)
    }
    async signCertificate(params) {
        const url = this.getURL('/api/sign-data')
        return this.post(url, params)
    }
    
    async broadcastCertificate(params) {
        const url = this.getURL('/api/broadcast-certificate')
        return this.post(url, params)
    }
}

const instance = new BlockchainRequest()
export default instance