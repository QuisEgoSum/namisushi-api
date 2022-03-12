import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {SingleProduct} from '@app/product/ProductModel'
import {NotFound} from '@common/schemas/response'
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
          body: schemas.entities.UpdateSingleProduct,
          response: {
            [200]: {
              description: 'Обновленный продукт',
              type: 'object',
              properties: {
                product: schemas.entities.SingleProduct
              },
              additionalProperties: false,
              required: ['product']
            },
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