const orderHttpController = require('./order-http-controller')
const security = require('../../helpers/security')
const {schemas} = require('./schemas')


module.exports = async function(fastify) {
    fastify
        .route(
            {
                method: 'POST',
                path: '/api/order',
                schema: {
                    summary: 'Создать заказ',
                    tags: ['Order'],
                    body: schemas.CreateOrderBody,
                    response: schemas.CreateOrderResponses
                },
                onRequest: security.optionalAuthorization,
                handler: orderHttpController.createOrder
            }
        )
        .route(
            {
                method: 'GET',
                path: '/api/admin/order/:orderId',
                schema: {
                    summary: 'Получить заказ по id для администратора',
                    tags: ['Order'],
                    params: schemas.GetOrderByIdParams,
                    response: schemas.GetOrderByIDResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: orderHttpController.getOrderById
            }
        )
        .route(
            {
                method: 'GET',
                path: '/api/admin/orders',
                schema: {
                    summary: 'Получить список заказов для администратора',
                    tags: ['Order'],
                    query: schemas.GetOrdersListAdminQuery,
                    response: schemas.GetOrdersListResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: orderHttpController.getOrdersAdmin
            }
        )
}