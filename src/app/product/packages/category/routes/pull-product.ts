import * as schemas from '@app/product/packages/category/schemas'
import {CategoryDoesNotExistError} from '@app/product/packages/category/category-error'
import {DocsTags} from '@app/docs'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'


interface PullProductRequest {
  Params: {
    productId: string,
    categoryId: string
  }
}


export async function pullProduct(fastify: FastifyInstance, service: CategoryService, productService: ProductService) {
  return fastify
    .route<PullProductRequest>(
      {
        method: 'DELETE',
        url: '/admin/product/:productId/category/:categoryId',
        schema: {
          summary: 'Удалить продукт из категории',
          tags: [DocsTags.CATEGORY_ADMIN],
          params: {
            productId: schemas.properties.productIds.items,
            categoryId: schemas.properties._id
          },
          response: {
            [200]: Ok.fromEntity(schemas.entities.BaseCategory, 'category'),
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
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}