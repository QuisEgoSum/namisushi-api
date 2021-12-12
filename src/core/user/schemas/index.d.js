

/**
 * @typedef UserCredentials
 * @type {Object}
 * @property {String} email
 * @property {String} password
 */

/**
 * @typedef UpdateUserPart
 * @type {Object}
 * @property {Boolean} [emailVerified]
 * @property {String} [email]
 * @property {USER_ROLE_VALUE} role
 */

/**
 * @typedef {UpdateUserMe & UpdateUserPart} UpdateUser
 */



/**
 * @typedef UpdateUserMe
 * @type {Object}
 * @property {String} [password]
 * @property {String} [firstName]
 * @property {String} [lastName]
 * @property {String} [avatar]
 * @property {String} [phone]
 * @property {{address: String, alias: String}[]} [addresses]
 */



/**
 * @typedef SignupUser
 * @type {Object}
 * @property {String} email
 * @property {String} password
 * @property {String} [phone]
 * @property {String} firstName
 * @property {String} lastName
 */

/**
 * @typedef UsersListQuery
 * @type {Object}
 * @property {Number} page
 * @property {Number} limit
 * @property {'ASC'|'DESC'} sort
 * @property {String} [name]
 * @property {String} [email]
 * @property {String} [phone]
 * @property {String} [role]
 * @property {any} [strict]
 */


/**
 * @typedef _CreateUser
 * @type {Object}
 * @property {USER_ROLE_VALUE} role
 */

/**
 * @typedef {SignupUser & _CreateUser} CreateUser
 */