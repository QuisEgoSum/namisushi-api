import * as schemas from '../schemas'
import {BadRequest, Created} from '@common/schemas/response'
import type {TagService} from '../TagService'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'
import {config} from '@config'
import {DocsTags} from '@app/docs'


interface CreateRequest {
  Body: schemas.entities.CreateTag
}


export async function create(fastify: FastifyInstance, service: TagService, productService: ProductService) {
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
          consumes: ['multipart/form-data'],
          body: schemas.entities.CreateTag,
          response: {
            [201]: Created.fromEntity(schemas.entities.BaseTag, 'tag'),
            [400]: new BadRequest().bodyErrors()
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
        },
        onSuccessful: () => productService.reloadVisibleProductsCache(true)
      }
    )
}