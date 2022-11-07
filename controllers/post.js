const Post = require('../models/post_model')

const getPosts = async (req, res, next) => {
    try {
        let posts
        if (req.query.sender == null) {
            posts = await Post.find()
        } else {
            posts = await Post.find({'sender': req.query.sender})
        }
        res.status(200).send(posts)
    } catch (err) {
        res.status(400).send(err)
    }
}

const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
    } catch (err) {
        res.status(400).send(err)
    }
}

const addPost = async (req, res, next) => {
    const post = Post({
        message: req.body.message,
        sender: req.body.sender
    })

    try {
        newPost = await post.save()
        res.status(200).send(newPost)
    } catch (err) {
        res.status(400).send(err)
    }
}

const updatePost = async (req, res, next) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).send(post)
    } catch (err) {
        res.status(400).send(err)
    }
}

module.exports = { getPosts, getPostById, addPost, updatePost }