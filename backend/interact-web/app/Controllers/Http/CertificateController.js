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
        
        return response.ok(result)
    }
    async getCertificateToString({ request, response }) {
        const rules = {
            email: 'required|email'
        }

        const { email } = request.all()
        const validation = await validate({ email }, rules)
        if(!validation) {
            return response.badRequest(validation.messages())
        }

        const res = await CertificateService.getCertificateToString({ params: request.all() })
        return response.ok(res)
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

        const checkValid = await Certificate.findBy('email', email)
        if(checkValid['is_signed']) {
            return response.badRequest({ error: 'Certificate was signed' })
        }

        const result = await CertificateService.createSignature({ params: request.all() })
        console.log("createSignature -> result", result)
        return response.ok(result)
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

    async getCertificateByCredential({ request, response }) {
        const rules = {
            credential_number: 'required|string'
        }

        const { credential_number } = request.all()
        const validation = await validate({ credential_number }, rules)
        if(!validation) {
            return response.badRequest(validation.messages())
        }
        const res = await Certificate.findBy('credential_number', credential_number)
        console.log("getCertificateByCredential -> res", res)

        const result = await Certificate.query()
                                        .select('name', 'identity', 'diploma_type', 'email', 'credential_number', 'blockchain_hash', 'is_broadcasted')
                                        .where('credential_number', credential_number)
                                        .fetch()
        console.log("getCertificateByCredential -> result", result)
        
        return result
    }
}

module.exports = CertificateController
