import {FastifyInstance} from 'fastify'
import {NewsService} from '@app/news/NewsService'
import {CreateNews, NewsExpand} from '@app/news/schemas/entities'
import {DocsTags} from '@app/docs'
import {BadRequest, Created} from '@common/schemas/response'
import {NewsWithSlugAlreadyExistError, NewsWithTitleAlreadyExistError} from '@app/news/news-error'


interface CreateRequest {
  Body: CreateNews
}


export async function create(fastify: FastifyInstance, service: NewsService) {
  return fastify
    .route<CreateRequest>(
      {
        url: '/admin/news',
        method: 'POST',
        schema: {
          summary: 'Создать новость',
          tags: [DocsTags.NEWS_ADMIN],
          body: CreateNews,
          response: {
            [201]: Created.fromEntity(NewsExpand, 'news'),
            [400]: new BadRequest(
              NewsWithTitleAlreadyExistError.schema(),
              NewsWithSlugAlreadyExistError.schema()
            )
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const news = await service.create(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({news})
        }
      }
    )
}