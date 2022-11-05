import {FastifyInstance} from 'fastify'
import {FavoriteService} from '@app/product/packages/favorite'
import {ExpandProduct} from '@app/product/schemas/entities'
import {Ok} from '@common/schemas/response'
import {DocsTags} from '@app/docs'


export async function find(fastify: FastifyInstance, service: FavoriteService) {
  return fastify
    .route(
      {
        method: 'GET',
        url: '/product/favorites',
        schema: {
          summary: 'Получить список избранных продуктов',
          tags: [DocsTags.PRODUCT_FAVORITE],
          response: {
            [200]: Ok.fromEntity({type: 'array', items: ExpandProduct}, 'products')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const products = await service.find(request.session.userId)

          reply
            .code(200)
            .type('application/json')
            .send({products})
        }
      }
    )
}