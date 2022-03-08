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
          summary: 'Выход из аккаунта',
          tags: ['Пользователь'],
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
            .send({message: 'Вы вышли из своего аккаунта'})
        }
      }
    )
}