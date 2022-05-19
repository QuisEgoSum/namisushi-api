import {ProductDoesNotExistError} from '@app/product/product-error'
import {TagDoesNotExistError} from '@app/product/packages/tag/tag-error'
import {DocsTags} from '@app/docs'
import {BadRequest, NoContent, NotFound} from '@common/schemas/response'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'


interface RemoveTagRequest {
  Params: {
    productId: string
    tagId: string
  }
}


export async function removeTag(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<RemoveTagRequest>(
      {
        url: '/admin/product/:productId/tag/:tagId',
        method: 'DELETE',
        schema: {
          summary: 'Удалить тег у продукта',
          tags: [DocsTags.PRODUCT_ADMIN],
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
          await service.removeTag(request.params.productId, request.params.tagId)

          reply
            .code(204)
            .send()
        },
        onSuccessful: () => service.reloadVisibleProductsCache(true)
      }
    )
}