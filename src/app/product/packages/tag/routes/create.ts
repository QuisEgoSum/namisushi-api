import * as schemas from '@app/product/packages/tag/schemas'
import type {TagService} from '@app/product/packages/tag/TagService'
import {TagExistsError} from '@app/product/packages/tag/tag-error'
import {ContentType, DocsTags} from '@app/docs'
import {BadRequest, Created} from '@common/schemas/response'
import {config} from '@config'
import type {FastifyInstance} from 'fastify'


interface CreateRequest {
  Body: schemas.entities.CreateTag
}


export async function create(fastify: FastifyInstance, service: TagService) {
  return fastify
    .route<CreateRequest>(
      {
        url: '/admin/product/tag',
        method: 'POST',
        schema: {
          summary: 'Создать тег',
          tags: [DocsTags.PRODUCT_TAG_ADMIN],
          description: 'Один файл в `icon` свойстве'
            + `<br/><br/>*Допустимый mimetype: \`image/svg+xml\`.*`
            + `<br/>*Максимальный размер файла ${config.product.tag.icon.maximumSize}b.*`,
          consumes: [ContentType.FORM_DATA],
          body: schemas.entities.CreateTag,
          response: {
            [201]: Created.fromEntity(schemas.entities.BaseTag, 'tag'),
            [400]: new BadRequest(TagExistsError.schema()).bodyErrors()
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const tag = await service.createTag(request.body.name, request.body.icon[0])

          reply
            .code(201)
            .type('application/json')
            .send({tag})
        }
      }
    )
}