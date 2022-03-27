import * as schemas from '../schemas'
import {FastifyInstance} from 'fastify'
import {ProductService} from '@app/product/ProductService'
import {BadRequest, MessageResponse, NotFound} from '@common/schemas/response'
import {ProductDoesNotExistError, ProductImageDoesNotExist} from '@app/product/product-error'


export interface DetachImageRequest {
  Params: {
    productId: string,
    filename: string
  }
}


export async function detachImage(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<DetachImageRequest>(
      {
        method: 'DELETE',
        url: '/admin/product/:productId/image/:filename',
        schema: {
          summary: 'Удалить картинку продукта',
          tags: ['Управление продуктами'],
          params: {
            productId: schemas.properties._id,
            filename: schemas.properties.images.items
          },
          response: {
            [200]: new MessageResponse('Картинка удалена'),
            [400]: new BadRequest().paramsErrors(),
            [404]: new NotFound(ProductDoesNotExistError.schema(), ProductImageDoesNotExist.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.deleteImage(request.params.productId, request.params.filename)

          reply
            .code(200)
            .type('application/json')
            .send({message: 'Картинка удалена'})
        }
      }
    )
}