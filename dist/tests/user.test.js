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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const userEmail = "user1@gmail.com";
const newUserEmail = "newuser1@gmail.com";
const userPassword = "12345678";
const userName = 'User1';
const newUserName = 'NewUser1';
let accessToken = '';
let userId = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, supertest_1.default)(server_1.default).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName
    });
}));
function loginUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        });
        accessToken = response.body.accessToken;
        userId = response.body.id;
    });
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loginUser();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.remove({ email: newUserEmail });
    yield user_model_1.default.remove({ email: userEmail });
    mongoose_1.default.connection.close();
}));
describe("User Tests", () => {
    jest.setTimeout(15000);
    test("Not authorized attempt test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/user');
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Get all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/user').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).not.toEqual(0);
    }));
    test("Get user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/user/' + userId).set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body._id).toEqual(userId);
        expect(response.body.email).toEqual(userEmail);
        expect(response.body.name).toEqual(userName);
    }));
    test("Update user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).put('/user/' + userId).set('Authorization', 'JWT ' + accessToken)
            .send({
            "name": newUserName,
            "email": newUserEmail
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual(newUserName);
        expect(response.body.email).toEqual(newUserEmail);
    }));
});
//# sourceMappingURL=user.test.js.map