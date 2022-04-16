import * as schemas from '../schemas'
import {EntityExistsError} from '@error'
import {BadRequest, Created} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {CategoryService} from '@app/product/packages/category/CategoryService'


interface CreateRequest {
  Body: schemas.entities.CreateCategory
}


export async function create(fastify: FastifyInstance, service: CategoryService) {
  return fastify
    .route<CreateRequest>(
      {
        method: 'POST',
        url: '/admin/product/category',
        schema: {
          summary: 'Создать категорию',
          tags: ['Управление категориями'],
          body: schemas.entities.CreateCategory,
          response: {
            [201]: Created.fromEntity(schemas.entities.BaseCategory, 'category'),
            [400]: new BadRequest(EntityExistsError.schema()).bodyErrors()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const category = await service.create(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({category})
        }
      }
    )
}