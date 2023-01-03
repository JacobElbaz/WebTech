"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.Response = exports.Request = void 0;
class Request {
    constructor(body, userId = null, params = null) {
        this.body = {};
        this.userId = null;
        this.params = null;
        this.body = body;
        this.userId = userId;
        this.params = params;
    }
    static fromRestRequest(req) {
        return new Request(req.body, req.body.userId, req.params);
    }
}
exports.Request = Request;
class Response {
    constructor(body, userId, err, params = null) {
        this.body = {};
        this.userId = null;
        this.params = null;
        this.err = null;
        this.body = body;
        this.userId = userId;
        this.params = params;
        this.err = err;
    }
    sendRestResponse(res) {
        if (this.err == null) {
            res.status(200).send(this.body);
        }
        else {
            res.status(this.err.code).send({
                'status': 'fail',
                'message': this.err.message
            });
        }
    }
}
exports.Response = Response;
class Error {
    constructor(code, message) {
        this.code = 0;
        this.message = null;
        this.code = code;
        this.message = message;
    }
}
exports.Error = Error;
//# sourceMappingURL=Utils.js.map