import {NewsService} from '@app/news/NewsService'
import {FastifyInstance} from 'fastify'
import {routes} from '@app/news/routes'
import {NewsModel} from '@app/news/NewsModel'
import {NewsRepository} from '@app/news/NewsRepository'


class News {
  constructor(
    private readonly service: NewsService
  ) {
    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }
}

export async function initNews(): Promise<News> {
  return new News(new NewsService(new NewsRepository(NewsModel)))
}

export type {
  News
}
