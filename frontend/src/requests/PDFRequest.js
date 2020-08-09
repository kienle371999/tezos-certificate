import BaseRequest from './foundation/BaseRequest'

class PDFRequest extends BaseRequest {
    getURL(url) {
        const baseUrl = process.env.VUE_APP_PDF_URL
        return baseUrl.concat(url)
    }

    initCertificate(params) {
        const url = this.getURL('/api/init-certificate-data')
        return this.post(url, params)
    }

    createCertificatePDF(params) {
        const url = this.getURL('/api/create-certificate-pdf')
        return this.get(url, params)
    }
}

const instance = new PDFRequest()
export default instance