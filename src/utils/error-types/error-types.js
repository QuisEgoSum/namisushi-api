
class ClientError {
    constructor(message, status) {
        this.message = message
        this.status = status
        Object.defineProperty(this, 'status', {enumerable: false})
    }
}

class NotFound extends ClientError {
    constructor(message = 'Not found') {
        super(message, 404)
    }
}

class Unauthorized extends ClientError {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}

class Forbidden extends ClientError {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

class TooManyRequests extends ClientError {
    constructor(expires, message = 'Too Many Requests') {
        super(message, 429)
        this.expires = expires
    }
}

class BadRequest extends ClientError {
    constructor(message = 'Bad Request') {
        super(message, 400)
    }
}

class UnprocessableEntity extends ClientError {
    constructor(message) {
        super(message, 422)
    }
}


module.exports = {
    ClientError,
    NotFound,
    Unauthorized,
    Forbidden,
    TooManyRequests,
    UnprocessableEntity,
    BadRequest,
}