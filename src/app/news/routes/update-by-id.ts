import {FastifyInstance} from 'fastify'
import {NewsService} from '@app/news/NewsService'
import {NewsExpand, UpdateNews} from '@app/news/schemas/entities'
import {DocsTags} from '@app/docs'
import {_id} from '@app/news/schemas/properties'
import {BadRequest, NotFound, Ok} from '@common/schemas/response'
import {NewsNotExistError, NewsWithSlugAlreadyExistError, NewsWithTitleAlreadyExistError} from '@app/news/news-error'


interface UpdateByIdRequest {
  Params: {
    newsId: string
  }
  Body: UpdateNews
}


export async function updateById(fastify: FastifyInstance, service: NewsService) {
  return fastify
    .route<UpdateByIdRequest>(
      {
        url: '/admin/news/:newsId',
        method: 'PATCH',
        schema: {
          summary: 'Обновить новость',
          tags: [DocsTags.NEWS_ADMIN],
          params: {
            type: 'object',
            properties: {
              newsId: _id
            }
          },
          body: UpdateNews,
          response: {
            [200]: Ok.fromEntity(NewsExpand, 'news'),
            [400]: new BadRequest(
              NewsWithTitleAlreadyExistError.schema(),
              NewsWithSlugAlreadyExistError.schema()
            ).updateError(),
            [404]: new NotFound(NewsNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          const news = await service.findByIdAndUpdate(request.params.newsId, request.body)

          reply
            .code(200)
            .type('application/json')
            .send({news})
        }
      }
    )
}