'use strict'

const Certificate = use('App/Models/Certificate')

class CertificateService {
    static async generate({ params, auth }) {
        const { name, identity, email, type } = params
        const credential = await this.getCredential()
        const generated = await Certificate.create({
            user_id: auth.user.id,
            name,
            identity,
            email,
            diploma_type: type,
            credential_number: credential
        })
        return generated
    }

    static async getCredential() {
        const base = 'UET'
        let number = Math.floor(Math.random() * 8999 + 1000)
        let credential = base.concat(number)
        const result = await Certificate.findBy('credential_number', credential)
        if(result) {
            credential = base.concat(number)
        }
        else {
            return credential
        }
    }
}

module.exports = CertificateService