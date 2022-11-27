import {DocsTags} from '@app/docs'
import {News, NewsQuery} from '@app/news/schemas/entities'
import {DataList} from '@common/schemas/response'
import {FastifyInstance} from 'fastify'
import {NewsService} from '@app/news/NewsService'


interface FindRequest {
  Querystring: NewsQuery
}


export async function find(fastify: FastifyInstance, service: NewsService) {
  return fastify
    .route<FindRequest>(
      {
        url: '/news',
        method: 'GET',
        schema: {
          summary: 'Получить новости',
          tags: [DocsTags.NEWS],
          query: NewsQuery,
          response: {
            [200]: new DataList(News)
          }
        },
        security: {
          auth: false
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