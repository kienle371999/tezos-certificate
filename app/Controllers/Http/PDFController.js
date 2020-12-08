'use strict'

const { validate } = use('Validator')
const Mail = use('Mail')
const Env = use('Env')
const path = use('path')
const slug = use('slug')
const fs = use('fs')
const rootPath = path.join(__dirname, '../../../create-PDF/bin/certificates/')
const cli = require('../../../create-PDF/lib/cli')
class PDFController {
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
