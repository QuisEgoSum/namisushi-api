import {FastifyInstance} from 'fastify'
import {VariantService} from '@app/product/packages/variant/VariantService'
import {config} from '@config'
import {BadRequest, Created} from '@common/schemas/response'
import {MultipartFile} from 'fastify-multipart'
import {DocsTags} from '@app/docs'


interface UploadIconRequest {
  Body: MultipartFile[]
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
          description: 'Один файл в прозвольном свойстве'
            + `<br/><br/>*Допустимый mimetype: \`image/svg+xml\`.*`
            + `<br/>*Максимальный размер файла ${config.product.variant.icon.maximumSize}b.*`,
          consumes: ['multipart/form-data'],
          body: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                mimetype: {
                  type: 'string',
                  enum: ['image/svg+xml'],
                  errorMessage: {
                    enum: `Недопустимый тип файла. Допустимый mimetype: image/svg+xml`
                  }
                },
                file: {
                  type: 'object',
                  properties: {
                    bytesRead: {
                      type: 'integer',
                      maximum: config.product.variant.icon.maximumSize,
                      errorMessage: {
                        maximum: `Максимальный допустимый размер файла ${config.product.variant.icon.maximumSize}b`
                      }
                    }
                  },
                  additionalProperties: true
                }
              },
              additionalProperties: true
            },
            minItems: 1,
            maxItems: 1,
            errorMessage: {
              minItems: 'Загрузите файл',
              maxItems: `Вы не можете загружать больше 1 файла`
            }
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
        preValidation: async function(request) {
          if (request.isMultipart()) {
            request.body = await request.saveRequestFiles()
          } else {
            request.body = []
          }
        },
        handler: async function(request, reply) {
          const filename = await service.uploadIcon(request.body[0])

          request.tmpUploads.length = 0

          reply
            .code(201)
            .type('application/json')
            .send({filename})
        }
      }
    )
}