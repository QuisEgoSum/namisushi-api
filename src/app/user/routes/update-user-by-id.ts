import {UserNotExistsError} from '../user-error'
import {BadRequest, NotFound} from '@common/schemas/response'
import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface UpdateUserByIdRequest {
  Params: {
    userId: string
  },
  Body: schemas.entities.UpdateUserById
}


export async function updateUserById(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<UpdateUserByIdRequest>(
      {
        url: '/admin/user/:userId',
        method: 'PATCH',
        schema: {
          summary: 'Обновить пользователя по id',
          tags: ['Администратор'],
          params: {
            userId: schemas.properties._id
          },
          body: schemas.entities.UpdateUserById,
          response: {
            [200]: {
              description: 'Обновлённый пользователь',
              type: 'object',
              properties: {
                user: schemas.entities.UserBase
              },
              additionalProperties: false,
              required: ['user']
            },
            [400]: new BadRequest(UserNotExistsError.schema()).bodyErrors().updateError(),
            [404]: new NotFound(UserNotExistsError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const user = await service.findByIdAndUpdate(request.params.userId, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}