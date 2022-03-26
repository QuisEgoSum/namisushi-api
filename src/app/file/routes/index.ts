import {FastifyInstance} from 'fastify'
import {loadRoutes} from '@utils/loader'


export async function routes(fastify: FastifyInstance) {
  const routes = await loadRoutes<(fastify: FastifyInstance) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify)))
}