const {ClientError} = require('../../../utils/error-types')
const logger = require('../../../utils/logger')


/**
 * 
 * @param {*} error 
 * @param {import('socket.io').Socket} socket 
 */
module.exports.errorHandler = function(error, socket) {
    if (error instanceof ClientError) {
        socket.emit('errors', {...error, status: error.status})
        logger.debug(error)
    } else {
        socket.emit('errors', {message: 'Internal server error', status: 500})
        logger.error(error)
    }
}