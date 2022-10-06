import * as schemas from '../schemas'
import {FastifyInstance} from 'fastify'
import {ProductService} from '@app/product/ProductService'
import {BadRequest, MessageResponse, NotFound} from '@common/schemas/response'
import {VariantService} from '@app/product/packages/variant'
import {DocsTags} from '@app/docs'
import {VariantDoesNotExistError, VariantImageDoesNotExistError} from '@app/product/packages/variant/variant-error'


export interface DetachImageRequest {
  Params: {
    variantId: string,
  }
}


export async function detachImage(fastify: FastifyInstance, service: VariantService, productService: ProductService) {
  return fastify
    .route<DetachImageRequest>(
      {
        method: 'DELETE',
        url: '/admin/product/variant/:variantId',
        schema: {
          summary: 'Удалить картинку продукта',
          tags: [DocsTags.VARIANT_ADMIN],
          params: {
            variantId: schemas.properties._id,
          },
          response: {
            [200]: new MessageResponse('Картинка удалена'),
            [400]: new BadRequest().paramsErrors(),
            [404]: new NotFound(VariantDoesNotExistError.schema(), VariantImageDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.deleteImage(request.params.variantId)

          reply
            .code(200)
            .type('application/json')
            .send({message: 'Картинка удалена'})
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}