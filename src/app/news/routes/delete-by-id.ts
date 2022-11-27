import {FastifyInstance} from 'fastify'
import {NewsService} from '@app/news/NewsService'
import {DocsTags} from '@app/docs'
import {_id} from '@app/news/schemas/properties'
import {BadRequest, NoContent, NotFound} from '@common/schemas/response'
import {NewsNotExistError} from '@app/news/news-error'


interface DeleteByIdRequest {
  Params: {
    newsId: string
  }
}


export async function deleteById(fastify: FastifyInstance, service: NewsService) {
  return fastify
    .route<DeleteByIdRequest>(
      {
        url: '/admin/news/:newsId',
        method: 'DELETE',
        schema: {
          summary: 'Удалить новость',
          tags: [DocsTags.NEWS_ADMIN],
          params: {
            newsId: _id
          },
          response: {
            [204]: new NoContent(),
            [400]: new BadRequest().paramsErrors(),
            [404]: new NotFound(NewsNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.deleteById(request.params.newsId)

          reply
            .code(204)
            .send()
        }
      }
    )
}