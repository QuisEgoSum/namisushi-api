import * as schemas from '../schemas'
import {BadRequest, Created} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'


interface CreateProductVariantRequest {
  Params: {
    productId: string
  },
  Body: schemas.entities.CreateVariantProduct
}


export async function createProductVariant(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<CreateProductVariantRequest>(
      {
        method: 'POST',
        url: '/admin/product/VARIANT',
        schema: {
          summary: 'Создать VARIANT продукт',
          tags: ['Управление продуктами'],
          params: {
            productId: schemas.properties._id
          },
          body: schemas.entities.CreateVariantProduct,
          response: {
            [201]: Created.fromEntity(schemas.entities.VariantProduct, 'product'),
            [400]: new BadRequest().bodyErrors()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const product = await service.createVariant(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({product})
        }
      }
    )
}