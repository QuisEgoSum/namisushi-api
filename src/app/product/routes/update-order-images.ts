import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {Ok} from '@common/schemas/response'


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
            [200]: new Ok(schemas.properties.images, 'images')
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
        }
      }
    )
}