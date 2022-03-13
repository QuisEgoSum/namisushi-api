import * as schemas from '../schemas'
import {EntityDoesNotExistError, EntityExistsError} from '@error'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {CategoryService} from '@app/product/packages/category/CategoryService'


interface UpdateRequest {
  Params: {
    categoryId: string
  }
  Body: schemas.entities.CreateCategory
}


export async function update(fastify: FastifyInstance, service: CategoryService) {
  return fastify
    .route<UpdateRequest>(
      {
        method: 'PATCH',
        url: '/admin/product/category/:categoryId',
        schema: {
          summary: 'Обновить категорию',
          tags: ['Управление категориями'],
          params: {
            categoryId: schemas.properties._id
          },
          body: schemas.entities.CreateCategory,
          response: {
            [200]: new Ok(schemas.entities.BaseCategory, 'category'),
            [400]: new BadRequest(EntityExistsError.schema()).bodyErrors(),
            [404]: new NotFound(EntityDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const category = await service.findByIdAndUpdate(request.params.categoryId, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({category})
        }
      }
    )
}