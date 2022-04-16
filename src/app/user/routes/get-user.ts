import * as schemas from '@app/user/schemas'
import {DocsTags} from '@app/docs'
import {Ok} from '@common/schemas/response'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


export async function getUser(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route(
      {
        url: '/user',
        method: 'GET',
        schema: {
          summary: 'Получить пользователя',
          tags: [DocsTags.USER],
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user')
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const user = await service.findById(request.session.userId)

          reply
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}