import Post from '../models/post_model'
import GenericResponse from '../utils/Response'
import GenericError from '../utils/Error'

const getPosts = async (req=null) => {
    try {
        let posts = {}
        if (req == null || req.body.sender == null) {
            posts = await Post.find()
        } else {
            posts = await Post.find({'sender': req.body.sender})
        }
        return new GenericResponse(posts, null, null)
    } catch (err) {
        return new GenericResponse(null, null, new GenericError(400, err.message))
    }
}

const getPostById = async (req) => {
    try {
        const post = await Post.findById(req.body.id)
        return new GenericResponse(post, null, null)
    } catch (err) {
        return new GenericResponse(null, null, new GenericError(400, err.message))
    }
}

const addPost = async (req) => {
    const post = new Post({
        message: req.body.message,
        sender: req.userId
    })

    try {
        const newPost = await post.save()
        return new GenericResponse(newPost, req.userId, null)
    } catch (err) {
        return new GenericResponse(null, req.userId, new GenericError(400, err.message))
    }
}

const updatePost = async (req) => {
    try {
        console.log('req update')
        console.log(req)
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        console.log(post)
        return new GenericResponse(post, req.userId, null)
    } catch (err) {
        return new GenericResponse(null, req.userId, new GenericError(400, err.message))
    }
}

export = { getPosts, getPostById, addPost, updatePost }