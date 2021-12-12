/**
 * @typedef HttpRequestD
 * @type {Object}
 * @property {Object<string, String>} cookies
 */
/**
 * @typedef {FastifyRequest & HttpRequestD} HttpRequest
 */

/**
 * @callback FastifyPluginCookieCookieSerializeOptionsEncode
 * @param {String} val
 * @returns {String}
 */
/**
 * @typedef FastifyPluginCookieCookieSerializeOptions
 * @type {Object}
 * @property {String} [domain]
 * @property {FastifyPluginCookieCookieSerializeOptionsEncode} [encode]
 * @property {Date} [expires]
 * @property {Boolean} [httpOnly]
 * @property {Number} [maxAge]
 * @property {String} [path]
 * @property {Boolean|'lax'|'strict'|'none'} [sameSite]
 * @property {Boolean} [secure]
 * @property {Boolean} [signed]
 */
/**
 * @callback FastifyPluginCookieSetCookie
 * @param {String} name
 * @param {String} value
 * @param {FastifyPluginCookieCookieSerializeOptions} [options]
 * @returns {FastifyReply}
 */
/**
 * @callback FastifyPluginCookieClearCookie
 * @param {String} name
 * @param {FastifyPluginCookieCookieSerializeOptions} [options]
 * @returns {FastifyReply}
 */
/**
 * @callback FastifyPluginCookieUnsignCookie
 * @param {String} value
 * @returns {String|false}
 */
/**
 * @typedef HttpReplyD
 * @type {Object}
 * @property {FastifyPluginCookieSetCookie} setCookie
 * @property {FastifyPluginCookieClearCookie} clearCookie
 * @property {FastifyPluginCookieUnsignCookie} unsignCookie
 */
/**
 * @typedef {FastifyReply & HttpReplyD} HttpReply
 */