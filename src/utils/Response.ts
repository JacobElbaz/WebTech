class GenericResponse {
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

export = GenericResponse