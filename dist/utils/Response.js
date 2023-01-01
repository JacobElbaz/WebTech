"use strict";
class GenericResponse {
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
module.exports = GenericResponse;
//# sourceMappingURL=Response.js.map