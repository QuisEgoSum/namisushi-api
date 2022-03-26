import {FastifyInstance} from 'fastify'
import {config} from '@config'


export async function getProductImage(fastify: FastifyInstance) {
  return fastify
    .route<{Params: {filename: string}}>({
      url: '/product/image/:filename',
      method: 'GET',
      schema: {
        summary: 'Получить изображение продукта',
        description: 'Заглушка для документации, статику отдаёт nginx',
        tags: ['Продукт'],
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
        return reply.sendFile(request.params.filename, config.product.image.file.destination)
      }
    })
}