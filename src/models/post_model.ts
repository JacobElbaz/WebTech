import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    senderId:{
        type: String, 
        required: true
    },
    senderName:{
        type: String,
        required: true
    },
    photo:{
        type: String,
    }
})

export = mongoose.model('Post', postSchema)