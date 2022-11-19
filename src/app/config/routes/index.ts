import {loadRoutes} from '@utils/loader'
import type {FastifyInstance} from 'fastify'
import {ConfigService} from '@app/config/ConfigService'


export async function routes(fastify: FastifyInstance, service: ConfigService) {
  const routes = await loadRoutes<
    (fastify: FastifyInstance, service: ConfigService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service)))
}