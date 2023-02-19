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
const Utils_1 = require("../Utils");
const getAllMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_model_1.default.find();
        return new Utils_1.Response(messages, null, null);
    }
    catch (err) {
        console.log('fail getting all messages' + err);
        return new Utils_1.Response(null, null, new Utils_1.Error(400, err.message));
    }
});
const getConversation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_model_1.default.find({ $or: [{ $and: [{ 'from': req.body.user1 }, { 'to': req.body.user2 }] }, { $and: [{ 'from': req.body.user2 }, { 'to': req.body.user1 }] }] }).sort({ 'sendAt': 1 });
        return new Utils_1.Response(messages, null, null);
    }
    catch (err) {
        console.log('fail getting conversation messages' + err);
        return new Utils_1.Response(null, null, new Utils_1.Error(400, err.message));
    }
});
const getGlobalMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_model_1.default.find({ 'to': 'global' });
        return new Utils_1.Response(messages, null, null);
    }
    catch (err) {
        console.log('fail getting global messages' + err);
        return new Utils_1.Response(null, null, new Utils_1.Error(400, err.message));
    }
});
module.exports = { getAllMessages, getConversation, getGlobalMessages };
//# sourceMappingURL=message.js.map