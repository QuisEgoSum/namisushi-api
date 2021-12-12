const ApplicationError = require('libs/error')


class SessionNotExistsError extends ApplicationError.EntityNotExistsError {
    /**
     * @param {String} sessionId
     */
    constructor(sessionId) {
        super(
            {
                message: 'Сессия не найдена',
                code: 2901
            }
        )

        this.sessionId = sessionId
    }

    toJSON() {
        const error = super.toJSON()

        error.sessionId = this.sessionId

        return error
    }
}


module.exports = {
    SessionNotExistsError
}