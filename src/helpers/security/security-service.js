const User = require('core/user')
const UserSession = require('./UserSession')
const securityError = require('./security-error')


/**
 * @param {String} sessionId
 * @return {Promise<UserSession>}
 * @throws {UserAuthorizationError}
 */
async function authorization(sessionId) {
    return User.auth.service
        .findUserBySessionId(sessionId)
        .then(user => new UserSession(user))
        .catch(error => {
            if (error instanceof User.auth.Error.SessionNotExistsError) {
                throw new securityError.UserAuthorizationError(sessionId)
            } else {
                throw  error
            }
        })
}


module.exports = {
    authorization
}