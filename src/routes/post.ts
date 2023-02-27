/**
 * @swagger
 * tags: 
 *  name: Post 
 *  description: The Posts API
 */

import express from 'express'
const router = express.Router()
import post from '../controllers/post.js'
import auth from '../controllers/auth.js'
import { Request } from '../Utils'

/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - message
*         - senderId
*         - senderName
*       properties:
*         message:
*           type: string
*           description: The post text
*         senderID:
*           type: string
*           description: The sending user id
*         senderName:
*           type: string
*           description: The sending user name
*       example:
*         message: 'this is my new post'
*         senderId: '12342345234556'
*         senderName: 'Adam Sandler'
*/

/**
 * @swagger
 * /post:
 *   get:
 *     summary: get list of post from server
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: senderId
 *         schema:
 *           type: string
 *           description: filter the posts according to the given sender id
 *     responses:
 *       200:
 *         description: the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/Post'
 *  
 */
router.get('/', auth.authenticateMiddleware, async (req, res) => {
    try {
        const request = {body: {
            sender: req.query.sender
        }}
        const response = await post.getPosts(Request.fromRestRequest(request))
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
 * /post/{id}:
 *   get:
 *     summary: get post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *  
 */
router.get('/:id', auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await post.getPostById(Request.fromRestRequest(req))
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
 * /post:
 *   post:
 *     summary: add a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *  
 */
router.post('/', auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await post.addPost(Request.fromRestRequest(req))
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
 * /post/{id}:
 *   put:
 *     summary: update existing post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the updated post id    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *  
 */
router.put('/:id', auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await post.updatePost(Request.fromRestRequest(req))
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
 * /post/delete/{id}:
 *   post:
 *     summary: delete post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the deleted post id 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *  
 */
router.post('/delete/:id', auth.authenticateMiddleware, async (req, res) => {
    try {
        const response = await post.deletePost(Request.fromRestRequest(req))
        response.sendRestResponse(res)
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'message': err.message
        })
    }
} )
export = router