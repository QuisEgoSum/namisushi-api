const orderService = require('./order-service')


/**
 * @param {CreateOrderRequest} request
 * @param {FastifyReply} reply
 */
module.exports.createOrder = async function(request, reply) {
    const order = await orderService.createOrder(
        {
            address: request.body.address,
            phone: request.body.phone,
            products: request.body.products,
            username: request.body.username,
            additionalInformation: request.body.additionalInformation,
            time: request.body.time,
            delivery: request.body.delivery,
            deliveryCost: request.body.deliveryCost,
            deliveryCalculateManually: request.body.deliveryCalculateManually,
            client: request.session?.userId
        }
    )

    reply
        .status(201)
        .type('application/json')
        .send(
            {
                message: 'Заказ создан',
                order: order
            }
        )
}

/**
 * @param {GetOrderByIdRequest} request
 * @param {FastifyReply} reply
 */
module.exports.getOrderById = async function(request, reply) {
    const order = await orderService.getOrderById(request.params.orderId)

    reply
        .status(200)
        .type('application/json')
        .send(
            {
                order: order
            }
        )
}

/**
 * @param {GetOrdersAdminRequest} request
 * @param {import('fastify').FastifyReply} reply 
 */
module.exports.getOrdersAdmin = async function(request, reply) {
    const response = await orderService.findOrders(
        request.query
    )

    reply
        .status(200)
        .type('application/json')
        .send(response)
}