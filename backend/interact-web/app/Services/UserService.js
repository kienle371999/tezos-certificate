'use strict'

const User = use('App/Models/User')
const Token = use('App/Models/Token')


class UserService {
    static async addToken({ params }) {
        const { email, token, type } = params
        const user = await User.findBy('email', email) 
        const generated_token = await Token.create({
            user_id: user.id,
            type: type,
            is_revoked: 0,
            token: token
        })

        return generated_token
    }

    static async registerUser({ params }) {
        const newUser = await User.create(params)
        return newUser
    }
}

module.exports = UserService

