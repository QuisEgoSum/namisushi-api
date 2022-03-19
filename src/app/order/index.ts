import {OrderRepository} from './OrderRepository'
import {OrderModel} from './OrderModel'
import {OrderService} from './OrderService'
import {routes} from './routes'
import {OrderCondition} from './OrderCondition'
import {OrderDiscount} from './OrderDiscount'
import {Counter, initCounter} from '@app/order/packages/counter'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'
import {CounterService} from '@app/order/packages/counter/CounterService'


class Order {
  public readonly service: OrderService
  public readonly counter: Counter
  public readonly OrderCondition: typeof OrderCondition
  public readonly OrderDiscount: typeof OrderDiscount
  constructor(
    service: OrderService,
    counter: Counter
  ) {
    this.service = service
    this.counter = counter
    this.OrderCondition = OrderCondition
    this.OrderDiscount = OrderDiscount

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }
}

export async function initOrder(productService: ProductService) {
  const counter = await initCounter()
  return new Order(new OrderService(new OrderRepository(OrderModel), productService, counter.service), counter)
}

export type {
  Order
}

export {
  OrderCondition,
  OrderDiscount
}