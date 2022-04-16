import {DocsTags} from '@app/docs'
import {Ok} from '@common/schemas/response'
import type {VariantService} from '@app/product/packages/variant/VariantService'
import type {FastifyInstance} from 'fastify'


export async function getIcons(fastify: FastifyInstance, service: VariantService) {
  return fastify
    .route(
      {
        url: '/admin/product/variant/icons',
        method: 'GET',
        schema: {
          summary: 'Получить список имён иконок вариантов',
          tags: [DocsTags.VARIANT_ADMIN],
          response: {
            [200]: Ok.fromEntity({type: 'array', items: {type: 'string'}}, 'filenames')
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const filenames = await service.getIcons()

          reply
            .code(200)
            .type('application/json')
            .send({filenames})
        }
      }
    )
}