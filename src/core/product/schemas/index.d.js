
/**
 * @typedef CreateProduct
 * @type {Object}
 * @property {Boolean} [show]
 * @property {String} title
 * @property {Number} cost
 * @property {String} [description]
 * @property {Array.<String>} [ingredients]
 * @property {Number} [weight]
 * @property {Array.<String>} [tags]
 * @property {Array.<String>} [categories]
 */

/**
 * @typedef ProductsQuery
 * @type {Object}
 * @property {String} [category]
 * @property {Number} limit
 * @property {Number} page
 * @property {'ASC'|'DESC'} sortByDate
 */

/**
 * @typedef UpdateProduct
 * @type {Object}
 * @property {Boolean} [show]
 * @property {String} title
 * @property {Number} cost
 * @property {String} [description]
 * @property {Array.<String>} [ingredients]
 * @property {Number} [weight]
 * @property {Array.<String>} [tags]
 * @property {Array.<String>} [categories]
 * @property {Array.<String>} [images]
 */

/**
 * @typedef ProductBase
 * @type {Object}
 * @property {String} _id
 * @property {String} title
 * @property {String} [description]
 * @property {Array.<String>} [ingredients]
 * @property {Number} cost
 * @property {Number} [weight]
 * @property {Array.<String>} [images]
 * @property {Number} createdAt
 * @property {Number} updatedAt
 */