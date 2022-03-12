import {loadRoutes} from '@utils/loader'
import type {VariantService} from '@app/product/packages/variant/VariantService'
import type {FastifyInstance} from 'fastify'


export async function routes(fastify: FastifyInstance, service: VariantService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: VariantService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service)))
}