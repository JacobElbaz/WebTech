"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    message: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    }
});
module.exports = mongoose_1.default.model('Post', postSchema);
//# sourceMappingURL=post_model.js.map