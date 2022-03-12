import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import {ProductDoesNotExist} from '@app/product/product-error'


interface UpdateProductVariantRequest {
  Params: {
    productId: string
  },
  Body: schemas.entities.UpdateVariantProduct
}


export async function updateProductVariant(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<UpdateProductVariantRequest>(
      {
        method: 'PATCH',
        url: '/admin/product/VARIANT/:productId',
        schema: {
          summary: 'Обновить VARIANT продукт',
          tags: ['Управление продуктами'],
          params: {
            productId: schemas.properties._id
          },
          body: schemas.entities.UpdateVariantProduct,
          response: {
            [200]: new Ok(schemas.entities.VariantProduct, 'product'),
            [400]: new BadRequest().bodyErrors().updateError(),
            [404]: new NotFound(ProductDoesNotExist.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const product = await service.findAndUpdateVariantProduct(request.params.productId, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({product})
        }
      }
    )
}