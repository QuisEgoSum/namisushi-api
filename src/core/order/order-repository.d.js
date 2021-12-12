/**
 * @typedef NewOrder
 * @type {Object}
 * @property {String} _id
 * @property {Number} weight
 * @property {Number} cost
 * @property {0} condition
 * @property {String} [client]
 * @property {String} phone
 * @property {String} address
 * @property {String} username
 * @property {String} [additionalInformation]
 * @property {Number} [time]
 * @property {Boolean} [delivery]
 * @property {Number} [deliveryCost]
 * @property {Boolean} [deliveryCalculateManually]
 * @property {Number} updatedAt
 * @property {Number} createdAt
 */

/**
 * @typedef CreateOrderProduct
 * @type {Object}
 * @property {String} product
 * @property {Number} count
 * @property {Number} cost
 * @property {Number} weight
 */

/**
 * @typedef CreateOrder
 * @type {Object}
 * @property {Number} weight
 * @property {Number} cost
 * @property {String} address
 * @property {String} phone
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
 * @typedef GetOrdersQuery
 * @type {Object}
 * @property {Number} limit
 * @property {Number} skip
 * @property {Object} find
 * @property {Object} sort
 */

/**
 * @typedef OrderListItem
 * @type {Object}
 * @property {String} _id
 * @property {Number} weight
 * @property {Number} cost
 * @property {ORDER_CONDITION_VALUE} condition
 * @property {String} [client]
 * @property {String} phone
 * @property {String} address
 * @property {String} username
 * @property {String} [additionalInformation]
 * @property {Number} [time]
 * @property {Boolean} [delivery]
 * @property {Number} [deliveryCost]
 * @property {Boolean} [deliveryCalculateManually]
 * @property {Number} updatedAt
 * @property {Number} createdAt
 */


module.exports = {}