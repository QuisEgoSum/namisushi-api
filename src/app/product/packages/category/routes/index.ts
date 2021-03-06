import {loadRoutes} from '@utils/loader'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import type {ProductService} from '@app/product/ProductService'
import type {FastifyInstance} from 'fastify'


export async function routes(fastify: FastifyInstance, service: CategoryService, productService: ProductService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: CategoryService, productService: ProductService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service, productService)))
}