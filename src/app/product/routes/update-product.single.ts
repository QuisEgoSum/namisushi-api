import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import {ProductDoesNotExist} from '@app/product/product-error'


interface UpdateProductSingleRequest {
  Params: {
    productId: string
  },
  Body: schemas.entities.UpdateSingleProduct
}


export async function updateProductSingle(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<UpdateProductSingleRequest>(
      {
        method: 'PATCH',
        url: '/admin/product/SINGLE/:productId',
        schema: {
          summary: 'Обновить SINGLE продукт',
          tags: ['Управление продуктами'],
          params: {
            productId: schemas.properties._id
          },
          body: schemas.entities.UpdateSingleProduct,
          response: {
            [200]: Ok.wrapper(schemas.entities.SingleProduct, 'product'),
            [400]: new BadRequest().bodyErrors().updateError(),
            [404]: new NotFound(ProductDoesNotExist.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const product = await service.findAndUpdateSingleProduct(request.params.productId, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({product})
        }
      }
    )
}