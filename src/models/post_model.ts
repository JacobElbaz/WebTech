import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    sender:{
        type: String, 
        required: true
    },
    photo:{
        type: String,
    }
})

export = mongoose.model('Post', postSchema)