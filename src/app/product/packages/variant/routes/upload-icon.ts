import {DocsTags} from '@app/docs'
import {BadRequest, Created} from '@common/schemas/response'
import {config} from '@config'
import type {VariantService} from '@app/product/packages/variant/VariantService'
import type {FastifyInstance} from 'fastify'
import type {MultipartFile} from '@fastify/multipart'
import {FastifyMultipartSchema} from '@common/schemas/payload'


interface UploadIconRequest {
  Body: {icon: MultipartFile[]}
  Params: {
    productId: string
  }
}


export async function uploadIcon(fastify: FastifyInstance, service: VariantService) {
  return fastify
    .route<UploadIconRequest>(
      {
        url: '/admin/product/variant/icon',
        method: 'POST',
        schema: {
          summary: 'Загрузить иконку',
          tags: [DocsTags.VARIANT_ADMIN],
          description: 'Один файл в `icon` свойстве'
            + `<br/><br/>*Допустимый mimetype: \`image/svg+xml\`.*`
            + `<br/>*Максимальный размер файла ${config.product.variant.icon.maximumSize}b.*`,
          consumes: ['multipart/form-data'],
          body: {
            type: 'object',
            properties: {
              icon: new FastifyMultipartSchema(
                {
                  minimum: 1,
                  maximum: 1,
                  allowedMimetypes: ['image/svg+xml'],
                  maximumFileSize: config.product.variant.icon.maximumSize
                }
              )
            },
            additionalProperties: false,
            required: ['icon']
          },
          response: {
            [201]: Created.fromEntity({type: 'string'}, 'filename'),
            [400]: new BadRequest().bodyErrors()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const filename = await service.uploadIcon(request.body.icon[0])

          reply
            .code(201)
            .type('application/json')
            .send({filename})
        }
      }
    )
}