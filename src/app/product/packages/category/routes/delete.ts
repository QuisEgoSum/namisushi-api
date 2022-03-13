import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import {MessageResponse, NotFound} from '@common/schemas/response'
import {CategoryDoesNotExistError} from '@app/product/packages/category/category-error'


export interface DeleteRequest {
  Params: {
    categoryId: string
  }
}


export async function deleteById(fastify: FastifyInstance, service: CategoryService) {
  return fastify
    .route<DeleteRequest>(
      {
        method: 'DELETE',
        url: '/admin/product/category/:categoryId',
        schema: {
          summary: 'Удалить категорию',
          tags: ['Управление категориями'],
          params: {
            categoryId: schemas.properties._id
          },
          response: {
            [200]: new MessageResponse('Категория удалена'),
            [404]: new NotFound(CategoryDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.deleteById(request.params.categoryId)

          reply
            .code(200)
            .type('application/json')
            .send({message: 'Категория удалена'})
        }
      }
    )
}