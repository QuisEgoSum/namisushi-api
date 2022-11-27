import {FastifyInstance} from 'fastify'
import {NewsService} from '@app/news/NewsService'
import {DocsTags} from '@app/docs'
import {_id} from '@app/news/schemas/properties'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import {NewsExpand} from '@app/news/schemas/entities'
import {NewsNotExistError} from '@app/news/news-error'


interface FindByIdAdmin {
  Params: {
    newsId: string
  }
}


export async function findByIdAdmin(fastify: FastifyInstance, service: NewsService) {
  return fastify
    .route<FindByIdAdmin>(
      {
        url: '/admin/news/:newsId',
        method: 'GET',
        schema: {
          summary: 'Получить новость по id',
          tags: [DocsTags.NEWS_ADMIN],
          params: {
            newsId: _id
          },
          response: {
            [200]: Ok.fromEntity(NewsExpand, 'news'),
            [400]: new BadRequest().paramsErrors(),
            [404]: new NotFound(NewsNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const news = await service.findById(request.params.newsId)

          reply
            .code(200)
            .type('application/json')
            .send({news})
        }
      }
    )
}