import * as schemas from '../schemas'
import {schemas as tagSchemas} from '@app/product/packages/tag'
import {DocsTags} from '@app/docs'
import {BadRequest, NoContent, NotFound} from '@common/schemas/response'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'
import {ProductDoesNotExistError} from '@app/product/product-error'
import {TagDoesNotExistError} from '@app/product/packages/tag/tag-error'


interface AddTagRequest {
  Params: {
    productId: string
    tagId: string
  }
}


export async function addTag(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<AddTagRequest>(
      {
        url: '/admin/product/:productId/tag/:tagId',
        method: 'PATCH',
        schema: {
          summary: 'Добавить продукту тег',
          tags: [DocsTags.PRODUCT_ADMIN],
          params: {
            productId: schemas.properties._id,
            tagId: tagSchemas.properties._id
          },
          response: {
            [204]: new NoContent(),
            [400]: new BadRequest().paramsErrors(),
            [404]: new NotFound(ProductDoesNotExistError.schema(), TagDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.addTag(request.params.productId, request.params.tagId)

          reply
            .code(204)
            .send()
        },
        onSuccessful: () => service.reloadVisibleProductsCache(true)
      }
    )
}