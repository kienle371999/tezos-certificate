'use strict'
const { validate } = use('Validator')
const Certificate = use('App/Models/Certificate')
const CertificateService = use('App/Services/CertificateService')

class CertificateController {
    async generate({ request, response, auth }) {
        const rules = {
            name: 'required|string',
            identity: 'required|string',
            email: 'required|email',
            type: 'required|string',
        }
        
        const { name, identity, email, type } = request.all()
        const validation = validate({ name, identity, email, type }, rules)
        if(!validation) {
            return response.badRequest(validation.messages())
        }
        
        const checkIdentity = await Certificate.findBy('identity', identity) 
        if(checkIdentity) {
            return response.badRequest({ error: 'Duplicated Student ID' })
        }

        const checkEmail = await Certificate.findBy('email', email) 
        if(checkEmail) {
            return response.badRequest({ error: 'Duplicated Email' })
        }
        
        const result = await CertificateService.generate({ params: request.all(), auth })
        return response.ok(result)
    }

    async getCertificate({ request, response }) {
        const result = await Certificate.all()
        console.log("getCertificate -> result", result)

        return response.ok(result)
    }
    async getCertificateHash({ request, response }) {
        const rules = {
            email: 'required|email'
        }

        const { email } = request.all()
        const validation = await validate({ email }, rules)
        if(!validation) {
            return response.badRequest(validation.messages())
        }

        const hash = await CertificateService.getHash({ params: request.all() })
        return response.ok(hash)
    }

    async createSignature({ request, response }) {
        const rules = {
            email: 'required|email',
            signature: 'required|string'
        }

        const { email, signature } = request.all()
        const validation = await validate({ email, signature }, rules)
        if(!validation) {
            return response.badRequest(validation.messages())
        }

        const checkSign = await Certificate.findBy('signature', signature) 
        if(checkSign) {
            return response.badRequest({ error: 'Duplicated Signature' })
        }
        
        const checkValid = await Certificate.findBy('email', email)
        if(checkValid['is_signed']) {
            return response.badRequest({ error: 'Certificate was signed' })
        }

        await CertificateService.createSignature({ params: request.all() })
        return response.ok({ message: 'Done' })
    }

    async storeBlockchainHash({ request, response }) {
        const rules = {
            email: 'required|email',
            blockchain_hash: 'required|string'
        }

        const { email, blockchain_hash } = request.all()
        const validation = await validate({ email, blockchain_hash }, rules)
        if(!validation) {
            return response.badRequest(validation.messages())
        }

        const checkValid = await Certificate.findBy('email', email)
        if(checkValid['is_broadcasted']) {
            return response.badRequest({ error: 'Certificate was broadcasted' })
        }

        await CertificateService.createBlockchainHash({ params: request.all() })
        return response.ok({ message: 'Done' })
    }
}

module.exports = CertificateController
