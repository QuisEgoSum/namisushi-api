import * as schemas from '../schemas'
import {BadRequest, Ok} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface GetStatusRequest {
  Body: {
    phone: string
  }
}


export async function getStatus(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<GetStatusRequest>({
      url: '/user/status',
      method: 'PUT',
      schema: {
        summary: 'Получить статус пользователя',
        tags: ['Пользователь'],
        body: {
          type: 'object',
          properties: {
            phone: schemas.properties.phone
          },
          required: ['phone'],
          additionalProperties: false
        },
        response: {
          [200]: Ok.fromEntity(schemas.properties.status, 'status'),
          [400]: new BadRequest().bodyErrors()
        }
      },
      security: {
        auth: false
      },
      handler: async function(request, reply) {
        const status = await service.getStatusByPhone(request.body.phone)

        reply
          .code(200)
          .type('application/json')
          .send({status})
      }
    })
}