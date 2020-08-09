'use strict'
const cli = use('App/Create-PDF/lib/cli')
const command = use('App/Create-PDF/bin/command')
const { validate } = use('Validator')
const Mail = use('Mail')
const Env = use('Env')
const path = use('path')
const slug = use('slug')
const rootPath = path.join(__dirname, '../../Create-PDF/bin/certificates/')

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

        const title = this.createTitle(name)
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
}

module.exports = PDFController
