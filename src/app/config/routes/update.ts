import {FastifyInstance} from 'fastify'
import {ConfigService} from '@app/config/ConfigService'
import {DocsTags} from '@app/docs'
import {BaseConfig, UpdateConfig} from '@app/config/schemas/entities'
import {Ok} from '@common/schemas/response'


interface UpdateRequest {
  Body: UpdateConfig
}


export async function update(fastify: FastifyInstance, service: ConfigService) {
  return fastify
    .route<UpdateRequest>(
      {
        url: '/admin/config',
        method: 'PATCH',
        schema: {
          summary: 'Обновить конфигурацию',
          tags: [DocsTags.CONFIG_ADMIN],
          body: UpdateConfig,
          response: {
            [200]: Ok.fromEntity(BaseConfig, 'config')
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const config = await service.findOneAndUpdate({}, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({config})
        }
      }
    )
}