import {FastifyInstance} from 'fastify'
import {DocsTags} from '@app/docs'
import {NoContent} from '@common/schemas/response'
import {ProductService} from '@app/product/ProductService'


export async function reloadCache(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route(
      {
        url: '/admin/product/visible/cache',
        method: 'PUT',
        schema: {
          summary: 'Перезагрузить кэш продуктов для пользователей',
          tags: [DocsTags.PRODUCT_ADMIN],
          response: {
            [204]: new NoContent()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.reloadVisibleProductsCache()

          reply
            .code(204)
            .send()
        }
      }
    )
}