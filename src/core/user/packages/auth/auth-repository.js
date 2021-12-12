const Session = require('./UserSessionModel')
const {ObjectId} = require('mongoose').Types


/**
 * @param {ObjectId|String} userId 
 * @returns {Promise<UserSessionFull>}
 */
const createSession = userId => new Session({user: userId})
    .save()
    .then(session => session.toJSON())

/**
 * @param {ObjectId|String} sessionId 
 * @returns {Promise.<{n: Number, ok: Number, deletedCount: Number}>}
 */
const removeSession = sessionId => Session
    .deleteOne({_id: sessionId})

/**
 * @param {ObjectId|String} userId 
 * @returns {Promise.<{n: Number, ok: Number, deletedCount: Number}>}
 */
const removeUserSessions = userId => Session
    .deleteMany({user: ObjectId(userId)})

/**
 * @param {ObjectId|String} userId 
 * @param {ObjectId|String} sessionId 
 * @returns {Promise.<{n: Number, ok: Number, deletedCount: Number}>}
 */
const removeUserSessionsExcept = (userId, sessionId) => Session
    .deleteMany({user: ObjectId(userId), _id: {$ne: sessionId}})

/**
 * @param {ObjectId|String} sessionId 
 * @returns {Promise.<UserSessionExpand>}
 */
const findSessionAndUpdateExpireDate = sessionId => Session
    .findByIdAndUpdate(sessionId, {updatedAt: Date.now()})
    .populate({path: 'user', model: 'User', select: {_id: 1, role: 1}})


module.exports = {
    createSession,
    removeSession,
    removeUserSessions,
    removeUserSessionsExcept,
    findSessionAndUpdateExpireDate
}