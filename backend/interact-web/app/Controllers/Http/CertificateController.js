'use strict'
const { validate } = use('Validator')
const Certificate = use('App/Models/Certificate')
const CertificateService = use('App/Services/CertificateService')

class CertificateController {
    async generate({ request, response, auth }) {
        const rules = {
            name: 'required|string',
            identity: 'required|string',
            email: 'required|string',
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
}

module.exports = CertificateController
