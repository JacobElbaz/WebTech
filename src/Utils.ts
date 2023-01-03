class Request {
    body = {}
    userId = null
    params = null
    constructor(body, userId=null, params=null) {
        this.body = body
        this.userId = userId
        this.params = params
    }

    static fromRestRequest(req) {
        return new Request(req.body, req.body.userId, req.params)
    }
}

class Response {
    body = {}
    userId = null
    params = null
    err = null
    constructor(body, userId, err, params=null) {
        this.body = body
        this.userId = userId
        this.params = params
        this.err = err
    }

    sendRestResponse(res) {
        if (this.err == null) {
            res.status(200).send(this.body)
        } else {
            res.status(this.err.code).send({
                'status': 'fail',
                'message': this.err.message
            })
        }
    }
}

class Error {
    code = 0
    message = null
    constructor(code, message) {
        this.code = code
        this.message = message
    }
} 

export { Request, Response, Error }