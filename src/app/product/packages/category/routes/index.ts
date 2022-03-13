import {FastifyInstance} from 'fastify'
import {loadRoutes} from '@utils/loader'
import {CategoryService} from '@app/product/packages/category/CategoryService'


export async function routes(fastify: FastifyInstance, service: CategoryService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: CategoryService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service)))
}