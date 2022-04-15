import {Created} from '@common/schemas/response'
import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface SignupRequest {
  Body: schemas.entities.Signup
}


export async function signup(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<SignupRequest>(
      {
        url: '/user/signup',
        method: 'POST',
        schema: {
          summary: 'Регистрация',
          tags: ['Пользователь'],
          body: schemas.entities.Signup,
          response: {
            [201]: new Created(schemas.entities.UserBase, 'user')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const user = await service.signup(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({user})
        }
      }
    )
}
