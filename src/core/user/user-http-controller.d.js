/**
 * @typedef SigninRequestD
 * @type {Object}
 * @property {UserCredentials} body
 */
/**
 * @typedef {HttpRequest & SigninRequestD} SigninRequest
 */

/**
 * @typedef {AuthorizedRequest} SignoutRequest
 */

/**
 * @typedef {AuthorizedRequest} SignoutAllExceptRequest
 */

/**
 * @typedef SignupRequestD
 * @type {Object}
 * @property {SignupUser} body
 */

/**
 * @typedef {HttpRequest & SignupRequestD} SignupRequest
 */

/**
 * @typedef CreateUserRequestD
 * @type {Object}
 * @property {CreateUser} body
 */
/**
 * @typedef {AuthorizedRequest & CreateUserRequestD} CreateUserRequest
 */

/**
 * @typedef GetUserRequestD
 * @type {Object}
 * @property {Object} params
 * @property {String} [params.id]
 */
/**
 * @typedef {AuthorizedRequest & GetUserRequestD} GetUserRequest
 */

/**
 * @typedef UpdateUserMeRequestD
 * @type {Object}
 * @property {FormDataPostFiles} files
 * @property {UpdateUserMe} body
 */
/**
 * @typedef {AuthorizedRequest & UpdateUserMeRequestD} UpdateUserMeRequest
 */

/**
 * @typedef UpdateUserRequestD
 * @type {Object}
 * @property {FormDataPostFiles} files
 * @property {UpdateUser} body
 */
/**
 * @typedef {AuthorizedRequest & UpdateUserMeRequestD} UpdateUserRequest
 */

/**
 * @typedef GetUsersRequestD
 * @type {Object}
 * @property {UsersListQuery} query
 */
/**
 * @typedef {AuthorizedRequest & GetUsersRequestD} GetUsersRequest
 */

/**
 * @typedef DeleteUserRequestD
 * @type {Object}
 * @property {Object} params
 * @property {String} [params.userId]
 */
/**
 * @typedef {AuthorizedRequest & DeleteUserRequestD} DeleteUserRequest
 */