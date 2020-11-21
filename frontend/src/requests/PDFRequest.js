import BaseRequest from './foundation/BaseRequest'

class PDFRequest extends BaseRequest {
    getURL(url) {
        const baseUrl = process.env.VUE_APP_PDF_URL
        return baseUrl.concat(url)
    }
    async createCertificatePDF(params) {
        console.log("PDFRequest -> createCertificatePDF -> params", params)
        const url = this.getURL('/api/create-certificate-pdf')
        return this.post(url, params)
    }
}

const instance = new PDFRequest()
export default instance