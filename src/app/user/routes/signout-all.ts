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
          summary: 'User sign out of all sessions except current one',
          tags: ['User - Me'],
          response: {
            [200]: new MessageResponse('You have logged out of {N} sessions')
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
            .send({message: `You have logged out of ${numberOfSessions} sessions`})
        }
      }
    )
}