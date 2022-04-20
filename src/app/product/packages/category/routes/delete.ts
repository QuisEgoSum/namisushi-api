import * as schemas from '@app/product/packages/category/schemas'
import {CategoryDoesNotExistError} from '@app/product/packages/category/category-error'
import {DocsTags} from '@app/docs'
import {BadRequest, MessageResponse, NotFound} from '@common/schemas/response'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'


export interface DeleteRequest {
  Params: {
    categoryId: string
  }
}


export async function deleteById(fastify: FastifyInstance, service: CategoryService, productService: ProductService) {
  return fastify
    .route<DeleteRequest>(
      {
        method: 'DELETE',
        url: '/admin/product/category/:categoryId',
        schema: {
          summary: 'Удалить категорию',
          tags: [DocsTags.CATEGORY_ADMIN],
          params: {
            categoryId: schemas.properties._id
          },
          response: {
            [200]: new MessageResponse('Категория удалена'),
            [400]: new BadRequest().paramsErrors(),
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
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}