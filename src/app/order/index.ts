import {OrderRepository} from './OrderRepository'
import {OrderModel} from './OrderModel'
import {OrderService} from './OrderService'
import {routes} from './routes'
import {OrderCondition} from './OrderCondition'
import {OrderDiscount} from './OrderDiscount'
import {Counter, initCounter} from '@app/order/packages/counter'
import type {FastifyInstance} from 'fastify'
import type {Product} from '@app/product'
import type {Notification} from '@app/notification'
import type {User} from '@app/user'


class Order {
  public readonly OrderCondition: typeof OrderCondition
  public readonly OrderDiscount: typeof OrderDiscount
  constructor(
    public readonly service: OrderService,
    public readonly counter: Counter,
    public readonly user: User
  ) {
    this.OrderCondition = OrderCondition
    this.OrderDiscount = OrderDiscount

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service, this.user.service)
  }
}

export async function initOrder(
  product: Product,
  notification: Notification,
  user: User
) {
  const counter = await initCounter()
  const service = new OrderService(new OrderRepository(OrderModel), product.service, counter.service, notification.emitter)
  return new Order(service, counter, user)
}

export type {
  Order
}

export {
  OrderCondition,
  OrderDiscount
}