import {FastifyInstance} from 'fastify'
import {UserService} from '@app/user'
import {DocsTags} from '@app/docs'
import {Ok} from '@common/schemas/response'
import * as schemas from '@app/user/schemas'


interface UploadAvatarRequest {
  Body: schemas.entities.UpdateAvatar
}



export async function uploadAvatar(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<UploadAvatarRequest>(
      {
        method: 'PATCH',
        url: '/user/avatar',
        schema: {
          summary: 'Засетить аватар',
          tags: [DocsTags.USER],
          body: schemas.entities.UpdateAvatar,
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user'),
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const user = await service.setAvatar(request.session.userId, request.body.avatar)

          reply
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}