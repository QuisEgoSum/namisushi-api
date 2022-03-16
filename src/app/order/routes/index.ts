import {FastifyInstance} from 'fastify'
import {loadRoutes} from '@utils/loader'
import {OrderService} from '@app/order/OrderService'


export async function routes(fastify: FastifyInstance, service: OrderService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: OrderService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service)))
}