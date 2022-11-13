import express from 'express'
const router = express.Router()
import post from '../controllers/post.js'

router.get('/', post.getPosts)
router.get('/:id', post.getPostById)

router.post('/', post.addPost)

router.put('/:id', post.updatePost)

export = router