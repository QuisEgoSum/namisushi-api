const securityService = require('./security-service')
const securityError = require('./security-error')
const cookie = require('./cookie')


/**
 * @param {AuthorizeRequest} request
 */
module.exports.authorization = async function(request) {
    request.session = await securityService.authorization(request.cookies.sessionId)
}

/**
 * @param {OptionalAuthorizedRequest} request
 */
module.exports.isAdmin = async function(request) {
    if (!request.session || !request.session.isAdmin()) {
        throw new securityError.UserRightsError()
    }
}

/**
 * @param {AuthorizeRequest} request
 */
module.exports.optionalAuthorization = async function(request) {
    request.session = await securityService.authorization(request.cookies.sessionId)
        .catch(error => {
            if (error instanceof securityError.UserAuthorizationError)
                return null
            else
                throw error
        })
}

/**
 * @param {String} cookieString
 * @returns {Promise.<UserSession>}
 * @throws
 */
module.exports.authorizationByCookieString = async function(cookieString) {
    return await securityService.authorization(cookie.parse(cookieString).sessionId)
}