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
const post_1 = __importDefault(require("../controllers/post"));
const Request_1 = __importDefault(require("../utils/Request"));
module.exports = (io, socket) => {
    const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield post_1.default.getPosts();
            socket.emit('post:get.response', response.body);
        }
        catch (err) {
            socket.emit('post:get.response', { 'status': 'fail' });
        }
    });
    const getPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield post_1.default.getPostById(new Request_1.default(req));
            socket.emit('post:get:id.response', response.body);
        }
        catch (err) {
            socket.emit('post:get:id.response', { 'status': 'fail' });
        }
    });
    const getPostBySender = (req) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield post_1.default.getPosts(new Request_1.default(req));
            socket.emit('post:get:sender.response', response.body);
        }
        catch (err) {
            socket.emit('post:get:sender.response', { 'status': 'fail' });
        }
    });
    const addNewPost = (body) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield post_1.default.addPost(new Request_1.default(body, body.sender));
            socket.emit('post:post.response', response.body);
        }
        catch (err) {
            socket.emit('post:post.response', { 'status': 'fail' });
        }
    });
    const updatePost = (req) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield post_1.default.updatePost(new Request_1.default(req.body, null, req.params));
            console.log(response);
            socket.emit('post:put.response', response.body);
        }
        catch (err) {
            socket.emit('post:put.response', { 'status': 'fail' });
        }
    });
    socket.on("post:get", getAllPosts);
    socket.on("post:get:id", getPostById);
    socket.on("post:get:sender", getPostBySender);
    socket.on("post:post", addNewPost);
    socket.on("post:put", updatePost);
};
//# sourceMappingURL=postHandler.js.map