import * as schemas from '@app/user/schemas'
import {DocsTags} from '@app/docs'
import {Ok} from '@common/schemas/response'
import {config} from '@config'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface SignInUser {
  Body: schemas.entities.UserCredentials
}


export async function signIn(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<SignInUser>(
      {
        url: '/user/signin',
        method: 'POST',
        schema: {
          summary: 'Авторизоваться',
          tags: [DocsTags.USER],
          body: schemas.entities.UserCredentials,
          headers: {
            'x-localhost': {
              description: 'Установите любое значение, чтобы ответ устанавливал куки для домена localhost',
              type: 'string'
            }
          },
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user')
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          const {user, sessionId} = await service.signin(request.body)

          let cookieOptions = config.user.session.cookie

          if (request.headers['x-localhost']) {
            cookieOptions = {
              ...cookieOptions,
              domain: 'localhost'
            }
          }

          reply
            .setCookie('sessionId', sessionId, cookieOptions)
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}