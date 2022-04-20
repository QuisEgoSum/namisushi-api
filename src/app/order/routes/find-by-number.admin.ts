import * as schemas from '@app/order/schemas'
import {OrderDoesNotExistError} from '@app/order/order-error'
import {DocsTags} from '@app/docs'
import {NotFound, Ok} from '@common/schemas/response'
import type {OrderService} from '@app/order/OrderService'
import type {FastifyInstance} from 'fastify'


interface FindByNumberAdminRequest {
  Params: {
    number: number
  }
  Querystring: {
    isTestOrder: boolean
  }
}


export async function findByNumberAdmin(fastify: FastifyInstance, service: OrderService) {
  return fastify
    .route<FindByNumberAdminRequest>(
      {
        url: '/admin/order/:number',
        method: 'GET',
        schema: {
          summary: 'Получить заказ по номеру',
          tags: [DocsTags.ORDER_ADMIN],
          params: {
            number: schemas.properties.number
          },
          query: {
            isTestOrder: schemas.properties.isTestOrder
          },
          response: {
            [200]: Ok.fromEntity(schemas.entities.PopulatedOrder, 'order'),
            [404]: new NotFound(OrderDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const order = await service.findByNumber(request.params.number, request.query.isTestOrder)

          reply
            .code(200)
            .type('application/json')
            .send({order})
        }
      }
    )
}