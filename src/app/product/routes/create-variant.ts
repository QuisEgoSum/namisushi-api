import * as schemas from '../schemas'
import {Created} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'


interface CreateVariantRequest {
  Params: {
    productId: string
  },
  Body: schemas.entities.CreateVariantProduct
}


export async function createVariant(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<CreateVariantRequest>(
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
            [201]: new Created(schemas.entities.VariantProduct, 'product'),
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