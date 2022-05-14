import {loadRoutes} from '@utils/loader'
import type {TagService} from '@app/product/packages/tag/TagService'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'


export async function routes(fastify: FastifyInstance, service: TagService, productService: ProductService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: TagService, productService: ProductService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service, productService)))
}