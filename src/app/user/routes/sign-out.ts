import {DocsTags} from '@app/docs'
import {MessageResponse} from '@common/schemas/response'
import {config} from '@config'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'



export async function signOut(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route(
      {
        url: '/user/signout',
        method: 'DELETE',
        schema: {
          summary: 'Выход из аккаунта',
          tags: [DocsTags.USER],
          response: {
            [200]: new MessageResponse('Вы вышли из своего аккаунта')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          await service.signOut(request.session.userId, request.session.sessionId)

          reply
            .clearCookie('sessionId', config.user.session.cookie)
            .code(200)
            .type('application/json')
            .send({message: 'Вы вышли из своего аккаунта'})
        }
      }
    )
}