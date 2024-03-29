import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import User from '../models/user_model'

const userEmail = "user1@gmail.com"
const userPassword = "12345678"
const userName = 'User1'
let accessToken = ''
let refreshToken = ''

beforeAll(async ()=>{
})

afterAll(async ()=>{
    await User.remove({ email: userEmail })
    mongoose.connection.close()
})

describe("Auth Tests", ()=>{
    test("Not authorized attempt test",async ()=>{
        const response = await request(app).get('/post');
        expect(response.statusCode).not.toEqual(200)
    })

    test("Register test",async ()=>{
        const response = await request(app).post('/auth/register').send({
            "email": userEmail,
            "password": userPassword,
            "name": userName 
        })
        expect(response.statusCode).toEqual(200)
    })

    test("Login test wrong password",async ()=>{
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword + '4'
        })
        expect(response.statusCode).not.toEqual(200)
        const access = response.body.accesstoken
        expect(access).toBeUndefined()
    })
    
    test("Login test wrong email",async ()=>{
        const response = await request(app).post('/auth/login').send({
            "email": userEmail + '4',
            "password": userPassword
        })
        expect(response.statusCode).not.toEqual(200)
        const access = response.body.accesstoken
        expect(access).toBeUndefined()
    })

    test("Login test",async ()=>{
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword 
        })
        expect(response.statusCode).toEqual(200)
        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
    })


    test("test sign valid access token",async ()=>{
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200)
    })

    test("test sign wrong access token",async ()=>{
        const response = await request(app).get('/post').set('Authorization', 'JWT 1' + accessToken);
        expect(response.statusCode).not.toEqual(200)
    })

    jest.setTimeout(15000)

    test("test expiered token",async ()=>{
        await new Promise(r => setTimeout(r,6000))
        const response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).not.toEqual(200)
    })

    test("test refresh token",async ()=>{
        let response = await request(app).get('/auth/refresh').set('Authorization', 'JWT ' + refreshToken);
        expect(response.statusCode).toEqual(200)

        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
        
        response = await request(app).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200)

    })

    test("Logout test",async ()=>{
        const response = await request(app).get('/auth/logout').set('Authorization', 'JWT ' + refreshToken)
        expect(response.statusCode).toEqual(200)
    })
    
})