/**
 * @typedef ApplicationConfig
 * @type {Object}
 * @property {Array<String>} usedEnv
 * @property {Boolean} production
 *
 * @property {Object} server
 * @property {String} server.domain
 * @property {Object} server.http
 * @property {'http'|'https'} server.http.protocol
 * @property {String} server.http.host
 * @property {Number} server.http.port
 * @property {Object} server.ws
 * @property {Number} server.ws.port
 * @property {String} server.ws.host
 * @property {Array<String>} server.allowedOrigins
 * @property {Array<String>} server.allowedHeaders
 *
 * @property {Object} telegram
 * @property {String} telegram.token
 *
 * @property {Object} database
 * @property {Object} database.credentials
 * @property {String} database.credentials.connectionString
 *
 * @property {Object} user
 * @property {Object} user.superadmin
 * @property {String} user.superadmin.id
 * @property {String} user.superadmin.email
 * @property {String} user.superadmin.password
 * @property {Object} user.session
 * @property {Object} user.session.cookie
 * @property {String} user.session.cookie.path
 * @property {String} user.session.cookie.domain
 * @property {String} user.session.cookie.sameSite
 * @property {Number} user.session.cookie.maxAge
 * @property {Number} user.session.maximum
 * @property {Object} user.avatar
 * @property {Object} user.avatar.file
 * @property {Array<String>} user.avatar.file.allowedTypes
 * @property {Number} user.avatar.file.maximumSize
 *
 * @property {Object} product
 * @property {Object} product.image
 * @property {Object} product.image.file
 * @property {Array<String>} product.image.file.allowedTypes
 * @property {Number} product.image.file.maximumSize
 *
 * @property {Object} order
 * @property {Object} order.discount
 * @property {Number} order.discount.withoutDelivery
 * @property {Number} order.discount.weekday
 *
 * @property {Object} path
 * @property {String} path.root
 * @property {String} path.src
 * @property {String} path.core
 * @property {String} path.docs
 * @property {String} path.image
 * @property {String} path.userAvatar
 * @property {String} path.productImage
 */


/**
 * @typedef ApplicationDBConfig
 * @type {Object}
 * @property {Object} telegram
 * @property {Array<Number>} adminIds
 * @property {Array<Number>} superadminIds
 */


/**
 * @typedef IConfig
 * @type {Object}
 * @property {ApplicationConfig} configEntity
 */

/**
 * @type {ConfigEntity}
 */
module.exports = {}