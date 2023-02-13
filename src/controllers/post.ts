import Post from '../models/post_model'
import { Response, Error } from '../Utils'

const getPosts = async (req = null) => {
    try {
        let posts = {}
        if (req == null || req.body.sender == null) {
            posts = await Post.find()
        } else {
            posts = await Post.find({ 'sender': req.body.sender })
        }
        return new Response(posts, null, null)
    } catch (err) {
        return new Response(null, null, new Error(400, err.message))
    }
}

const getPostById = async (req) => {
    try {
        const post = await Post.findById(req.params.id)
        return new Response(post, null, null)
    } catch (err) {
        return new Response(null, null, new Error(400, err.message))
    }
}

const addPost = async (req) => {
    const post = new Post({
        message: req.body.message,
        sender: req.body.sender,
        photo: req.body.photo
    })

    try {
        const newPost = await post.save()
        return new Response(newPost, req.userId, null)
    } catch (err) {
        return new Response(null, req.userId, new Error(400, err.message))
    }
}

const updatePost = async (req) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return new Response(post, req.userId, null)
    } catch (err) {
        return new Response(null, req.userId, new Error(400, err.message))
    }
}


export = { getPosts, getPostById, addPost, updatePost }