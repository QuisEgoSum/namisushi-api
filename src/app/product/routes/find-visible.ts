import {Ok} from '@common/schemas/response'
import * as schemas from '../schemas'
import * as categorySchemas from '@app/product/packages/category/schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'


export async function findVisible(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route(
      {
        method: 'GET',
        url: '/products',
        schema: {
          summary: 'Получить продукты',
          tags: ['Продукт'],
          response: {
            [200]: new Ok(
              {
                categories: {
                  type: 'array',
                  items: categorySchemas.entities.BaseCategory
                },
                products: {
                  type: 'array',
                  items: schemas.entities.BaseProduct
                }
              },
              ['categories', 'products']
            )
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          reply
            .code(200)
            .type('application/json')
            .send(service.findVisible())
        }
      }
    )
}