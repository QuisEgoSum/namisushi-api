import * as schemas from '@app/product/packages/category/schemas'
import {DocsTags} from '@app/docs'
import {EntityExistsError} from '@error'
import {BadRequest, Created} from '@common/schemas/response'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import type {ProductService} from '@app/product/ProductService'
import type {FastifyInstance} from 'fastify'


interface CreateRequest {
  Body: schemas.entities.CreateCategory
}


export async function create(fastify: FastifyInstance, service: CategoryService, productService: ProductService) {
  return fastify
    .route<CreateRequest>(
      {
        method: 'POST',
        url: '/admin/product/category',
        schema: {
          summary: 'Создать категорию',
          tags: [DocsTags.CATEGORY_ADMIN],
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
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}