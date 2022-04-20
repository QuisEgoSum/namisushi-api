import {DocsTags} from '@app/docs'
import {NoContent} from '@common/schemas/response'
import type {UserService} from '@app/user'
import type {FastifyInstance} from 'fastify'


export async function reloadCache(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route(
      {
        url: '/admin/user/telegram/cache',
        method: 'PUT',
        schema: {
          summary: 'Перезагрузить кэш идентификаторов чатов telegram',
          tags: [DocsTags.ADMIN],
          responses: {
            [200]: new NoContent()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.reloadTelegramCache()

          reply
            .code(200)
            .send()
        }
      }
    )
}