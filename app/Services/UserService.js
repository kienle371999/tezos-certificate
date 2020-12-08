'use strict'

const User = use('App/Models/User')
class UserService {
    static async registerUser({ params }) {
        const newUser = await User.create(params)
        return newUser
    }
}

module.exports = UserService

