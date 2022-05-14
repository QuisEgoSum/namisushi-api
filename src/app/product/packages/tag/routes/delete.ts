import * as schemas from '../schemas'
import type {TagService} from '@app/product/packages/tag'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'
import {ContentType, DocsTags} from '@app/docs'
import {MessageResponse, NotFound} from '@common/schemas/response'
import {TagDoesNotExistError} from '@app/product/packages/tag/tag-error'


interface DeleteRequest {
  Params: {
    tagId: string
  }
}


export async function deleteTag(fastify: FastifyInstance, service: TagService, productService: ProductService) {
  return fastify
    .route<DeleteRequest>(
      {
        url: '/admin/product/tag/:tagId',
        method: 'DELETE',
        schema: {
          summary: 'Удалить тег',
          tags: [DocsTags.PRODUCT_TAG_ADMIN],
          params: {
            tagId: schemas.properties._id
          },
          response: {
            [200]: new MessageResponse('Тег удален'),
            [404]: new NotFound(TagDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.deleteById(request.params.tagId)

          reply
            .code(200)
            .type(ContentType.APPLICATION_JSON)
            .send({message: 'Тег удален'})
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}