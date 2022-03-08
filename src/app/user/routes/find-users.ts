import {BadRequest, DataList} from '@common/schemas/response'
import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface FindUsersRequest {
  Querystring: schemas.entities.FindUsersQueryAdmin
}


export async function findUsers(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<FindUsersRequest>(
      {
        url: '/admin/users',
        method: 'GET',
        schema: {
          summary: 'Поиск пользователей',
          tags: ['Администратор'],
          querystring: schemas.entities.FindUsersQueryAdmin,
          response: {
            [200]: new DataList(schemas.entities.UserBase),
            [400]: new BadRequest().paramsErrors()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const dataList = await service.findPage(request.query)

          reply
            .code(200)
            .type('application/json')
            .send(dataList)
        }
      }
    )
}