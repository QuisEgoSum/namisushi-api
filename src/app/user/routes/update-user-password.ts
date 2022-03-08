import {BadRequest} from '@common/schemas/response'
import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface UpdateUserRequest {
  Body: schemas.entities.UpdateUserPassword
}


export async function updateUser(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<UpdateUserRequest>(
      {
        url: '/user/password',
        method: 'PATCH',
        schema: {
          summary: 'Обновить пароль',
          tags: ['Пользователь'],
          body: schemas.entities.UpdateUserPassword,
          response: {
            [200]: {
              description: 'Пользователь',
              type: 'object',
              properties: {
                user: schemas.entities.UserBase
              },
              additionalProperties: false,
              required: ['user']
            },
            [400]: new BadRequest().bodyErrors().updateError()
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const user = await service.updateUserPassword(request.session.userId, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}