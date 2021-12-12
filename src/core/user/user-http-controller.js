const userService = require('./user-service')
const {service: authService} = require('./packages/auth')
const config = require('@config')
const {deleteFile} = require('utils/fs')



/**
 * @param {SigninRequest} request
 * @param {HttpReply} reply
 */
module.exports.signin = async function(request, reply) {
    const {sessionId, user} = await userService.signin(request.body)

    /**
     * @type {FastifyPluginCookieCookieSerializeOptions}
     */
    const cookieOptions = {
        path: config.user.session.cookie.path,
        domain: config.user.session.cookie.domain,
        sameSite: config.user.session.cookie.sameSite,
        maxAge: config.user.session.cookie.maxAge,
        expires: new Date(Date.now() + config.user.session.cookie.maxAge)
    }

    if (!config.production) {
        if (request.headers['x-real-host'] === 'localhost') {
            cookieOptions.domain = 'localhost'
        }
    }

    reply
        .setCookie('sessionId', sessionId, cookieOptions)
        .status(200)
        .type('application/json')
        .send(
            {
                user: user
            }
        )
}

/**
 * @param {SignoutRequest} request
 * @param {HttpReply} reply
 */
module.exports.signout = async function(request, reply) {
    await authService.removeSession(request.session.sessionId)

    reply
        .setCookie('sessionId', '', {path: '/'})
        .status(200)
        .type('application/json')
        .send(
            {
                message: 'Вы вышли из своего аккаунта'
            }
        )
}

/**
 * @param {SignoutAllExceptRequest} request
 * @param {HttpReply} reply
 */
module.exports.signoutAllExcept = async function(request, reply) {
    await authService.removeUserSessionsExcept(request.session.userId, request.session.sessionId)

    reply
        .status(200)
        .type('application/json')
        .send(
            {
                message: 'Удалены все сессии кроме текущей'
            }
        )
}

/**
 * @param {SignupRequest} request
 * @param {HttpReply} reply
 */
module.exports.signup = async function(request, reply) {
    const user = await userService.signup(request.body)

    const sessionId = await authService.createSession(user._id)

    reply
        .setCookie(
            'sessionId',
            sessionId,
            {
                path: config.user.session.cookie.path,
                domain: config.user.session.cookie.domain,
                sameSite: config.user.session.cookie.sameSite,
                maxAge: config.user.session.cookie.maxAge,
                expires: new Date(Date.now() + config.user.session.cookie.maxAge)
            }
        )
        .status(201)
        .type('application/json')
        .send(
            {
                user: user
            }
        )
}

/**
 * @param {CreateUserRequest} request
 * @param {HttpReply} reply
 */
module.exports.createUser = async function(request, reply) {
    const user = await userService.signup(request.body)

    reply
        .status(201)
        .type('application/json')
        .send(
            {
                user: user
            }
        )
}

/**
 * @param {GetUserRequest} request
 * @param {HttpReply} reply
 */
module.exports.getUser = async function(request, reply) {
    const user = await userService.getUserById(request.params.id || request.session.userId)

    reply
        .status(200)
        .type('application/json')
        .send(
            {
                user: user
            }
        )
}

/**
 * @param {UpdateUserMeRequest|UpdateUserRequest} request
 * @param {HttpReply} reply
 */
module.exports.updateUser = async function(request, reply) {
    try {
        const user = await userService.updateUser(request.params.userId || request.session.userId, request.body, request.files.avatar[0])

        reply
            .status(200)
            .type('application/json')
            .send(
                {
                    user: user
                }
            )
    } catch(error) {
        request.files.avatar.forEach(file => deleteFile(file.filepath))
        throw error
    }
}

/**
 * @param {GetUsersRequest} request
 * @param {HttpReply} reply
 */
module.exports.getUsers = async function(request, reply) {
    const response = await userService.getUsersList(request.query)

    reply
        .status(200)
        .type('application/json')
        .send(response)
}

/**
 * @param {DeleteUserRequest} request
 * @param {HttpReply} reply
 * @return {Promise<void>}
 */
module.exports.deleteUser = async function(request, reply) {
    await userService.deleteUser(request.params.userId)
    await authService.removeUserSessions(request.params.userId)

    reply
        .status(200)
        .type('application/json')
        .send(
            {
                message: 'Пользователь удалён'
            }
        )
}