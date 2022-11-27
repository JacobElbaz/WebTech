import express from 'express'
const router = express.Router()
import post from '../controllers/post.js'
import auth from '../controllers/auth.js'

router.get('/', auth.authenticateMiddleware, post.getPosts)
router.get('/:id', auth.authenticateMiddleware, post.getPostById)

router.post('/', auth.authenticateMiddleware, post.addPost)

router.put('/:id', auth.authenticateMiddleware, post.updatePost)

export = router