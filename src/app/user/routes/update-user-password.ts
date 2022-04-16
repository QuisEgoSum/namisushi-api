import * as schemas from '@app/user/schemas'
import {DocsTags} from '@app/docs'
import {BadRequest, Ok} from '@common/schemas/response'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


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
          tags: [DocsTags.USER],
          body: schemas.entities.UpdateUserPassword,
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user'),
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