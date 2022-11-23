import * as schemas from '@app/order/schemas'
import {OrderCannotBeCanceledError} from '@app/order/order-error'
import {ProductsDoNotExistError, ProductVariantsDoNotExistError} from '@app/product/product-error'
import {UserRightsError} from '@app/user/user-error'
import {DocsTags} from '@app/docs'
import {BadRequest, Created, NotFound} from '@common/schemas/response'
import type {OrderService} from '@app/order/OrderService'
import type {FastifyInstance} from 'fastify'
import {OrderNotificationService} from '@app/order/OrderNotificationService'


interface CreateRequest {
  Body: schemas.entities.CreateOrder
}


export async function create(
  fastify: FastifyInstance,
  service: OrderService,
  orderNotificationService: OrderNotificationService
) {
  return fastify
    .route<CreateRequest>(
      {
        method: 'POST',
        url: '/order',
        schema: {
          summary: 'Создать заказ',
          tags: [DocsTags.ORDER],
          body: schemas.entities.CreateOrder,
          response: {
            [201]: Created.fromEntity(schemas.entities.PopulatedOrder, 'order'),
            [400]: new BadRequest(OrderCannotBeCanceledError.schema()).bodyErrors(),
            [404]: new NotFound(ProductsDoNotExistError.schema(), ProductVariantsDoNotExistError.schema())
          }
        },
        security: {
          auth: 'OPTIONAL'
        },
        preHandler: async function validation(request) {
          if (request.body.isTestOrder && (!request.session || !request.session.isAdmin())) {
            throw new UserRightsError({message: 'Создать тестовый заказ может только администратор'})
          }
          if (request.session) {
            request.body.clientId = request.session.userId
          }
        },
        handler: async function(request, reply) {
          const order = await service.createOrder(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({order})

          await orderNotificationService.newOrder(order)
        }
      }
    )
}