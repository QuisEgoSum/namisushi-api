import {loadRoutes} from '@utils/loader'
import type {OrderService} from '@app/order/OrderService'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


export async function routes(fastify: FastifyInstance, service: OrderService, userService: UserService) {
  const routes = await loadRoutes<
    ((fastify: FastifyInstance, service: OrderService, userService: UserService) => Promise<FastifyInstance>)
    | ((fastify: FastifyInstance, service: OrderService) => Promise<FastifyInstance>)
    >(__dirname)
  return Promise.all(routes.map(router => router(fastify, service, userService)))
}