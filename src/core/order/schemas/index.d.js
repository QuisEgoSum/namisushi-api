
/**
 * @typedef CreateOrderProduct
 * @type {Object}
 * @property {String} product
 * @property {Number} count
 * @property {Number} cost
 * @property {Number} weight
 */

/**
 * @typedef CreateOrderBody
 * @type {Object}
 * @property {String} address
 * @property {String} [phone]
 * @property {Array.<CreateOrderProduct>} products
 * @property {String} username
 * @property {String} [additionalInformation]
 * @property {Number} [time]
 * @property {Boolean} delivery
 * @property {Number} [deliveryCost]
 * @property {Boolean} [deliveryCalculateManually]
 */

/**
 * @typedef OrderPopulated
 * @type {Object}
 * @property {String} _id
 * @property {Number} cost
 * @property {Number} condition
 * @property {Number} weight
 * @property {String} [address]
 * @property {String} [client]
 * @property {String} [phone]
 * @property {Array.<ProductBase>} products
 * @property {String} [username]
 * @property {String} [additionalInformation]
 * @property {Number} [time]
 * @property {Boolean} delivery
 * @property {Number} [deliveryCost]
 * @property {Boolean} [deliveryCalculateManually]
 * @property {Number} createdAt
 * @property {Number} updatedAt
 */