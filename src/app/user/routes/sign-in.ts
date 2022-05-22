import * as schemas from '../schemas'
import {InvalidOtpCodeError} from '@app/user/user-error'
import {ContentType, DocsTags} from '@app/docs'
import {BadRequest, Ok} from '@common/schemas/response'
import {config} from '@config'
import type {UserService} from '@app/user'
import type {FastifyInstance} from 'fastify'


interface SignInRequest {
  Body: schemas.entities.UserCredentials
}


export async function signIn(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<SignInRequest>(
      {
        url: '/user/singin',
        method: 'GET',
        schema: {
          summary: 'Авторизация',
          tags: [DocsTags.USER],
          body: schemas.entities.UserCredentials,
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user'),
            [400]: new BadRequest(InvalidOtpCodeError.schema())
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          const {user, sessionId} = await service.signIn(request.body)

          reply
            .setCookie('sessionId', sessionId, config.user.session.cookie)
            .code(200)
            .type(ContentType.APPLICATION_JSON)
            .send({user})
        }
      }
    )
}