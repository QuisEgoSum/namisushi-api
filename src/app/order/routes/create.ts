import * as schemas from '../schemas'
import {FastifyInstance} from 'fastify'
import {OrderService} from '@app/order/OrderService'
import {Created} from '@common/schemas/response'


interface CreateRequest {
  Body: schemas.entities.CreateOrder
}


export async function create(fastify: FastifyInstance, service: OrderService) {
  return fastify
    .route<CreateRequest>(
      {
        method: 'POST',
        url: '/order',
        schema: {
          summary: 'Создать заказ',
          tags: ['Заказ'],
          body: schemas.entities.CreateOrder,
          response: {
            [201]: new Created(schemas.entities.BaseOrder, 'order')
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const order = await service.createOrder(request.body, request.session.userId)

          reply
            .code(201)
            .type('application/json')
            .send({order})
        }
      }
    )
}