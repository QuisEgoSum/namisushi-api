import * as schemas from '@app/user/schemas'
import {UserExistsError} from '@app/user/user-error'
import {DocsTags} from '@app/docs'
import {BadRequest, Created} from '@common/schemas/response'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


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
          summary: 'Создать пользователя',
          tags: [DocsTags.ADMIN],
          body: schemas.entities.CreateUser,
          response: {
            [201]: Created.fromEntity(schemas.entities.UserBase, 'user'),
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