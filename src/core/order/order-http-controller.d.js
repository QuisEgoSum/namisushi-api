/**
 * @typedef CreateOrderRequestD
 * @type {Object}
 * @property {CreateOrderBody} body
 */
/**
 * @typedef {FastifyRequest & CreateOrderRequestD & OptionalAuthorizedRequest} CreateOrderRequest
 */

/**
 * @typedef GetOrderByIdRequestD
 * @type {Object}
 * @property {GetOrderByIdParams} params
 */
/**
 * @typedef {FastifyRequest & GetOrderByIdRequestD & AuthorizedRequest} GetOrderByIdRequest
 */

/**
 * @typedef GetOrdersAdminRequestD
 * @type {Object}
 * @property {GetOrdersAdminQuery} query
 */
/**
 * @typedef {FastifyRequest & GetOrdersAdminRequestD & AuthorizedRequest} GetOrdersAdminRequest
 */


module.exports = {}