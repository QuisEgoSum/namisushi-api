import * as schemas from '@app/product/packages/category/schemas'
import {DocsTags} from '@app/docs'
import {Ok} from '@common/schemas/response'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import type {FastifyInstance} from 'fastify'


export async function find(fastify: FastifyInstance, service: CategoryService) {
  return fastify
    .route(
      {
        method: 'GET',
        url: '/admin/product/categories',
        schema: {
          summary: 'Получить категории',
          tags: [DocsTags.CATEGORY_ADMIN],
          response: {
            [200]: Ok.fromEntity({type: 'array', items: schemas.entities.BaseCategory}, 'categories')
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const categories = await service.findAll()

          reply
            .code(200)
            .type('application/json')
            .send({categories})
        }
      }
    )
}