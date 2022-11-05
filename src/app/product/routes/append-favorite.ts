import {FastifyInstance} from 'fastify'
import {ProductService, schemas} from '@app/product'
import {DocsTags} from '@app/docs'
import {BadRequest, NoContent, NotFound} from '@common/schemas/response'
import {ProductAlreadyInFavoriteListError} from '@app/product/packages/favorite/favorite-error'
import {ProductDoesNotExistError} from '@app/product/product-error'


interface AppendFavoriteRequest {
  Params: {
    productId: string
  }
}

export async function appendFavorite(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<AppendFavoriteRequest>(
      {
        method: 'POST',
        url: '/product/:productId/favorite',
        schema: {
          summary: 'Добавить продукт в избранные',
          tags: [DocsTags.PRODUCT_FAVORITE],
          params: {
            productId: schemas.properties._id
          },
          response: {
            [204]: new NoContent(),
            [400]: new BadRequest(ProductAlreadyInFavoriteListError.schema()).paramsErrors(),
            [404]: new NotFound(ProductDoesNotExistError.schema())
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          await service.appendFavorite(request.session.userId, request.params.productId)

          reply
            .code(204)
            .send()
        }
      }
    )
}