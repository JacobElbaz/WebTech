import dotenv from 'dotenv'
if (process.env.NODE_ENV == 'test') {
    dotenv.config({ path: './.testenv' })
} else {
    dotenv.config()
}
import express from 'express'
const app = express()
import http from 'http'
const server = http.createServer(app)

import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

import mongoose from "mongoose"
mongoose.connect(process.env.DATABASE_URL) //,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error', error => { console.error(error) })
db.once('open', () => { console.log('connected to mongo DB') })

app.use('/public', express.static('public'))
app.use('/uploads', express.static('uploads'))

import authRouter from './routes/auth.js'
app.use('/auth', authRouter)

import userRouter from './routes/user.js'
app.use('/user', userRouter)

import postRouter from './routes/post.js'
app.use('/post', postRouter)

import fileRouter from './routes/file.js'
app.use('/file', fileRouter)

import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 REST API",
                version: "1.0.0",
                description: "REST server including auhtentication using JWT",
            },
            servers: [{ url: "http://localhost:3000", },],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
}

export = server
