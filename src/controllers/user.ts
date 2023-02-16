import User from '../models/user_model'
import { Response, Error } from '../Utils'

const getUsers = async (req = null) => {
    try {
        const users = await User.find()
        return new Response(users, null, null)
    } catch (err) {
        return new Response(null, null, new Error(400, err.message))
    }
}

const getUserById = async (req: { params: { id: any } }) => {
    try {
        const user = await User.findById(req.params.id)
        return new Response(user, null, null)
    } catch (err) {
        return new Response(null, null, new Error(400, err.message))
    }
}

export = { getUsers, getUserById }