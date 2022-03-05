import {loadRoutes} from '@utils/loader'
import type {FastifyInstance} from 'fastify'


export async function routes(
  fastify: FastifyInstance
) {
  const routes = await loadRoutes<(fastify: FastifyInstance) => Promise<FastifyInstance>>(__dirname)

  await Promise.all(routes.map(route => route(fastify)))
}