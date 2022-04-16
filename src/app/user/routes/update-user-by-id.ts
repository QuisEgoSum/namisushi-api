import * as schemas from '@app/user/schemas'
import {UserNotExistsError} from '@app/user/user-error'
import {DocsTags} from '@app/docs'
import {Ok, BadRequest, NotFound} from '@common/schemas/response'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


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
          tags: [DocsTags.ADMIN],
          params: {
            userId: schemas.properties._id
          },
          body: schemas.entities.UpdateUserById,
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user'),
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