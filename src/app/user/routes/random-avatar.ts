import {FastifyInstance} from 'fastify'
import {UserService} from '@app/user'
import {DocsTags} from '@app/docs'
import {Ok} from '@common/schemas/response'
import * as schemas from '@app/user/schemas'


export async function uploadAvatar(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route(
      {
        method: 'PATCH',
        url: '/user/avatar',
        schema: {
          summary: 'Генерация случайного аватара',
          tags: [DocsTags.USER],
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user'),
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const user = await service.setRandomAvatar(request.session.userId)

          reply
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}