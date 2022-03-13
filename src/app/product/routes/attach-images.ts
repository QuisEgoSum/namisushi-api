import * as schemas from '../schemas'
import {config} from '@config'
import type {FastifyInstance} from 'fastify'
import type {MultipartFile} from 'fastify-multipart'
import {BadRequest, Ok} from '@common/schemas/response'
import {ProductService} from '@app/product/ProductService'


interface AttachImagesRequest {
  Body: MultipartFile[]
  Params: {
    productId: string
  }
}


export async function attachImages(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<AttachImagesRequest>(
      {
        method: 'PUT',
        url: '/admin/product/:productId/images',
        schema: {
          summary: 'Добавить продукту картинки',
          description: 'Один или несколько файлов в прозвольном свойстве или свойствах'
            + `<br/><br/>*Допустимые mimetype: ${config.product.image.file.allowedTypes.join(', ')}.*`
            + `<br/>*Максимальный размер файла ${config.product.image.file.maximumSize}b.*`,
          tags: ['Управление продуктами'],
          consumes: ['multipart/form-data'],
          params: {
            productId: schemas.properties._id
          },
          body: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                mimetype: {
                  type: 'string',
                  enum: config.product.image.file.allowedTypes,
                  errorMessage: {
                    enum: `Недопустимый тип файла. Допустимые mimetype: ${config.product.image.file.allowedTypes.join(', ')}`
                  }
                },
                file: {
                  type: 'object',
                  properties: {
                    bytesRead: {
                      type: 'integer',
                      maximum: config.product.image.file.maximumSize,
                      errorMessage: {
                        maximum: `Максимальный допустимый размер файла ${config.product.image.file.maximumSize}b`
                      }
                    }
                  },
                  additionalProperties: true
                }
              },
              additionalProperties: true
            },
            minItems: 1,
            maxItems: config.product.image.maximum,
            errorMessage: {
              minItems: 'Загрузите файл',
              maxItems: `Вы не можете загружать больше ${config.product.image.maximum} файлов`
            }
          },
          response: {
            [200]: new Ok(schemas.properties.images, 'images'),
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
          console.log(request.body)

          const images = await service.attachImage(request.params.productId, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({images})
        }
      }
    )
}