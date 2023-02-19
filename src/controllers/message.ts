import Message from '../models/message_model'
import { Request, Response, Error } from '../Utils'

const getAllMessages = async () => {
    try{
        const messages = await Message.find()
        return new Response(messages, null, null)
    } catch (err) {
        console.log('fail getting all messages' + err)
        return new Response(null, null, new Error(400, err.message))
    }
}

const getConversation = async (req) => {
    try{
        const messages = await Message.find({ $or: [ {$and: [{'from': req.body.user1}, {'to': req.body.user2}]}, {$and: [{'from' : req.body.user2}, {'to': req.body.user1}]}]}).sort({'sendAt': 1})
        return new Response(messages, null,null)
    } catch(err){
        console.log('fail getting conversation messages' + err)
        return new Response(null, null, new Error(400, err.message))
    }
}

const getGlobalMessages = async () => {
    try{
        const messages = await Message.find({'to': 'global'})
        return new Response(messages, null, null)
    } catch(err) {
        console.log('fail getting global messages' + err)
        return new Response(null, null, new Error(400, err.message))
    }
}

export = { getAllMessages, getConversation, getGlobalMessages }