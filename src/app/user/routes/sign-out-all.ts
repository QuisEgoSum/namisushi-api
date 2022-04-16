import {DocsTags} from '@app/docs'
import {MessageResponse} from '@common/schemas/response'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


export async function signOutAll(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route(
      {
        url: '/user/signout/all',
        method: 'DELETE',
        schema: {
          summary: 'Выйти из всех сессий пользователя, кроме текущей',
          tags: [DocsTags.USER],
          response: {
            [200]: new MessageResponse('Вы завершили {N} сессий')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const numberOfSessions = await service.signOutAllExpect(request.session.userId, request.session.sessionId)

          reply
            .code(200)
            .type('application/json')
            .send({message: `Вы завершили ${numberOfSessions} сессий`})
        }
      }
    )
}