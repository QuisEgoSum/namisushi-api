import {BadRequest, NotFound} from '@common/schemas/response'
import {UserNotExistsError} from '../user-error'
import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface FindUserRequest {
  Params: {
    userId: string
  }
}


export async function findUser(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<FindUserRequest>(
      {
        url: '/admin/user/:userId',
        method: 'GET',
        schema: {
          summary: 'Get user by id',
          tags: ['User - Admin'],
          params: {
            userId: schemas.properties._id
          },
          response: {
            [200]: {
              description: 'User',
              type: 'object',
              properties: {
                user: schemas.entities.UserBase
              },
              additionalProperties: false,
              required: ['user']
            },
            [400]: new BadRequest().paramsErrors(),
            [404]: new NotFound(UserNotExistsError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const user = await service.findById(request.params.userId)

          reply
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}