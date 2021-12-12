const ApplicationError = require('libs/error')


class UserAuthorizationError extends ApplicationError.AuthorizationError {
    /**
     * @param {String} sessionId
     */
    constructor(sessionId) {
        super(
            {
                message: 'Вы не авторизованы',
                code: 1000
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

class UserRightsError extends ApplicationError.AccessError {
    constructor() {
        super(
            {
                message: 'У вас недостаточно прав для выполнения этого действия',
                code: 1001
            }
        )
    }
}


module.exports = {
    UserAuthorizationError,
    UserRightsError
}