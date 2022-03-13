import * as schemas from '../schemas'
import {DataList} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'


export async function find(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route(
      {
        method: 'GET',
        url: '/admin/products',
        schema: {
          summary: 'Получить все продукты',
          description: 'Запрос без пагинации',
          tags: ['Управление продуктами'],
          response: {
            [200]: new DataList(schemas.entities.BaseProduct)
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const list = await service.findAll()

          reply
            .code(200)
            .type('application/json')
            .send(list)
        }
      }
    )
}