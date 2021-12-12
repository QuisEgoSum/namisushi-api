const orderRepository = require('./order-repository')
const orderEvents = require('./order-events')
const orderUtils = require('./order-utils')
const orderError = require('./order-error')
const ORDER_ENUM = require('./order-enum')
const {userService} = require('core/user')
const productService = require('core/product').service
const ApplicationError = require('libs/error')
const COMMON_ENUM = require('common/enum')
const ObjectId = require('mongoose').Types.ObjectId
const config = require('@config')


const DISCOUNT_MODIFIER = {
    [ORDER_ENUM.ORDER_DISCOUNT.WITHOUT_DELIVERY]: config.order.discount.withoutDelivery,
    [ORDER_ENUM.ORDER_DISCOUNT.WEEKDAY]: config.order.discount.weekday
}


/**
 * @param {CreateOrderBody & {client: String}} order
 */
async function createOrder(order) {
    if (order.delivery && !order.address) {
        throw new ApplicationError.JsonSchemaValidationError(
            {
                message: 'Укажите адрес доставки',
                code: 1
            }
        )
    }

    if (order.delivery && !order.deliveryCost) {
        order.deliveryCalculateManually = true
    }

    if ('time' in order) {
        if (order.time < Date.now() + 3600000) {
            throw new orderError.LargeOrderTimeIntervalError()
        }
    }

    let phone = order.phone

    if (!phone) {
        if (!order.client) {
            throw new orderError.PhoneNumberMissingError()
        }
    
        phone = await userService.findUserPhone(order.client)
    
        if (!phone) {
            throw new orderError.PhoneNumberMissingError()
        }
    }

    const productsParameters = await productService.findProductsParameters(
        order.products.map(product => product.product)
    )

    if (productsParameters.length !== order.products.length) {
        const productIdsNotFound = order
            .products
            .filter(
                product => -1 === productsParameters.findIndex(
                    productParameters => product.product === String(productParameters._id)
                )
            )
            .map(
                product => product.product
            )

        throw new orderError.OrderProductDoesNotExistError(
            {
                productIds: productIdsNotFound
            }
        )
    }

    const orderProductsMap = new Map()

    order.products.forEach(product => orderProductsMap.set(product.product, product.count))

    let orderCost = 0
    let orderWeight = 0

    /**
     * @type {Array.<CreateOrderProduct>}
     */
    const orderProducts = []

    for (const productParameter of productsParameters) {
        const productCount = orderProductsMap.get(String(productParameter._id))
        const productCost = productParameter.cost * productCount
        const productWeight = (productParameter.weight ?? 0) * productCount

        orderProducts.push(
            {
                product: productParameter._id,
                count: productCount,
                cost: productCost,
                weight: productWeight
            }
        )

        orderCost += productCost
        orderWeight += productWeight
    }

    const discounts = []

    if (!order.delivery) {
        discounts.push(ORDER_ENUM.ORDER_DISCOUNT.WITHOUT_DELIVERY)
    }
    if (orderUtils.isWeekday()) {
        discounts.push(ORDER_ENUM.ORDER_DISCOUNT.WEEKDAY)
    }

    let discount

    if (discounts.length) {
        discount = discounts
            .sort(
                (a, b) =>  DISCOUNT_MODIFIER[a] > DISCOUNT_MODIFIER[b] ? -1 : 1
            )[0]

        const modifier = (100 - DISCOUNT_MODIFIER[discount]) / 100

        orderCost = Math.floor(orderCost * modifier)
    }

    const newOrder = await orderRepository.saveOrder(
        {
            phone: phone,
            cost: orderCost,
            weight: orderWeight,
            products: orderProducts,
            username: order.username,
            additionalInformation: order.additionalInformation,
            time: order.time,
            address: order.address,
            delivery: order.delivery,
            deliveryCost: order.deliveryCost,
            deliveryCalculateManually: order.deliveryCalculateManually,
            client: order.client,
            discount: discount
        }
    )

    const orderExpand = await orderRepository.findExpandOrderById(newOrder._id)

    orderEvents.newOrder(orderExpand)

    return orderExpand
}

/**
 * @param {String} orderId 
 */
async function getOrderById(orderId) {
    const order = await orderRepository.findExpandOrderById(orderId)

    if (!order) {
        throw new orderError.OrderNotExistsError(orderId)
    }

    return order
}

/**
 * @param {FindOrdersQuery} query
 */
async function findOrders(query) {
    const find = {}
    const sort = {}

    if (query.condition in ORDER_ENUM.CONDITION) {
        find.condition = query.condition
    }

    if (query.sortByDate in COMMON_ENUM.SORT) {
        sort.createdAt = query.sortByDate
    }

    if (query.sortByCost in COMMON_ENUM.SORT) {
        sort.cost = query.sortByCost
    }

    if (typeof query.delivery === 'boolean') {
        find.delivery = query.delivery
    }

    if (query.clientId) {
        find.client = ObjectId(query.clientId)
    }

    if (Object.keys(sort).length === 0) {
        sort.createdAt = COMMON_ENUM.SORT.DESC
    }

    const [orders, total] = await Promise.all([
        orderRepository.findOrders(
            {
                limit: query.limit,
                skip: (query.page - 1) * query.limit,
                find: find,
                sort: sort
            }
        ),
        orderRepository.countOrders(find)
    ])

    return {
        total: total,
        orders: orders
    }
}


module.exports = {
    createOrder,
    getOrderById,
    findOrders
}