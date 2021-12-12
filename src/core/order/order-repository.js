const Order = require('./OrderModel')
const {ObjectId} = require('mongoose').Types


/**
 * @param {CreateOrder} order
 * @returns {Promise<NewOrder>}
 */
const saveOrder = order => new Order(order)
    .save()
    .then(order => order.toJSON())

/**
 * @param {String} orderId 
 * @returns 
 */
const findExpandOrderById = orderId => Order
    .findById(ObjectId(orderId))
    .populate(
        {
            path: 'products.product',
            model: 'Product',
            select: '-tags -categories -show'
        }
    )

/**
 * @param {GetOrdersQuery} query
 * @returns {Promise.<Array.<OrderListItem>>}
 */
const findOrders = query => Order
    .find(query.find)
    .sort(query.sort)
    .skip(query.skip)
    .limit(query.limit)
    .select('-products')
    .lean()

/**
 * @param {Object} findQuery 
 * @returns {Promise.<Number>}
 */
//@ts-ignore
const countOrders = findQuery => Order
    .countDocuments(findQuery)



module.exports = {
    saveOrder,
    findExpandOrderById,
    findOrders,
    countOrders
}