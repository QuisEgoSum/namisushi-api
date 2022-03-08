import {MessageResponse} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


export async function signoutAll(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route(
      {
        url: '/user/signout/all',
        method: 'DELETE',
        schema: {
          summary: 'Выйти из всех сессий пользователя, кроме текущей',
          tags: ['Пользователь'],
          response: {
            [200]: new MessageResponse('Вы завершили {N} сессий')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const numberOfSessions = await service.logoutAllExpect(request.session.userId, request.session.sessionId)

          reply
            .code(200)
            .type('application/json')
            .send({message: `Вы завершили ${numberOfSessions} сессий`})
        }
      }
    )
}