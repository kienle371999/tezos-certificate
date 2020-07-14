'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const UserService = use('App/Services/UserService')


class UserController {
    async logIn({ request, response, auth }) {
        const rules = {
            email: 'required|email',
            password: 'required'
        }

        const { email, password } = request.only(['email', 'password'])
        const validation = validate({ email, password }, rules)
        if(validation.fails) {
            return response.badRequest(validation.messages())
        }
        
        try {
            const user = await auth.attempt(email, password)
            await UserService.addToken({ params: { email, token: user.token, type: 'bearer' } })
            return response.ok(user)
        } catch (error) {
            return response.forbidden({ error: 'Invalid email or password' })
        }
    }  
    
    async registerUser({ request, response }) {
        const rules = {
          username: 'string',
          password: 'required|string',
        }
    
        const { username, email, password } = request.all()
        const validation = await validate({ username, password }, rules)
        const duplicatedUserName = await User.findBy('username', username)
        const duplicatedEmail = await User.findBy('email', email)
    
        if (duplicatedUserName) {
            return response.forbidden({ error: 'The username was registered' })
        }
        if (duplicatedEmail) {
            return response.forbidden({ error: 'The email was registered' })
        }
        if (validation.fails()) {
          return response.badRequest(validation.messages())
        }
    
        const result = await UserService.registerUser({ params: request.all() })
        return response.ok(result)
      }    
}

module.exports = UserController
