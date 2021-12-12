const ApplicationError = require('libs/error')


class UnknownHttpPathError extends ApplicationError.EntityNotExistsError {
    /**
     * @param {Object} [error]
     * @param {String} [error.message]
     * @param {Number} [error.code]
     */
    constructor(error) {
        super(
            {
                message: error?.message || 'Неизвестный путь',
                code: error?.code || 3
            }
        )
    }
}


module.exports = {
    UnknownHttpPathError
}