

/**
 * @module ApplicationError
 * @summary Base Application Error class
 */


/**
 * @typedef BaseError
 * @type {Object}
 * @property {String} [message]
 * @property {Number} [code]
 */


class ApplicationError extends Error {
    /**
     * @param {ApplicationError|MultipleError} error
     */
    static complianceHttpCode(error) {
        if (error instanceof ApplicationError.MultipleError) {
            error = error.errors[0]
        }

        if (error instanceof ApplicationError.InvalidDataError) {
            return 400
        } else if (error instanceof ApplicationError.AuthorizationError) {
            return 401
        } else if (error instanceof ApplicationError.AccessError) {
            return 403
        } else if (error instanceof ApplicationError.EntityNotExistsError) {
            return 404
        } else if (error instanceof ApplicationError.UnprocessableEntityError) {
            return 422
        } else if (error instanceof ApplicationError.TooEarlyError) {
            return 425
        } else {
            return 500
        }
    }

    /**
     * @param {BaseError} [error]
     */
    constructor(error) {
        super()
        this.message = error?.message || this.constructor.name
        this.code = error?.code || 0
    }

    /**
     * @returns {BaseError|Object}
     */
    toJSON() {
        return {
            message: this.message,
            code: this.code,
            error: this.constructor.name
        }
    }

    static MultipleError = class MultipleError extends ApplicationError {

        /**
         * @param {Array.<ApplicationError|any>} errors
         */
        constructor(errors) {
            super(errors[0])

            this.errors = errors
        }

        toJSON() {
            const error = super.toJSON()

            error.errors = this.errors.map(error => error.toJSON())

            return error
        }
    }

    static InvalidDataError = class InvalidDataError extends ApplicationError {

        /**
         * @param {BaseError} error 
         */
        constructor(error) {
            super(error)
        }
    }

    static AccessError = class AccessError extends ApplicationError {

        /**
         * @param {BaseError} error 
         */
        constructor(error) {
            super(error)
        }
    }

    static AuthorizationError = class AuthorizationError extends ApplicationError {

        /**
         * @param {BaseError} error 
         */
        constructor(error) {
            super(error)
        }
    }

    static UnprocessableEntityError = class UnprocessableEntityError extends ApplicationError {

        /**
         * @param {BaseError} error 
         */
        constructor(error) {
            super(error)
        }
    }

    static EntityExistsError = class EntityExistsError extends ApplicationError.InvalidDataError {

        /**
         * @param {BaseError} error 
         */
        constructor(error) {
            super(error)
        }
    }

    static EntityNotExistsError = class EntityNotExistsError extends ApplicationError {

        /**
         * @param {BaseError} error 
         */
        constructor(error) {
            super(error)
        }
    }

    static InternalError = class InternalError extends ApplicationError {

        /**
         * @param {BaseError} error 
         */
        constructor(error) {
            super(error)
        }
    }

    static TooEarlyError = class TooEarlyError extends ApplicationError {

        /**
         * @param {BaseError} error 
         */
        constructor(error) {
            super(error)
        }
    }

    static JsonSchemaValidationError = class JsonSchemaValidationError extends ApplicationError.InvalidDataError {

        /**
         * @param {BaseError} [error]
         */
        constructor(error) {
            super(error)
        }
    }

    static InvalidJSONStructureError = class InvalidJSONStructureError extends ApplicationError.InvalidDataError {
        constructor(
            error = {
                message: 'Невалидная структура JSON',
                code: 2
            }
        ) {
            super(error)
        }
    }
}


module.exports = ApplicationError