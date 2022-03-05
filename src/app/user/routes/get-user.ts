import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


export async function getUser(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route(
      {
        url: '/user',
        method: 'GET',
        schema: {
          summary: 'Get user',
          tags: ['User - Me'],
          response: {
            [200]: {
              description: 'User',
              type: 'object',
              properties: {
                user: schemas.entities.UserBase
              },
              additionalProperties: false,
              required: ['user']
            }
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