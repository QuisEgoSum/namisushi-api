import {FastifyInstance} from 'fastify'
import {loadRoutes} from '@utils/loader'
import {OrderService} from '@app/order/OrderService'
import {UserService} from '@app/user/UserService'


export async function routes(fastify: FastifyInstance, service: OrderService, userService: UserService) {
  const routes = await loadRoutes<
    ((fastify: FastifyInstance, service: OrderService, userService: UserService) => Promise<FastifyInstance>)
    | ((fastify: FastifyInstance, service: OrderService) => Promise<FastifyInstance>)
    >(__dirname)
  return Promise.all(routes.map(router => router(fastify, service, userService)))
}