import * as schemas from '@app/user/schemas'
import {UserNotExistsError} from '@app/user/user-error'
import {DocsTags} from '@app/docs'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


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
          summary: 'Найти пользователя по id',
          tags: [DocsTags.ADMIN],
          params: {
            userId: schemas.properties._id
          },
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user'),
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