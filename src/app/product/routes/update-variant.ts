import {FastifyInstance} from 'fastify'
import {ProductService} from '@app/product/ProductService'
import * as schemas from '@app/product/schemas'
import * as variantSchemas from '@app/product/packages/variant/schemas'
import {BadRequest, Created, NotFound, Ok} from '@common/schemas/response'
import {VariantDoesNotExistError} from '@app/product/packages/variant/variant-error'


interface UpdateVariantRequest {
  Params: {
    productId: string,
    variantId: string
  },
  Body: variantSchemas.entities.UpdateVariant
}


export async function updateVariant(fastify: FastifyInstance, service: ProductService) {
  return fastify
    .route<UpdateVariantRequest>(
      {
        method: 'PATCH',
        url: '/admin/product/VARIANT/:productId/variant/:variantId',
        schema: {
          summary: 'Обновить вариант продукта',
          tags: ['Управление вариантами продуктов'],
          params: {
            productId: schemas.properties._id,
            variantId: variantSchemas.properties._id
          },
          body: variantSchemas.entities.UpdateVariant,
          response: {
            [200]: Ok.fromEntity(variantSchemas.entities.BaseVariant, 'variant'),
            [400]: new BadRequest().bodyErrors().updateError(),
            [404]: new NotFound(VariantDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const variant = await service.findAndUpdateVariant(
            request.params.productId,
            request.params.variantId,
            request.body
          )

          reply
            .code(200)
            .type('application/json')
            .send({variant})
        }
      }
    )
}