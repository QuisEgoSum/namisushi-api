const ApplicationError = require('libs/error')


class CategoryNotExistsError extends ApplicationError.EntityNotExistsError {

    /**
     * @param {Object} [error]
     * @param {String} [error.message]
     * @param {Number} [error.code]
     */
    constructor(error) {
        super(
            {
                message: error?.message || 'Категория не найдена',
                code: error?.code || 5000
            }
        )
    }
}

class CategoryExistsError extends ApplicationError.EntityExistsError {

    /**
     * @param {Object} [error]
     * @param {String} [error.message]
     * @param {Number} [error.code]
     */
    constructor(error) {
        super(
            {
                message: error?.message || 'Категория с таким именем уже существует',
                code: error?.code || 5001
            }
        )
    }
}


module.exports = {
    CategoryNotExistsError,
    CategoryExistsError
}