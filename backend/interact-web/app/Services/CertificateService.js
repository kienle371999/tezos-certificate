'use strict'

const Certificate = use('App/Models/Certificate')
const Hash = use('Hash')

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

    static async getHash({ params }) {
        const { email } = params
        const certificate = await Certificate.findBy('email', email) 
        const hash = await Hash.make(certificate.toString())
        return hash
    }

    static async createSignature({ params }) {
        const { email, signature } = params 
        const signed_certificate = await Certificate.query()
        .where('email', email)
        .update({ signature: signature })

        return signed_certificate
    }

    static async createBlockchainHash({ params }) {
        const { email, blockchain_hash } = params
        const broadcasted_certificate = await Certificate.query()
        .where('email', email)
        .update({ blockchain_hash: blockchain_hash, is_broadcasted: true, signature: 'broadcasted into blockchain' })

        return broadcasted_certificate
    }
}

module.exports = CertificateService