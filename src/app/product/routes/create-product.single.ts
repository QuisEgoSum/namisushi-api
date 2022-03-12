import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {Created} from '@common/schemas/response'


interface CreateProductSingleRequest {
  Body: schemas.entities.CreateSingleProduct
}


export async function createProductSingle(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<CreateProductSingleRequest>(
      {
        method: 'POST',
        url: '/admin/product/SINGLE',
        schema: {
          summary: 'Создать SINGLE продукт',
          tags: ['Управление продуктами'],
          body: schemas.entities.CreateSingleProduct,
          response: {
            [201]: new Created(schemas.entities.SingleProduct, 'product')
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const product = await service.createSingle(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({product})
        }
      }
    )
}