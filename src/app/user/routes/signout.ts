import {config} from '@config'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'
import {MessageResponse} from '@common/schemas/response'


interface SignoutUser {
  Headers: {
    'x-localhost': string
  }
}

export async function signout(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<SignoutUser>(
      {
        url: '/user/signout',
        method: 'DELETE',
        schema: {
          summary: 'User sign out',
          tags: ['User - Me'],
          headers: {
            'x-localhost': {
              description: 'Any value for set cookie for the localhost domain',
              type: 'string'
            }
          },
          response: {
            [200]: new MessageResponse('You have logged out of your account')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          await service.logout(request.session.userId, request.session.sessionId)

          let cookieOptions = config.user.session.cookie

          if (request.headers['x-localhost']) {
            cookieOptions = {
              ...cookieOptions,
              domain: 'localhost'
            }
          }

          reply
            .clearCookie('sessionId', cookieOptions)
            .code(200)
            .type('application/json')
            .send({message: 'You have logged out of your account'})
        }
      }
    )
}