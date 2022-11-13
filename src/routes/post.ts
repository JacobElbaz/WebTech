const express = require('express')
const router = express.Router()
const post = require('../controllers/post.js')

router.get('/', post.getPosts)
router.get('/:id', post.getPostById)

router.post('/', post.addPost)

router.put('/:id', post.updatePost)

module.exports = router