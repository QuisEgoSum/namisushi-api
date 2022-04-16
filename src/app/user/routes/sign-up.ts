import * as schemas from '@app/user/schemas'
import {DocsTags} from '@app/docs'
import {Created} from '@common/schemas/response'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


interface SignUpRequest {
  Body: schemas.entities.SignUp
}


export async function signUp(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<SignUpRequest>(
      {
        url: '/user/signup',
        method: 'POST',
        schema: {
          summary: 'Регистрация',
          tags: [DocsTags.USER],
          body: schemas.entities.SignUp,
          response: {
            [201]: Created.fromEntity(schemas.entities.UserBase, 'user')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const user = await service.signUp(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({user})
        }
      }
    )
}
