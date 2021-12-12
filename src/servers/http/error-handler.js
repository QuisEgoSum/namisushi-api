const logger = require('utils/logger')
const {ClientError} = require('utils/error-types')
const ApplicationError = require('libs/error')
const httpError = require('./error')
const mongoose = require('mongoose')


module.exports.error404 = function () {
    throw new httpError.UnknownHttpPathError()
}

/**
 * @param {Error|ApplicationError} error
 * @param {OptionalAuthorizedRequest} request
 * @param {FastifyReply} reply
 */
module.exports.handler = function (error, request, reply) {
    let status, body = {}

    if (error instanceof ClientError) {
        status = error.status
        body = error
    } else if (error instanceof ApplicationError) {
        status = ApplicationError.complianceHttpCode(error)
        body = error.toJSON()
    } else if (Object.prototype.hasOwnProperty.call(error, 'validation')) {
        status = 400
        body.message = error.validation[0].message
    } else if (error instanceof mongoose.Error.ValidationError) {
        status = 400
        body.message = error.errors[Object.keys(error.errors)[0]]?.properties?.message || "Invalid data"
    } else if (error.code === 11000) {
        status = 400
        body.message = `This ${Object.keys(error.keyValue)} already exists`
    } else if (error.code === 'LIMIT_FILE_SIZE') {
        status = 400
        body.message = 'An image of an invalid size'
    } else if (String(error.code).startsWith('FST_ERR') && 'statusCode' in error) {
        status = error.statusCode
        body = error
    } else {
        status = 500
        body.message = 'Internal server error'
    }

    if (!reply.sent) {
        reply.status(status).send(body)
    }

    logger[status >= 500 ? 'error' : 'debug'](
        error,
        {
            label: 'http-handler',
            request: {
                url: request.url,
                ip: request.headers['x-real-ip'],
                session: request.session,
                body: request.body
            }
        }
    )
}