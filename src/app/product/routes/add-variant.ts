import * as schemas from '../schemas'
import * as variantSchemas from '@app/product/packages/variant/schemas'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {BadRequest, Created, NotFound} from '@common/schemas/response'
import {ProductDoesNotExist} from '@app/product/product-error'


interface AddVariantRequest {
  Params: {
    productId: string
  },
  Body: variantSchemas.entities.CreateVariant
}


export async function addVariant(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<AddVariantRequest>(
      {
        method: 'POST',
        url: '/admin/product/VARIANT/:productId/variant',
        schema: {
          summary: 'Создать вариант продукта',
          tags: ['Управление вариантами продуктов'],
          params: {
            productId: schemas.properties._id
          },
          body: variantSchemas.entities.CreateVariant,
          response: {
            [201]: new Created(variantSchemas.entities.BaseVariant, 'variant'),
            [400]: new BadRequest().bodyErrors().paramsErrors(),
            [404]: new NotFound(ProductDoesNotExist.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const variant = await service.addVariant(request.params.productId, request.body)

          reply
            .code(201)
            .type('application/json')
            .send({variant})
        }
      }
    )
}