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
const post_model_1 = __importDefault(require("../models/post_model"));
const Utils_1 = require("../Utils");
const getPosts = (req = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = {};
        if (req == null || req.body.sender == null) {
            posts = yield post_model_1.default.find();
        }
        else {
            posts = yield post_model_1.default.find({ 'senderId': req.body.sender[0] });
        }
        return new Utils_1.Response(posts, null, null);
    }
    catch (err) {
        return new Utils_1.Response(null, null, new Utils_1.Error(400, err.message));
    }
});
const getPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        return new Utils_1.Response(post, null, null);
    }
    catch (err) {
        return new Utils_1.Response(null, null, new Utils_1.Error(400, err.message));
    }
});
const addPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new post_model_1.default({
        message: req.body.message,
        senderId: req.body.senderId,
        senderName: req.body.senderName,
        photo: req.body.photo
    });
    try {
        const newPost = yield post.save();
        return new Utils_1.Response(newPost, req.userId, null);
    }
    catch (err) {
        return new Utils_1.Response(null, req.userId, new Utils_1.Error(400, err.message));
    }
});
const updatePost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return new Utils_1.Response(post, req.userId, null);
    }
    catch (err) {
        return new Utils_1.Response(null, req.userId, new Utils_1.Error(400, err.message));
    }
});
module.exports = { getPosts, getPostById, addPost, updatePost };
//# sourceMappingURL=post.js.map