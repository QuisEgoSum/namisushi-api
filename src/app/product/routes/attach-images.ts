import * as schemas from '../schemas'
import {config} from '@config'
import type {FastifyInstance} from 'fastify'
import type {MultipartFile} from '@fastify/multipart'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import {ProductService} from '@app/product/ProductService'
import {ProductDoesNotExistError} from '@app/product/product-error'
import {FastifyMultipartSchema} from '@common/schemas/payload'


interface AttachImagesRequest {
  Body: {images: MultipartFile[]}
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
          description: 'Один или несколько файлов в `images` свойстве'
            + `<br/><br/>*Допустимые mimetype: ${config.product.image.file.allowedTypes.join(', ')}.*`
            + `<br/>*Максимальный размер файла ${config.product.image.file.maximumSize}b.*`,
          tags: ['Управление продуктами'],
          consumes: ['multipart/form-data'],
          params: {
            type: 'object',
            properties: {
              productId: schemas.properties._id
            }
          },
          body: {
            type: 'object',
            properties: {
              images: new FastifyMultipartSchema(
                {
                  minimum: 1,
                  maximum: config.product.image.maximum,
                  allowedMimetypes: config.product.image.file.allowedTypes,
                  maximumFileSize: config.product.image.file.maximumSize
                }
              )
            },
            required: ['images'],
            additionalProperties: false
          },
          response: {
            [200]: Ok.fromEntity(schemas.properties.images, 'images'),
            [400]: new BadRequest().bodyErrors(),
            [404]: new NotFound(ProductDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const images = await service.attachImage(request.params.productId, request.body.images)

          reply
            .code(200)
            .type('application/json')
            .send({images})
        },
        onSuccessful: () => service.reloadVisibleProductsCache(true)
      }
    )
}