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
        pm2.start({
            name: 'tezos-certificate-pdf',
            script: pdfPath
        })

        return response.ok({ message: "Successfully generate PDF" })     
    }

    stopPDF({ request, response }) {
        console.log('stop certificate PDF')
        pm2.stop('tezos-certificate-pdf')

        return response.ok({ message: "Successfully stop generating PDF" }) 
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
        console.log('path ---------', rootPath.concat(title))
        console.log('success')
        await Mail.send('mail.edge', email, (message) => {
            message
                    .to(email)
                    .from(Env.get('MAIL_USERNAME'))
                    .attach(rootPath.concat(title))
                    .subject('Diploma of Graduation')
        })
        cli.removePDFCertificate(rootPath.concat(title))

        return response.ok({ message: "Success" })
    }

    createTitle(name) {
        const baseTitle = slug(name).toLowerCase()
        return baseTitle.concat('.pdf')
    }
    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }   
}

module.exports = PDFController
