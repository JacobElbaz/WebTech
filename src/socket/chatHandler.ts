import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Message from '../models/message_model'

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
            socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const sendMessage = async (payload) => {
        const message = new Message({
            message: payload.message,
            from: socket.data.user,
            to: payload.to
        })
        try {
            const response = await message.save()
            console.log(response)
        } catch (err) {
            console.log(err)
        }
        io.to(message.to).emit("chat:message",{'to':message.to, 'from': message.from, 'message':message.message})
    }

    const getMessagesById = async (payload) => {
        let messages = {}
        try {
            const messagesSends = await Message.find({'from': socket.data.user, 'to': payload.id})
            const messagesReceived = await Message.find({'from': payload.id, 'to': socket.data.user})
            messages = messagesSends.concat(messagesReceived)
            console.log(messages);
        } catch (err) { console.log(err) }
        io.to(socket.data.user).emit("chat:message", messages)
    }

    socket.on("chat:send_message", sendMessage)
    socket.on("chat:get_messages", getMessagesById)
}