import * as schemas from '../schemas'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import {CategoryDoesNotExistError} from '@app/product/packages/category/category-error'


interface PullProductRequest {
  Params: {
    productId: string,
    categoryId: string
  }
}


export async function pullProduct(fastify: FastifyInstance, service: CategoryService) {
  return fastify
    .route<PullProductRequest>(
      {
        method: 'DELETE',
        url: '/admin/product/:productId/category/:categoryId',
        schema: {
          summary: 'Удалить продукт из категории',
          tags: ['Управление категориями'],
          params: {
            productId: schemas.properties.productIds.items,
            categoryId: schemas.properties._id
          },
          response: {
            [200]: new Ok(schemas.entities.BaseCategory, 'category'),
            [400]: new BadRequest().paramsErrors(),
            [404]: new NotFound(CategoryDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const category = await service.pullProduct(request.params.categoryId, request.params.productId)

          reply
            .code(200)
            .type('application/json')
            .send({category})
        }
      }
    )
}