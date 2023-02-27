import Post from '../models/post_model'
import { Response, Error } from '../Utils'

const getPosts = async (req = null) => {
    try {
        let posts = {}
        if (req == null || req.body.sender == null) {
            posts = await Post.find()
        } else {
            posts = await Post.find({ 'senderId': req.body.sender })
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
        senderId: req.body.senderId,
        senderName: req.body.senderName,
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

const deletePost = async (req) => {
    try {
        const post = await Post.deleteOne({'_id': req.params.id})
        console.log(`Post ${req.params.id} was deleted`);
        return new Response(post, req.userId, null)
    } catch(err){
        console.log('Fail to delete');
    }
}


export = { getPosts, getPostById, addPost, updatePost, deletePost }