import {BadRequest} from '@common/schemas/response'
import {UserExistsError} from '../user-error'
import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface CreateUserRequest {
  Body: schemas.entities.CreateUser
}

export async function createUser(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<CreateUserRequest>(
      {
        url: '/admin/user',
        method: 'POST',
        schema: {
          summary: 'Create user',
          tags: ['User - Admin'],
          body: schemas.entities.CreateUser,
          response: {
            [201]: {
              description: 'User',
              type: 'object',
              properties: {
                user: schemas.entities.UserBase
              },
              additionalProperties: false,
              required: ['user']
            },
            [400]: new BadRequest(UserExistsError.schema()).bodyErrors()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const user = await service.create(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({user})
        }
      }
    )
}