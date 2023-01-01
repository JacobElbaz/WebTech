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
const Response_1 = __importDefault(require("../utils/Response"));
const Error_1 = __importDefault(require("../utils/Error"));
const getPosts = (req = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = {};
        if (req == null || req.body.sender == null) {
            posts = yield post_model_1.default.find();
        }
        else {
            posts = yield post_model_1.default.find({ 'sender': req.body.sender });
        }
        return new Response_1.default(posts, null, null);
    }
    catch (err) {
        return new Response_1.default(null, null, new Error_1.default(400, err.message));
    }
});
const getPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.body.id);
        return new Response_1.default(post, null, null);
    }
    catch (err) {
        return new Response_1.default(null, null, new Error_1.default(400, err.message));
    }
});
const addPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new post_model_1.default({
        message: req.body.message,
        sender: req.userId
    });
    try {
        const newPost = yield post.save();
        return new Response_1.default(newPost, req.userId, null);
    }
    catch (err) {
        return new Response_1.default(null, req.userId, new Error_1.default(400, err.message));
    }
});
const updatePost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req update');
        console.log(req);
        const post = yield post_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(post);
        return new Response_1.default(post, req.userId, null);
    }
    catch (err) {
        return new Response_1.default(null, req.userId, new Error_1.default(400, err.message));
    }
});
module.exports = { getPosts, getPostById, addPost, updatePost };
//# sourceMappingURL=post.js.map