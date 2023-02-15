import express from 'express'
const router = express.Router()
import user from '../controllers/user.js'
import auth from '../controllers/auth.js'
import { Request } from '../Utils'

router.get('/', auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await user.getUsers(Request.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'message': err.message
        })
    }
})

export = router