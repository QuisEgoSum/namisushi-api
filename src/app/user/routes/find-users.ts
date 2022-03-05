import {BadRequest, DataList} from '@common/schemas/response'
import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface FindUsersRequest {
  Querystring: schemas.entities.FindUsersQuery
}


export async function findUsersAdmin(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<FindUsersRequest>(
      {
        url: '/users',
        method: 'GET',
        schema: {
          summary: 'Get users list',
          tags: ['User'],
          querystring: schemas.entities.FindUsersQuery,
          response: {
            [200]: new DataList(schemas.entities.UserPreview),
            [400]: new BadRequest().paramsErrors()
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const dataList = await service.findPreviewPage(request.query)

          reply
            .code(200)
            .type('application/json')
            .send(dataList)
        }
      }
    )
}