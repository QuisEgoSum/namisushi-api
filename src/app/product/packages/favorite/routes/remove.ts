import {FastifyInstance} from 'fastify'
import {schemas} from '@app/product'
import {DocsTags} from '@app/docs'
import {NoContent, NotFound} from '@common/schemas/response'
import {
  ProductNotInFavoriteListError
} from '@app/product/packages/favorite/favorite-error'
import {FavoriteService} from '@app/product/packages/favorite'


interface RemoveRequest {
  Params: {
    productId: string
  }
}

export async function remove(fastify: FastifyInstance, service: FavoriteService) {
  return fastify
    .route<RemoveRequest>(
      {
        method: 'DELETE',
        url: '/product/:productId/favorite',
        schema: {
          summary: 'Удалить продукт из избранного',
          tags: [DocsTags.PRODUCT_FAVORITE],
          params: {
            productId: schemas.properties._id
          },
          response: {
            [204]: new NoContent(),
            [404]: new NotFound(ProductNotInFavoriteListError.schema())
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          await service.remove(request.session.userId, request.params.productId)

          reply
            .code(204)
            .send()
        }
      }
    )
}