import Post from '../models/post_model'
import { Request, Response } from 'express'

const getPosts = async (req: Request, res: Response) => {
    try {
        let posts = {}
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

const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
    } catch (err) {
        res.status(400).send(err)
    }
}

const addPost = async (req: Request, res: Response) => {
    const post = new Post({
        message: req.body.message,
        sender: req.body.sender
    })

    try {
        const newPost = await post.save()
        res.status(200).send(newPost)
    } catch (err) {
        res.status(400).send(err)
    }
}

const updatePost = async (req: Request, res: Response) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).send(post)
    } catch (err) {
        res.status(400).send(err)
    }
}

export = { getPosts, getPostById, addPost, updatePost }