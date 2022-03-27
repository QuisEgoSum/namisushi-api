import * as schemas from '../schemas'
import * as categorySchemas from '@app/product/packages/category/schemas'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {ProductDoesNotExistError} from '@app/product/product-error'
import {CategoryDoesNotExistError, ProductAlreadyInCategoryError} from '@app/product/packages/category/category-error'


export interface AddCategoryRequest {
  Params: {
    productId: string
    categoryId: string
  }
}


export async function addCategory(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<AddCategoryRequest>(
      {
        method: 'PUT',
        url: '/admin/product/:productId/category/:categoryId',
        schema: {
          summary: 'Добавить продукт в категорию',
          tags: ['Управление категориями'],
          params: {
            productId: schemas.properties._id,
            categoryId: categorySchemas.properties._id
          },
          response: {
            [200]: Ok.fromEntity(categorySchemas.entities.BaseCategory, 'category'),
            [400]: new BadRequest(ProductAlreadyInCategoryError.schema()).paramsErrors(),
            [404]: new NotFound(ProductDoesNotExistError.schema(), CategoryDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const category = await service.addToCategory(request.params.productId, request.params.categoryId)

          reply
            .code(200)
            .type('application/json')
            .send({category})
        }
      }
    )
}