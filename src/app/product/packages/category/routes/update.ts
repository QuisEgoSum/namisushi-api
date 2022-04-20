import * as schemas from '@app/product/packages/category/schemas'
import {CategoryDoesNotExistError, CategoryExistsError} from '@app/product/packages/category/category-error'
import {DocsTags} from '@app/docs'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'


interface UpdateRequest {
  Params: {
    categoryId: string
  }
  Body: schemas.entities.CreateCategory
}


export async function update(fastify: FastifyInstance, service: CategoryService, productService: ProductService) {
  return fastify
    .route<UpdateRequest>(
      {
        method: 'PATCH',
        url: '/admin/product/category/:categoryId',
        schema: {
          summary: 'Обновить категорию',
          tags: [DocsTags.CATEGORY_ADMIN],
          params: {
            categoryId: schemas.properties._id
          },
          body: schemas.entities.UpdateCategory,
          response: {
            [200]: Ok.fromEntity(schemas.entities.BaseCategory, 'category'),
            [400]: new BadRequest(CategoryExistsError.schema()).bodyErrors().updateError(),
            [404]: new NotFound(CategoryDoesNotExistError.schema())
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
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}