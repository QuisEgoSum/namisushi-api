import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {ISingleProduct} from '@app/product/ProductModel'
import {NotFound, Ok} from '@common/schemas/response'
import {ProductDoesNotExist} from '@app/product/product-error'


interface UpdateSingleRequest {
  Params: {
    productId: string
  },
  Body: schemas.entities.UpdateSingleProduct
}


export async function updateSingle(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<UpdateSingleRequest>(
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
            [200]: new Ok(schemas.entities.SingleProduct, 'product'),
            [404]: new NotFound(ProductDoesNotExist.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const product = await service.findAndUpdateSingle(request.params.productId, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({product})
        }
      }
    )
}