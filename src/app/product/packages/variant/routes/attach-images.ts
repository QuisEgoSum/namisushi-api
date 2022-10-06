import * as schemas from '../schemas'
import {config} from '@config'
import type {FastifyInstance} from 'fastify'
import type {MultipartFile} from '@fastify/multipart'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import {FastifyMultipartSchema} from '@common/schemas/payload'
import {VariantService} from '@app/product/packages/variant'
import {ProductService} from '@app/product'
import {VariantDoesNotExistError} from '@app/product/packages/variant/variant-error'
import {DocsTags} from '@app/docs'


interface AttachImagesRequest {
  Body: {image: MultipartFile[]}
  Params: {
    variantId: string
  }
}


export async function attachImages(fastify: FastifyInstance, service: VariantService, productService: ProductService) {
  return fastify
    .route<AttachImagesRequest>(
      {
        method: 'PUT',
        url: '/admin/product/variant/:variantId',
        schema: {
          summary: 'Добавить продукту картинки',
          description: 'Один или несколько файлов в `images` свойстве'
            + `<br/><br/>*Допустимые mimetype: ${config.product.image.file.allowedTypes.join(', ')}.*`
            + `<br/>*Максимальный размер файла ${config.product.image.file.maximumSize}b.*`,
          tags: [DocsTags.VARIANT_ADMIN],
          consumes: ['multipart/form-data'],
          params: {
            type: 'object',
            properties: {
              variantId: schemas.properties._id
            }
          },
          body: {
            type: 'object',
            properties: {
              image: new FastifyMultipartSchema(
                {
                  minimum: 1,
                  maximum: 1,
                  allowedMimetypes: config.product.variant.image.allowedTypes,
                  maximumFileSize: config.product.variant.image.maximumSize
                }
              )
            },
            required: ['image'],
            additionalProperties: false
          },
          response: {
            [200]: Ok.fromEntity(schemas.entities.BaseVariant, 'variant'),
            [400]: new BadRequest().bodyErrors(),
            [404]: new NotFound(VariantDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const variant = await service.attachImage(request.params.variantId, request.body.image[0])

          reply
            .code(200)
            .type('application/json')
            .send({variant})
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}