import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

const newPostMessage = 'This is the new test post message'
let newPostSenderId = ''
let newPostSenderName = ''
let newPostId = ''
const newPostMessageUpdated = 'This is the updated message'

const userEmail = "user1@gmail.com"
const userPassword = "12345678"
const userName = 'User1'
let accessToken = ''

beforeAll(async ()=>{
    const res = await request(app).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName 
    })
    newPostSenderId = res.body._id
    newPostSenderName = userName
})

async function loginUser() {
    const response = await request(app).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword 
    })
    accessToken = response.body.accessToken
}

beforeEach(async ()=>{
    await loginUser()
})

afterAll(async ()=>{
    await User.remove({ email: userEmail })
    mongoose.connection.close()
})

describe("Posts Tests", ()=>{
    test("add new post",async ()=>{
        const response = await request(app).post('/post').set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessage,
            "senderId": newPostSenderId,
            "senderName": newPostSenderName
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.senderId).toEqual(newPostSenderId)
        expect(response.body.senderName).toEqual(newPostSenderName)
        newPostId = response.body._id
    })

    test("get all posts",async ()=>{
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
    })

    test("get post by id",async ()=>{
        const response = await request(app).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.senderId).toEqual(newPostSenderId)
        expect(response.body.senderName).toEqual(newPostSenderName)
    })

    test("get post by wrong id fails",async ()=>{
        const response = await request(app).get('/post/12345').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(400)
    })

    test("get post by sender",async ()=>{
        const response = await request(app).get('/post?sender=' + newPostSenderId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].senderId).toEqual(newPostSenderId)
        expect(response.body[0].senderName).toEqual(newPostSenderName)
    })

    test("update post by ID",async ()=>{
        let response = await request(app).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessageUpdated,
            "senderId": newPostSenderId,
            "senderName": newPostSenderName
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.senderId).toEqual(newPostSenderId)
        expect(response.body.senderName).toEqual(newPostSenderName)

        response = await request(app).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.senderId).toEqual(newPostSenderId)
        expect(response.body.senderName).toEqual(newPostSenderName)

        response = await request(app).put('/post/12345').set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessageUpdated,
            "senderId": newPostSenderId,
            "senderName": newPostSenderName
        })
        expect(response.statusCode).toEqual(400)

        response = await request(app).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessageUpdated,
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.senderId).toEqual(newPostSenderId)
        expect(response.body.senderName).toEqual(newPostSenderName)
    })
    test("delete post", async () => {
        let response = await request(app).post('/post/delete/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)

        response = await request(app).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({})
    })
})