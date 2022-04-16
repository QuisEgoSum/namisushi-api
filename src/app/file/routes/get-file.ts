import {DocsTags} from '@app/docs'
import {config} from '@config'
import type {FastifyInstance} from 'fastify'


export async function getFile(fastify: FastifyInstance) {
  for (const opt of [
    {
      url: '/product/image/:filename',
      summary: 'Получить изображение продукта',
      produces: config.product.image.file.allowedTypes,
      destination: config.product.image.file.destination
    },
    {
      url: '/product/variant/icon/:filename',
      summary: 'Получить иконку продукта',
      produces: ['image/svg+xml'],
      destination: config.product.variant.icon.destination
    }
  ]) {
    fastify
      .route<{Params: {filename: string}}>({
        url: opt.url,
        method: 'GET',
        schema: {
          summary: opt.summary,
          description: 'Заглушка для документации, статику отдаёт nginx',
          tags: [DocsTags.PRODUCT],
          produces: config.product.image.file.allowedTypes,
          params: {
            filename: {
              type: 'string'
            }
          },
          response: {
            [200]: {
              description: 'Ok',
              type: 'string',
              format: 'binary'
            }
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          return reply.sendFile(request.params.filename, opt.destination)
        }
      })
  }
  return fastify
}