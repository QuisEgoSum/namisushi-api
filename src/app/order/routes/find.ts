import * as schemas from '@app/order/schemas'
import {DocsTags} from '@app/docs'
import {DataList} from '@common/schemas/response'
import type {OrderService} from '@app/order/OrderService'
import type {FastifyInstance} from 'fastify'


interface FindRequest {
  Querystring: schemas.entities.FindQuery
}


export async function find(fastify: FastifyInstance, service: OrderService) {
  return fastify
    .route<FindRequest>(
      {
        url: '/user/orders',
        method: 'GET',
        schema: {
          summary: 'Получить список заказов',
          tags: [DocsTags.ORDER],
          query: schemas.entities.FindQuery,
          response: {
            [200]: new DataList(schemas.entities.PreviewOrder)
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const orders = await service.find({
            ...request.query,
            fClientId: request.session.userId.toHexString()
          })

          reply
            .code(200)
            .type('application/json')
            .send(orders)
        }
      }
    )
}