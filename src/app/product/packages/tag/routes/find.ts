import {FastifyInstance} from 'fastify'
import {schemas, TagService} from '@app/product/packages/tag'
import {ContentType, DocsTags} from '@app/docs'
import {QueryPageLimit, QueryPageNumber} from '@common/schemas/query'
import {DataList} from '@common/schemas/response'


export interface FindRequest {
  Querystring: {
    page: number
    limit: number
  }
}


export async function find(fastify: FastifyInstance, service: TagService) {
  return fastify
    .route<FindRequest>(
      {
        url: '/admin/product/tags',
        method: 'GET',
        schema: {
          summary: 'Получить список тегов',
          tags: [DocsTags.PRODUCT_TAG_ADMIN],
          query: {
            page: new QueryPageNumber().setDefault(1),
            limit: new QueryPageLimit().setDefault(10)
          },
          response: {
            [200]: new DataList(schemas.entities.BaseTag)
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const data = await service.find(request.query)

          reply
            .code(200)
            .type(ContentType.APPLICATION_JSON)
            .send(data)
        }
      }
    )
}