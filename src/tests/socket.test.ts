import server from "../app"
import mongoose from "mongoose"
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import request from 'supertest'
import Post from '../models/post_model'
import User from '../models/user_model'
import Message from "../models/message_model";

const userEmail = "user1@gmail.com"
const userPassword = "12345678"
const userName = "User1"

const userEmail2 = "user2@gmail.com"
const userPassword2 = "12345678"
const userName2 = "User2"

let newPostId = null

type Client = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    accessToken: string,
    id: string
}

let client1: Client
let client2: Client

function clientSocketConnect(clientSocket): Promise<string> {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            resolve("1")
        });
    })
}

const connectUser = async (userEmail, userPassword) => {
    const response1 = await request(server).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName
    })
    const userId = response1.body._id
    const response = await request(server).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    })
    const token = response.body.accessToken

    const socket = Client('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + token
        }
    })
    await clientSocketConnect(socket)
    const client = { socket: socket, accessToken: token, id: userId }
    return client
}

describe("my awesome project", () => {
    jest.setTimeout(15000)

    beforeAll(async () => {
        client1 = await connectUser(userEmail, userPassword)
        client2 = await connectUser(userEmail2, userPassword2)
    });

    afterAll( async () => {
        await User.remove({ email: userEmail })
        await User.remove({ email: userEmail2 })
        await Post.remove({ _id: newPostId })
        client1.socket.close()
        client2.socket.close()
        server.close()
        mongoose.connection.close()
    });

    test("should work", (done) => {
        client1.socket.once("echo:echo_res", (arg) => {
            expect(arg.msg).toBe('hello');
            done();
        });
        client1.socket.emit("echo:echo", { 'msg': 'hello' })
    });

    test("postAdd", (done) => {
        client1.socket.emit('post:post', { 'message': 'this is my message', 'senderId': client1.id, 'senderName': userName })
        client1.socket.on('post:post.response', (arg) => {
            expect(arg.message).toBe('this is my message')
            expect(arg.senderId).toBe(client1.id)
            newPostId = arg._id
            done()
        })
    })

    test("Post get all test", (done) => {
        client1.socket.emit('post:get')
        client1.socket.on('post:get.response', (arg) => {
            expect(arg[arg.length - 1].senderId).toBe(client1.id)
            expect(arg[arg.length - 1].message).toBe('this is my message')
            done()
        })
    });

    test("Get post by id", (done) => {
        client1.socket.emit('post:get:id', { 'id': newPostId })
        client1.socket.on('post:get:id.response', (arg) => {
            expect(arg.senderId).toBe(client1.id)
            expect(arg.message).toBe('this is my message')
            done()
        })
    });

    test("Get post by sender", (done) => {
        client1.socket.emit('post:get:sender', { 'sender': client1.id })
        client1.socket.on('post:get:sender.response', (arg) => {
            expect(arg[0].senderId).toBe(client1.id)
            expect(arg[0].message).toBe('this is my message')
            done()
        })
    });

    test("postUpdate", (done) => {
        client1.socket.emit('post:put', { 'body':{ 'message' : 'this is the new test post message'}, 'params': {'id' : newPostId} })
        client1.socket.on('post:put.response', (arg) => {
            expect(arg.message).toBe('this is the new test post message')
            expect(arg.senderId).toBe(client1.id)
            done()
        })
    })

    test("Test chat messages", (done) => {
        const message = "hi... test 123"
        client2.socket.once('chat:message', (args) => {
            expect(args.to).toBe(client2.id)
            expect(args.message).toBe(message)
            expect(args.from).toBe(client1.id)
            done()
        })
        client1.socket.emit("chat:send_message", { 'to': client2.id, 'message': message })
    })

    test("Test get messages", (done) => {
        const message = "hi... test 123"
        client1.socket.once('chat:message', (args) => {
            expect(args[0].to).toBe(client2.id)
            expect(args[0].message).toBe(message)
            expect(args[0].from).toBe(client1.id)
            done()
        })
        client1.socket.emit("chat:get_messages", { 'id': client2.id })
    })

});