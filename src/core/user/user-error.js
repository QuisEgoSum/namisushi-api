const ApplicationError = require('libs/error')


class BadUserCredentialsError extends ApplicationError.InvalidDataError {
    /**
     * @param {Object} [error]
     * @param {String} [error.message]
     * @param {Number} [error.code]
     */
    constructor(error) {
        super(
            {
                message: error?.message || 'Неверный логин или пароль',
                code: error?.code || 2001
            }
        )
    }
}

class UserWithEmailExistsError extends ApplicationError.EntityExistsError {
    /**
     * @param {Object} [error]
     * @param {String} [error.message]
     * @param {Number} [error.code]
     */
    constructor(error) {
        super(
            {
                message: error?.message || 'Пользователь с таким именем пользователя существует',
                code: error?.code || 2002
            }
        )
    }
}

class UserNotExistsError extends ApplicationError.EntityNotExistsError {
    /**
     * @param {Object} [error]
     * @param {String} [error.message]
     * @param {Number} [error.code]
     */
    constructor(error) {
        super(
            {
                message: error?.message || 'Пользователь не найден',
                code: error?.code || 2003
            }
        )
    }
}

class UserCannotBeDeletedError extends ApplicationError.AccessError {
    /**
     * @param {Object} [error]
     * @param {String} [error.message]
     * @param {Number} [error.code]
     */
    constructor(error) {
        super(
            {
                message: error?.message || 'Вы не можете удалить этого пользователя',
                code: error?.code || 2004
            }
        )
    }
}


module.exports = {
    BadUserCredentialsError,
    UserWithEmailExistsError,
    UserNotExistsError,
    UserCannotBeDeletedError
}