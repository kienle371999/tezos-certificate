'use strict'
const { validate } = use('Validator')
const ErrorFactory = use('App/Common/ErrorFactory')

class SearchEngine {
    static async validateArgs(args) {
        const rules = {}
        Object.keys(args).forEach(field => {
                field === 'email' 
                ? Object.assign(rules, { [field]: 'required|email' }) 
                : Object.assign(rules, { [field]: 'required|string' })   
        })
        
        const validation = await validate(args, rules)
        if (validation.fails()) {
            return {
                status: false,
                data: ErrorFactory.badRequest(validation.messages())
            }
        }
    
        return { status: true }
    }

    static getParams(args) {
        const params = []
        Object.keys(args).forEach(field => {
            if(field !== 'orderBy' && field !== 'orderType' && field !== 'limit' && field !== 'page') {
                params.push(field)
            }
        })

        return params
    }

    static async queryEngine(Model, args) {
        const params = this.getParams(args)
        const queryString = Model.query()
        params.forEach(param => {
            queryString.where(param, 'LIKE', '%'+args[param]+'%')
        })

        const res = await queryString.orderBy(args['orderBy'] ? args['orderBy'] : 'id', args['orderType']).paginate(args['page'], args['limit'])
        return res
    }
}

module.exports = SearchEngine






