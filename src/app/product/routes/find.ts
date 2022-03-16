import * as schemas from '../schemas'
import {Ok} from '@common/schemas/response'
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
            [200]: Ok.fromEntity({type: 'array', items: schemas.entities.BaseProduct}, 'products')
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const products = await service.findAll()

          reply
            .code(200)
            .type('application/json')
            .send({products})
        }
      }
    )
}