'use strict'
const cli = use('App/Create-PDF/lib/cli')
const { validate } = use('Validator')
const Mail = use('Mail')
const Env = use('Env')
const path = use('path')
const slug = use('slug')
const pm2 = use('pm2')
const fs = use('fs')
const rootPath = path.join(__dirname, '../../Create-PDF/bin/certificates/')
const pdfPath = path.join(__dirname, '../../Create-PDF/bin/certify.js')

class PDFController {
    initCertificate({ request, response }) {
        const { courseData } = request.all()
        cli.init(courseData)

        return response.ok({ message: "Creating certificate's data" })
    }

    createPDF({ request, response }) {
        const { name } = request.all()
        
        pm2.start({
            name: 'tezos-certificate-pdf',
            script: pdfPath
        }, () => {
            this.createTitle(name)
            pm2.stop('tezos-certificate-pdf')
            console.log('success in stop certificate-pdf')
        })

        return response.ok({ message: "Successfully generate PDF" })     
    }

    async sendMailToRecipient({ request, response }) {
        const rules = {
            name: 'required|string',
            email: 'required|email'
        }

        const { name, email } = request.all()
        const validation = await validate({ name, email }, rules)
        if(!validation) {
            return response.badRequest(validation.messages())
        }

        let title = this.createTitle(name)
        await Mail.send('mail.edge', email, (message) => {
            message
                    .to(email)
                    .from(Env.get('MAIL_USERNAME'))
                    .attach(title)
                    .subject('Diploma of Graduation')
        })
        cli.removePDFCertificate(title)

        return response.ok({ message: "Success" })
    }

    createTitle(name) {
        const baseTitle = slug(name).toLowerCase()
        let title = rootPath.concat(baseTitle.concat('.pdf'))

        console.log('path exits =====>', fs.existsSync(title))
        while(!fs.existsSync(title)) {
            title = rootPath.concat(baseTitle.concat('.pdf'))
        }

        return title 
    }
}

module.exports = PDFController
