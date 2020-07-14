import BaseRequest from './foundation/BaseRequest'

class BlockchainRequest extends BaseRequest {
    getURL(url) {
        const baseUrl = process.env.VUE_APP_BLOCKCHAIN_URL
        return baseUrl.concat(url)
    }
    async generateKey() {
        let url = this.getURL('/api/init-account')
        return this.get(url)
    }
}

const instance = new BlockchainRequest()
export default instance