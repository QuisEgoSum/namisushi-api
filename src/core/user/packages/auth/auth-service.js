const authRepository = require('./auth-repository')
const authError = require('./auth-error')


/**
 * @param {String} userId
 * @returns {Promise.<String>}
 */
async function createSession(userId) {
    return (await authRepository.createSession(userId))._id
}

/**
 * @param {String} sessionId
 */
async function removeSession(sessionId) {
    return authRepository.removeSession(sessionId)
}

/**
 * @param {String} userId
 * @param {String} exceptSessionId
 */
async function removeUserSessionsExcept(userId, exceptSessionId) {
    return authRepository.removeUserSessionsExcept(userId, exceptSessionId)
}

/**
 * @param {String} userId
 */
async function removeUserSessions(userId) {
    return authRepository.removeUserSessions(userId)
}

/**
 * @param {String} sessionId
 * @returns {Promise.<UserSessionExpand>}
 * @throws {Unauthorized}
 */
async function findUserBySessionId(sessionId) {
    const session = await authRepository.findSessionAndUpdateExpireDate(sessionId)

    if (!session) {
        throw new authError.SessionNotExistsError(sessionId)
    }

    return session
}


module.exports = {
    removeSession,
    removeUserSessionsExcept,
    removeUserSessions,
    findUserBySessionId,
    createSession
}