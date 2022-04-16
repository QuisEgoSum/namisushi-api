import {DocsTags} from '@app/docs'
import {MessageResponse} from '@common/schemas/response'
import {config} from '@config'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


interface SignOutUser {
  Headers: {
    'x-localhost': string
  }
}

export async function signOut(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<SignOutUser>(
      {
        url: '/user/signout',
        method: 'DELETE',
        schema: {
          summary: 'Выход из аккаунта',
          tags: [DocsTags.USER],
          headers: {
            'x-localhost': {
              description: 'Установите любое значение, чтобы ответ устанавливал куки для домена localhost',
              type: 'string'
            }
          },
          response: {
            [200]: new MessageResponse('Вы вышли из своего аккаунта')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          await service.signOut(request.session.userId, request.session.sessionId)

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
            .send({message: 'Вы вышли из своего аккаунта'})
        }
      }
    )
}