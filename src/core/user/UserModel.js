const {Schema, model} = require('mongoose')
const USER_ENUM = require('./user-enum')
const {v4} = require('uuid')


/**
 * @typedef UserModel
 * @type {Object}
 * @property {String} _id
 * @property {String} name
 * @property {String} phone
 * @property {String} avatar
 * @property {USER_ROLE_VALUE} role
 * @property {String} email
 * @property {Boolean} emailVerified
 * @property {Date} createdAt
 * @property {String} updatedAt
 */

/**
 * @typedef UserAddress
 * @type {Object}
 * @property {String} address
 * @property {String} [alias]
 */

/**
 * @typedef UserUnselected
 * @type {Object}
 * @property {String} hash
 */

/**
 * @typedef {UserModel & {addresses: UserAddress[]}} UserFull
 */


const UserModel = new Schema(
  {
        name: {
            type: String
        },
        phone: {
            type: String
        },
        addresses: {
            type: Array,
            items: {
                type: Object,
                properties: {
                    address: {
                        type: String
                    },
                    alias: {
                        type: String
                    }
                }
            },
            default: []
        },
        avatar: {
            type: String,
            default: () => `#random=${v4()}`
        },
        role: {
            type: String,
            default: USER_ENUM.USER_ROLE.USER,
            enum: USER_ENUM.USER_ROLE.values()
        },
        email: {
            type: String,
            required: true
        },
        hash: {
            type: String,
            select: false
        },
        createdAt: {
            type: Number
        },
        updatedAt: {
            type: Number
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)


UserModel.index({email: 1}, {unique: true})


module.exports = model('User', UserModel, 'users')