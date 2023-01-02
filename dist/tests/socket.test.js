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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const supertest_1 = __importDefault(require("supertest"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const message_model_1 = __importDefault(require("../models/message_model"));
const userEmail = "user1@gmail.com";
const userPassword = "12345";
const userEmail2 = "user2@gmail.com";
const userPassword2 = "12345";
let newPostId = null;
let client1;
let client2;
function clientSocketConnect(clientSocket) {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            resolve("1");
        });
    });
}
const connectUser = (userEmail, userPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const response1 = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword
    });
    const userId = response1.body._id;
    const response = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    });
    const token = response.body.accessToken;
    const socket = (0, socket_io_client_1.default)('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + token
        }
    });
    yield clientSocketConnect(socket);
    const client = { socket: socket, accessToken: token, id: userId };
    return client;
});
describe("my awesome project", () => {
    jest.setTimeout(15000);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield post_model_1.default.remove();
        yield user_model_1.default.remove();
        yield message_model_1.default.remove();
        client1 = yield connectUser(userEmail, userPassword);
        client2 = yield connectUser(userEmail2, userPassword2);
    }));
    afterAll(() => {
        client1.socket.close();
        client2.socket.close();
        app_1.default.close();
        mongoose_1.default.connection.close();
    });
    test("should work", (done) => {
        client1.socket.once("echo:echo_res", (arg) => {
            expect(arg.msg).toBe('hello');
            done();
        });
        client1.socket.emit("echo:echo", { 'msg': 'hello' });
    });
    test("postAdd", (done) => {
        client1.socket.emit('post:post', { 'message': 'this is my message', 'sender': client1.id });
        client1.socket.on('post:post.response', (arg) => {
            expect(arg.message).toBe('this is my message');
            expect(arg.sender).toBe(client1.id);
            newPostId = arg._id;
            done();
        });
    });
    test("Post get all test", (done) => {
        client1.socket.emit('post:get');
        client1.socket.on('post:get.response', (arg) => {
            expect(arg.length).toEqual(1);
            expect(arg[0].sender).toBe(client1.id);
            expect(arg[0].message).toBe('this is my message');
            done();
        });
    });
    test("Post get by id", (done) => {
        client1.socket.emit('post:get:id', { 'id': newPostId });
        client1.socket.on('post:get:id.response', (arg) => {
            expect(arg.sender).toBe(client1.id);
            expect(arg.message).toBe('this is my message');
            done();
        });
    });
    test("Post get by sender", (done) => {
        client1.socket.emit('post:get:sender', { 'sender': client1.id });
        client1.socket.on('post:get:sender.response', (arg) => {
            expect(arg[0].sender).toBe(client1.id);
            expect(arg[0].message).toBe('this is my message');
            done();
        });
    });
    test("postUpdate", (done) => {
        client1.socket.emit('post:put', { 'body': { 'message': 'this is the new test post message' }, 'params': { 'id': newPostId } });
        client1.socket.on('post:put.response', (arg) => {
            expect(arg.message).toBe('this is the new test post message');
            expect(arg.sender).toBe(client1.id);
            done();
        });
    });
    test("Test chat messages", (done) => {
        const message = "hi... test 123";
        client2.socket.once('chat:message', (args) => {
            expect(args.to).toBe(client2.id);
            expect(args.message).toBe(message);
            expect(args.from).toBe(client1.id);
            done();
        });
        client1.socket.emit("chat:send_message", { 'to': client2.id, 'message': message });
    });
    test("Test get messages", (done) => {
        const message = "hi... test 123";
        client1.socket.once('chat:message', (args) => {
            expect(args[0].to).toBe(client2.id);
            expect(args[0].message).toBe(message);
            expect(args[0].from).toBe(client1.id);
            done();
        });
        client1.socket.emit("chat:get_messages", { 'id': client2.id });
    });
});
//# sourceMappingURL=socket.test.js.map