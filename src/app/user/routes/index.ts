import {loadRoutes} from '@utils/loader'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'



export async function routes(
  fastify: FastifyInstance,
  service: UserService
) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: UserService) => Promise<FastifyInstance>>(__dirname)

  await Promise.all(routes.map(route => route(fastify, service)))
}