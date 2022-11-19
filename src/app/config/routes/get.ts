import {FastifyInstance} from 'fastify'
import {ConfigService} from '@app/config/ConfigService'
import {DocsTags} from '@app/docs'
import {Ok} from '@common/schemas/response'
import {BaseConfig} from '@app/config/schemas/entities'


export async function get(fastify: FastifyInstance, service: ConfigService) {
  return fastify
    .route(
      {
        url: '/config',
        method: 'GET',
        schema: {
          summary: 'Получить конфигурацию приложения',
          tags: [DocsTags.CONFIG],
          response: {
            [200]: Ok.fromEntity(BaseConfig, 'config')
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          const config = await service.findOne()

          reply
            .code(200)
            .type('application/json')
            .send({config})
        }
      }
    )
}