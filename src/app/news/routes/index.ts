import {FastifyInstance} from 'fastify'
import {loadRoutes} from '@utils/loader'
import {NewsService} from '@app/news/NewsService'


export async function routes(fastify: FastifyInstance, service: NewsService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: NewsService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service)))
}