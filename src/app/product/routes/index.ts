import {FastifyInstance} from 'fastify'
import {loadRoutes} from '@utils/loader'
import {ProductService} from '@app/product/ProductService'


export async function routes(fastify: FastifyInstance, service: ProductService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: ProductService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service)))
}