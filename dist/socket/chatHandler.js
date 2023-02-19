"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const message_model_1 = __importDefault(require("../models/message_model"));
module.exports = (io, socket) => {
    const sendMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const message = new message_model_1.default({
            message: payload.message,
            from: socket.data.user,
            to: payload.to
        });
        try {
            const response = yield message.save();
            console.log(response);
        }
        catch (err) {
            console.log(err);
        }
        io.to(message.to).emit("chat:message", { 'to': message.to, 'from': message.from, 'message': message.message });
    });
    const getMessagesById = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        let messages = {};
        try {
            const messagesSends = yield message_model_1.default.find({ 'from': socket.data.user, 'to': payload.id });
            const messagesReceived = yield message_model_1.default.find({ 'from': payload.id, 'to': socket.data.user });
            messages = messagesSends.concat(messagesReceived);
        }
        catch (err) {
            console.log(err);
        }
        io.to(socket.data.user).emit("chat:message", messages);
    });
    const getConversation = (req) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messages = yield message_model_1.default.find({ $or: [{ $and: [{ 'from': req.body.user1 }, { 'to': req.body.user2 }] }, { $and: [{ 'from': req.body.user2 }, { 'to': req.body.user1 }] }] }).sort({ 'sendAt': 1 });
            io.to(socket.data.user).emit("chat:message", messages);
        }
        catch (err) {
            console.log('fail getting conversation messages' + err);
        }
    });
    const getGlobalMessages = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messages = yield message_model_1.default.find({ 'to': 'global' });
            console.log('get ' + messages);
            io.to(socket.data.user).emit('chat:message', messages);
        }
        catch (err) {
            console.log('fail getting global messages' + err);
        }
    });
    socket.on("chat:send_message", sendMessage);
    socket.on("chat:get_messages", getMessagesById);
    socket.on("chat:get_global_messages", getGlobalMessages);
    socket.on("chat:get_conversation", getConversation);
};
//# sourceMappingURL=chatHandler.js.map