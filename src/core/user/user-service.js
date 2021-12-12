const userRepository = require('./user-repository')
const {service: authService} = require('./packages/auth')
const bcrypt = require('bcrypt')
const userError = require('./user-error')
const errorUtil = require('utils/error')
const {deleteFileFromRootDir} = require('utils/fs')
const config = require('@config')


/**
 * @param {UserCredentials} credentials
 * @returns {Promise<{sessionId: String, user: UserModel}>}
 * @throws {BadUserCredentials}
 */
async function signin(credentials) {
    const user = await userRepository.findUserByEmail(credentials.email)

    if (!user) {
        throw new userError.BadUserCredentialsError()
    }

    if (!await bcrypt.compare(credentials.password, user.hash)) {
        throw new userError.BadUserCredentialsError()
    }

    delete user.hash

    return {
        sessionId: await authService.createSession(user._id),
        user: user
    }
}

/**
 * @param {SignupUser|CreateUser} user
 * @returns {Promise<UserModel>}
 */
async function signup(user) {
    try {
        user.hash = await bcrypt.hash(user.password, 10)

        delete user.password

        const savedUser = await userRepository.save(user)

        delete savedUser.hash

        return savedUser
    } catch (error) {
        if (errorUtil.isUniqueMongoError(error)) {
            throw new userError.UserWithEmailExistsError()
        }
        throw error
    }
}

/**
 * @param {String|ObjectId} userId 
 */
async function getUserById(userId) {
    const user = await userRepository.findUserById(userId)

    if (!user) {
        throw new userError.UserNotExistsError()
    }

    return user
}

/**
 * @param {String} userId
 * @param {UpdateUserMe|UpdateUser} data
 * @param {FormDataPostFile} file
 * @returns {Promise.<any>}
 */
async function updateUser(userId, data, file) {
    if (file) {
        data.avatar = `/image/user/avatar/${file.filename}`
    }

    /**
     * TODO: Обновлять пароль отдельным эндпоинтом
     */
    if (data.password) {
        data.hash = await bcrypt.hash(data.password, 10)
        delete data.password
    }

    const user = await userRepository.updateUserAndReturnAvatar(userId, data)

    if (!user) {
        throw new userError.UserNotExistsError()
    }

    if (!user.avatar.includes('#random=') && Object.prototype.hasOwnProperty.call(data, 'avatar')) {
        deleteFileFromRootDir('/image/user/avatar/' + user.avatar.split('/').pop())
    }

    return userRepository.findUserById(userId)
}

/**
 * @param {UsersListQuery} query
 */
async function getUsersList(query) {
    /**
     * @type {GetUsersListOptions}
     */
    const options = {
        sort: -1,
        limit: query.limit,
        page: (query.page - 1) * query.limit,
        find: {}
    }

    if (query.sort === 'ASC')
        options.sort = 1

    const strict = !!query.strict

    if (!strict && (query.name || query.email || query.phone || query.role))
        options.find.$or = []

    if (query.name) {
        if (strict) {
            options.find.name = new RegExp(query.name)
        } else {
            options.find.$or.push({name: new RegExp(query.name)})
        }
    }

    if (query.email) {
        if (strict) {
            options.find.email = new RegExp(query.email)
        } else {
            options.find.$or.push({email: new RegExp(query.email)})
        }
    }

    if (query.phone) {
        if (strict) {
            options.find.phone = new RegExp(query.phone)
        } else {
            options.find.$or.push({phone: new RegExp(query.phone)})
        }
    }

    if (query.role) {
        if (strict) {
            options.find.role = query.role
        } else {
            options.find.$or.push({role: query.role})
        }
    }

    if (options.find.$or && options.find.$or.length === 1) {
        const [[key, value]] = Object.entries(options.find.$or[0])
        options.find[key] = value
        delete options.find.$or
    }

    const [users, total] = await Promise.all([
        userRepository.findUsers(options),
        userRepository.countUsers(options.find)
    ])

    return {
        users,
        total
    }
}

/**
 * @param {String} userId 
 * @returns {Promise.<void>}
 */
async function deleteUser(userId) {
    if (userId === config.user.superadmin.id) {
        throw new userError.UserCannotBeDeletedError()
    }

    const user = await userRepository.deleteUser(userId)

    if (!user) {
        throw new userError.UserNotExistsError()
    }

    if (!user.avatar.includes('#random=')) {
        deleteFileFromRootDir('/image/user/avatar/' + user.avatar.split('/').pop())
    }
}

/**
 * @param {String} userId 
 * @returns {Promise.<String>}
 */
async function findUserPhone(userId) {
    return userRepository.findUserPhone(userId)
}


module.exports = {
    signin,
    signup,
    updateUser,
    getUserById,
    getUsersList,
    deleteUser,
    findUserPhone
}