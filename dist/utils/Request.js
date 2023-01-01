"use strict";
class GenericRequest {
    constructor(body, userId = null, params = null) {
        this.body = {};
        this.userId = null;
        this.params = null;
        this.body = body;
        this.userId = userId;
        this.params = params;
    }
    static fromRestRequest(req) {
        return new GenericRequest(req.body, req.body.userId, req.params);
    }
}
module.exports = GenericRequest;
//# sourceMappingURL=Request.js.map