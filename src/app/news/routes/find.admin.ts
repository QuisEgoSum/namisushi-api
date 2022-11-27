import {NewsService} from '@app/news/NewsService'
import {FastifyInstance} from 'fastify'
import {DocsTags} from '@app/docs'
import {News, NewsQuery} from '@app/news/schemas/entities'
import {DataList} from '@common/schemas/response'


interface FindAdminRequest {
  Querystring: NewsQuery
}


export async function findAdmin(fastify: FastifyInstance, service: NewsService) {
  return fastify
    .route<FindAdminRequest>(
      {
        url: '/admin/news',
        method: 'GET',
        schema: {
          summary: 'Получить новости',
          tags: [DocsTags.NEWS_ADMIN],
          query: NewsQuery,
          response: {
            [200]: new DataList(News)
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const news = await service.find(request.query)

          reply
            .code(200)
            .type('application/json')
            .send(news)
        }
      }
    )
}