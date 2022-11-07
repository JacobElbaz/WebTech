const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../server')
const Post = require('../models/post_model')

const newPostMessage = 'This is the new test post message'
const newPostSender = '123456'
const updatedPostMessage = "This is the updated message"
const updatedPostSender = "654321"
let newPostId = null

beforeAll( async () => {
    await Post.remove()
})

afterAll(async () => {
    await Post.remove()
    mongoose.connection.close()
})

describe("Posts Tests", () => {
    test("add new post", async () => {
        const response = await request(app).post('/post').send({
            "message" : newPostMessage,
            "sender" : newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
        newPostId = response.body._id
    })

    test("get all posts", async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
    })

    test("get post by id", async () => {
        const response = await request(app).get('/post/' + newPostId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
        expect(response.body._id).toEqual(newPostId)
    })

    test("get post by sender", async () => {
        const response = await request(app).get('/post')
        .query({sender : newPostSender})
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
    })

    test("update post", async () => {
        const response = await request(app).put('/post/' + newPostId)
        .send({
            message : updatedPostMessage,
            sender : updatedPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(updatedPostMessage)
        expect(response.body.sender).toEqual(updatedPostSender)
    })
})