import * as schemas from '@app/order/schemas'
import {OrderDoesNotExistError} from '@app/order/order-error'
import {DocsTags} from '@app/docs'
import {NotFound, Ok} from '@common/schemas/response'
import type {OrderService} from '@app/order/OrderService'
import type {FastifyInstance} from 'fastify'


interface FindByNumberRequest {
  Params: {
    number: number
  }
}


export async function findByNumber(fastify: FastifyInstance, service: OrderService) {
  return fastify
    .route<FindByNumberRequest>(
      {
        url: '/user/order/:number',
        method: 'GET',
        schema: {
          summary: 'Получить заказ пользователя по номеру',
          tags: [DocsTags.ORDER],
          params: {
            number: schemas.properties.number
          },
          response: {
            [200]: Ok.fromEntity(schemas.entities.PopulatedOrder, 'order'),
            [404]: new NotFound(OrderDoesNotExistError.schema())
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const order = await service.findByNumber(request.params.number, request.session.userId)

          reply
            .code(200)
            .type('application/json')
            .send({order})
        }
      }
    )
}