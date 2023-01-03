import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import post from "../controllers/post"
import { Request } from "../Utils"

export = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const getAllPosts = async () => {
        try {
            const response = await post.getPosts()
            socket.emit('post:get.response', response.body)
        } catch (err) {
            socket.emit('post:get.response', {'status': 'fail'})
        }
    }

    const getPostById = async (params) => {
        try {
            const response = await post.getPostById(new Request(null, null, params))
            socket.emit('post:get:id.response', response.body)
        } catch (err) {
            socket.emit('post:get:id.response', { 'status': 'fail' })
        }
    }
    
    const getPostBySender = async (req) => {
        try {
            const response = await post.getPosts(new Request(req))
            socket.emit('post:get:sender.response', response.body)
        } catch (err) {
            socket.emit('post:get:sender.response', { 'status': 'fail' })
        }
    }

    const addNewPost = async (body) => {
        try {
            const response = await post.addPost(new Request(body, body.sender))
            socket.emit('post:post.response', response.body)
        } catch (err) {
            socket.emit('post:post.response', { 'status': 'fail' })
        }
    }
    
    
    const updatePost = async (req) => {
        try {
            const response = await post.updatePost(new Request(req.body, null, req.params))
            socket.emit('post:put.response', response.body)
        } catch (err) {
            socket.emit('post:put.response', { 'status': 'fail' })
        }
    }

    socket.on("post:get", getAllPosts)
    socket.on("post:get:id", getPostById)
    socket.on("post:get:sender", getPostBySender)
    socket.on("post:post", addNewPost)
    socket.on("post:put", updatePost)
}