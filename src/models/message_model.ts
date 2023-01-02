import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    from:{
        type: String, 
        required: true
    },
    to:{
        type: String,
        required: true
    }
})

export = mongoose.model('Message', messageSchema)