/**
 * @swagger
 * tags: 
 *  name: User 
 *  description: The User API
 */

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*         - name
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*         name:
*           type: string
*           description: The user name
*       example:
*         email: 'example@gmail.com'
*         password: '12342345234556'
*         name: 'Adam Sandler'
*/

import express from 'express'
const router = express.Router()
import user from '../controllers/user.js'
import auth from '../controllers/auth.js'
import { Request } from '../Utils'


/**
 * @swagger
 * /user:
 *   get:
 *     summary: get list of all users from server
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/User'
 *  
 */
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

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: get user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested user id
 *     responses:
 *       200:
 *         description: the requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *  
 */

router.get('/:id', auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await user.getUserById(Request.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'message': err.message
        })
    }
})

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: update existing user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the updated user id    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: the requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *  
 */

router.put('/:id', auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await user.updateUser(Request.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'message': err.message
        })
    }
})

export = router