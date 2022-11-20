import {loadRoutes} from '@utils/loader'
import type {OrderService} from '@app/order/OrderService'
import type {FastifyInstance} from 'fastify'
import {OrderNotificationService} from '@app/order/OrderNotificationService'


export async function routes(
  fastify: FastifyInstance,
  service: OrderService,
  orderNotificationService: OrderNotificationService
) {
  const routes = await loadRoutes<
    (
      fastify: FastifyInstance,
      service: OrderService,
      orderNotificationService: OrderNotificationService
    ) => Promise<FastifyInstance>
    >(__dirname)
  return Promise.all(routes.map(router => router(fastify, service, orderNotificationService)))
}