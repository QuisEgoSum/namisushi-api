import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'



interface CreateVariantRequest {
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
          body: schemas.entities.CreateVariantProduct,
          response: {
            [201]: {
              description: 'Созданный продукт',
              type: 'object',
              properties: {
                product: schemas.entities.VariantProduct
              },
              additionalProperties: false,
              required: ['product']
            }
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