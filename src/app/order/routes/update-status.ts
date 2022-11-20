import * as schemas from '../schemas'
import {FastifyInstance} from 'fastify'
import {OrderService} from '@app/order/OrderService'
import {DocsTags} from '@app/docs'
import {NoContent} from '@common/schemas/response'


interface UpdateStatusRequest {
  Params: {
    number: number
  }
  Body: schemas.entities.UpdateCondition
  Querystring: {
    isTestOrder: boolean
  }
}


export async function updateStatus(fastify: FastifyInstance, service: OrderService) {
  return fastify
    .route<UpdateStatusRequest>(
      {
        url: '/admin/order/:number/condition',
        method: 'PATCH',
        schema: {
          summary: 'Изменить статус заказа',
          tags: [DocsTags.ORDER_ADMIN],
          params: {
            number: schemas.properties.number
          },
          query: {
            isTestOrder: schemas.properties.isTestOrder
          },
          body: schemas.entities.UpdateCondition,
          response: {
            [204]: new NoContent()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.updateConditionByNumber(request.params.number, request.body.condition, request.query.isTestOrder)

          reply
            .code(204)
            .send()
        }
      }
    )
}