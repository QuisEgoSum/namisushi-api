import {FastifyInstance} from 'fastify'
import {UserService} from '@app/user'
import {DocsTags} from '@app/docs'
import {config} from '@config'
import {MultipartFile} from '@fastify/multipart'
import {FastifyMultipartSchema} from '@common/schemas/payload'
import {Ok} from '@common/schemas/response'
import * as schemas from '@app/user/schemas'


interface UploadAvatarRequest {
  Body: {avatar: MultipartFile[]}
}

export async function uploadAvatar(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<UploadAvatarRequest>(
      {
        method: 'PUT',
        url: '/user/avatar',
        schema: {
          summary: 'Загрузить аватар',
          description: 'Один файл в свойстве `avatar`'
            + `<br/><br/>*Допустимые mimetype: ${config.user.avatar.allowedTypes.join(', ')}.*`
            + `<br/>*Максимальный размер файла ${config.user.avatar.maximumSize}b.*`,
          tags: [DocsTags.USER],
          consumes: ['multipart/form-data'],
          body: {
            type: 'object',
            properties: {
              avatar: new FastifyMultipartSchema(
                {
                  minimum: 1,
                  maximum: 1,
                  allowedMimetypes: config.user.avatar.allowedTypes,
                  maximumFileSize: config.user.avatar.maximumSize
                }
              )
            },
            required: ['avatar'],
            additionalProperties: false
          },
          response: {
            [200]: Ok.fromEntity(schemas.entities.UserBase, 'user'),
          }
        },
        security: {
          auth: true
        },
        handler: async function(request, reply) {
          const user = await service.uploadAvatar(request.session.userId, request.body.avatar[0])

          reply
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}