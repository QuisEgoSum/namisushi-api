import * as schemas from '../schemas'
import {Ok} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {CategoryService} from '@app/product/packages/category/CategoryService'


export async function find(fastify: FastifyInstance, service: CategoryService) {
  return fastify
    .route(
      {
        method: 'GET',
        url: '/admin/product/categories',
        schema: {
          summary: 'Получить категории',
          tags: ['Управление категориями'],
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