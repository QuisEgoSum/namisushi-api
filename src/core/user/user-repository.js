const User = require('./UserModel')
const {ObjectId} = require('mongoose').Types


/**
 * @param {SignupUser|CreateUser & {hash: String}} user
 * @returns {Promise.<UserFull & UserUnselected>}
 */
const save = user => new User(user)
    .save()
    .then(user => user.toJSON())

/**
 * @param {GetUsersListOptions} options
 * @returns {Promise.<User>}
 */
const findUsers = options => User
    .find(options.find)
    .select({
        _id: 1,
        name: 1,
        role: 1,
        email: 1,
        avatar: 1,
        createdAt: 1,
        updatedAt: 1,
        phone: 1
    })
    .sort({createdAt: options.sort})
    .skip(options.page)
    .limit(options.limit)
    .lean()

/**
 * @param {String} userId
 * @returns {Promise.<UserFull>}
 */
const findUserById = userId => User
    .findById(ObjectId(userId))
    .lean()

/**
 * @param {String} userId
 * @param {UpdateUserMe} update
 * @returns {Promise.<{avatar: String, _id: ObjectId}|null>}
 */
const updateUserAndReturnAvatar = (userId, update) => User
    .findByIdAndUpdate(ObjectId(userId), update)
    .select({avatar: 1})
    .lean()

/**
 * @param {Object} query
 * @returns {Promise.<Number>}
 */
const countUsers = query => User
    .countDocuments(query)

/**
 * @param {ObjectId|String} userId 
 * @returns {Promise.<{_id: ObjectId, avatar: String}|null>}
 */
const deleteUser = userId => User
    .findByIdAndDelete(ObjectId(userId))
    .select({avatar: 1})
    .lean()

/**
 * @param {String} email 
 * @returns {Promise.<UserModel & {hash: String}>}
 */
const findUserByEmail = email => User
    .findOne({email})
    .select('+hash')
    .lean()

/**
 * @param {String} userId
 * @returns {Promise.<String>}
 */
const findUserPhone = userId => User
    .findById(ObjectId(userId))
    .select(
        {
            phone: 1
        }
    )
    .lean()
    .then(user => user?.phone || null)


module.exports = {
    save,
    findUsers,
    findUserById,
    updateUserAndReturnAvatar,
    countUsers,
    deleteUser,
    findUserByEmail,
    findUserPhone
}