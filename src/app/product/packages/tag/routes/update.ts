import * as schemas from '@app/product/packages/tag/schemas'
import {TagDoesNotExistError, TagExistsError} from '@app/product/packages/tag/tag-error'
import {ContentType, DocsTags} from '@app/docs'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import type {TagService} from '@app/product/packages/tag'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'


interface UpdateRequest {
  Body: schemas.entities.UpdateTag,
  Params: {
    tagId: string
  }
}


export async function update(fastify: FastifyInstance, service: TagService, productService: ProductService) {
  return fastify
    .route<UpdateRequest>(
      {
        url: '/admin/product/tag/:tagId',
        method: 'PATCH',
        schema: {
          summary: 'Обновить тег',
          tags: [DocsTags.PRODUCT_TAG_ADMIN],
          consumes: [ContentType.FORM_DATA],
          params: {
            tagId: schemas.properties._id
          },
          body: schemas.entities.UpdateTag,
          response: {
            [200]: Ok.fromEntity(schemas.entities.BaseTag, 'tag'),
            [400]: new BadRequest(TagExistsError.schema()).bodyErrors().updateError(),
            [404]: new NotFound(TagDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const tag = await service.updateTag(request.params.tagId, request.body.name, request.body.icon?.[0])

          reply
            .code(200)
            .type(ContentType.APPLICATION_JSON)
            .send({tag})
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}