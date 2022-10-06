import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import {
  ProductDoesNotExistError,
  ProductImagesNotCompatibleError,
  ProductVariantNotHaveImagesError
} from '@app/product/product-error'


export interface UpdateOrderImagesRequest {
  Params: {
    productId: string
  },
  Body: {
    images: string[]
  }
}

export async function updateOrderImages(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<UpdateOrderImagesRequest>(
      {
        method: 'PATCH',
        url: '/admin/product/:productId/images',
        schema: {
          summary: 'Изменить порядок картинок',
          tags: ['Управление продуктами'],
          params: {
            productId: schemas.properties._id
          },
          body: schemas.entities.UpdateOrderImages,
          response: {
            [200]: Ok.fromEntity(schemas.properties.images, 'images'),
            [400]: new BadRequest(
              ProductImagesNotCompatibleError.schema(),
              ProductVariantNotHaveImagesError.schema()
            ).paramsErrors(),
            [404]: new NotFound(ProductDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const images = await service.updateOrderImages(request.params.productId, request.body.images)

          reply
            .code(200)
            .type('application/json')
            .send({images})
        },
        onSuccessful: () => service.reloadVisibleProductsCache(true)
      }
    )
}