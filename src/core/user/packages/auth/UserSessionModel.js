const {Schema, model} = require('mongoose')
const {v4} = require('uuid')


/**
 * @typedef UserSessionBase
 * @type {Object}
 * @property {String} _id
 * @property {String} user
 */

/**
 * @typedef UserSessionExpand
 * @type {Object}
 * @property {String} _id
 * @property {Object} user
 * @property {String} user._id
 * @property {USER_ROLE_VALUE} user.role
 */

/**
 * @typedef UserSessionFull
 * @type {Object}
 * @property {String} _id
 * @property {String} user
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


const UserSessionModel = new Schema(
    {
        _id: {
            type: String,
            default: v4
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Number,
            select: false
        },
        updatedAt: {
            type: Number,
            select: false,
            expires: 5184000
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)


UserSessionModel.index({user: 1})
UserSessionModel.index({_id: 1, user: 1})


module.exports = model('Session', UserSessionModel, 'user_sessions')
