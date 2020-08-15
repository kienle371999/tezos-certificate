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
    async generateCertificate(params) {
        const url = this.getURL('/api/user/generate-information')
        return this.post(url, params)
    }
    async getCertificate() {
        const url = this.getURL('/api/user/get-information')
        return this.get(url)
    }

    async getCertificateToString(params) {
        const url = this.getURL('/api/user/get-certificate-string')
        return this.get(url, params)
    }
    async createSignature(params) {
        const url = this.getURL('/api/user/create-signature')
        return this.post(url, params)
    }

    async storeHash(params) {
        const url = this.getURL('/api/user/store-hash')
        return this.post(url, params)
    }

    async initCertificate(params) {
        const url = this.getURL('/api/init-certificate-data')
        return this.post(url, params)
    }

    async createCertificatePDF() {
        const url = this.getURL('/api/create-certificate-pdf')
        return this.post(url)
    }

    async stopCertificatePDF() {
        const url = this.getURL('/api/stop-certificate-pdf')
        return this.post(url)
    }

    async sendCertificateByMail(params) {
        const url = this.getURL('/api/send-mail-certificate')
        return this.post(url, params)
    }

    async getCertificateByCredential(params) {
        const url = this.getURL('/api/user/get-certificate-credential')
        return this.get(url, params)
    }
}

const instance = new ServerRequest()
export default instance