import {FastifyInstance} from 'fastify'
import {NewsService} from '@app/news/NewsService'
import {DocsTags} from '@app/docs'
import {slug} from '@app/news/schemas/properties'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import {NewsExpand} from '@app/news/schemas/entities'
import {NewsNotExistError} from '@app/news/news-error'


interface FindById {
  Params: {
    slug: string
  }
}


export async function findById(fastify: FastifyInstance, service: NewsService) {
  return fastify
    .route<FindById>(
      {
        url: '/news/:slug',
        method: 'GET',
        schema: {
          summary: 'Получить новость по id',
          tags: [DocsTags.NEWS],
          params: {
            slug: slug
          },
          response: {
            [200]: Ok.fromEntity(NewsExpand, 'news'),
            [400]: new BadRequest().paramsErrors(),
            [404]: new NotFound(NewsNotExistError.schema())
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          const news = await service.findBySlug(request.params.slug)

          reply
            .code(200)
            .type('application/json')
            .send({news})
        }
      }
    )
}