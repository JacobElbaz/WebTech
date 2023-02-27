import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

const userEmail = "user1@gmail.com"
const newUserEmail = "newuser1@gmail.com"
const userPassword = "12345678"
const userName = 'User1'
const newUserName = 'NewUser1'
let accessToken = ''
let userId = ''

beforeAll(async ()=>{
    const res = await request(app).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName 
    })
})

async function loginUser() {
    const response = await request(app).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword 
    })
    accessToken = response.body.accessToken
    userId = response.body.id
}

beforeEach(async ()=>{
    await loginUser()
})

afterAll(async ()=>{
    await User.remove({ email: newUserEmail })
    await User.remove({ email: userEmail })
    mongoose.connection.close()
})

describe("User Tests", ()=>{
    jest.setTimeout(15000)
    
    test("Not authorized attempt test",async ()=>{
        const response = await request(app).get('/user');
        expect(response.statusCode).not.toEqual(200)
    })

    test("Get all users", async () => {
        const response = await request(app).get('/user').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).not.toEqual(0)
    })

    test("Get user by ID", async () => {
        const response = await request(app).get('/user/' + userId).set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body._id).toEqual(userId)
        expect(response.body.email).toEqual(userEmail)
        expect(response.body.name).toEqual(userName)
    })

    test("Update user", async () => {
        const response = await request(app).put('/user/' + userId).set('Authorization', 'JWT ' + accessToken)
        .send({
            "name": newUserName,
            "email": newUserEmail
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.name).toEqual(newUserName)
        expect(response.body.email).toEqual(newUserEmail)
    })
})