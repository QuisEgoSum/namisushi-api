

/**
 * @typedef CreateOrderProduct
 * @type {Object}
 * @property {String} product
 * @property {Number} count
 */

/**
 * @typedef CreateOrder
 * @type {Object}
 * @property {String} address
 * @property {String} [phone]
 * @property {Array.<CreateOrderProduct>} products
 * @property {String} username
 * @property {String} [additionalInformation]
 * @property {Number} [time]
 * @property {Boolean} delivery
 * @property {Number} [deliveryCost]
 * @property {String} client
 * @property {Boolean} [deliveryCalculateManually]
 */

/**
 * @typedef FindOrdersQuery
 * @type {Object}
 * @property {Number} limit
 * @property {Number} page
 * @property {ORDER_CONDITION_VALUE} [condition]
 * @property {SORT_VALUE} [sortByCost]
 * @property {SORT_VALUE} [sortByDate]
 * @property {Boolean} [delivery]
 * @property {String} [clientId]
 */


module.exports = null