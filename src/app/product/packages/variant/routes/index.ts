import {loadRoutes} from '@utils/loader'
import type {VariantService} from '@app/product/packages/variant/VariantService'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'


export async function routes(fastify: FastifyInstance, service: VariantService, productService: ProductService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: VariantService, productService: ProductService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service, productService)))
}