import {OrderRepository} from './OrderRepository'
import {OrderModel} from './OrderModel'
import {OrderService} from './OrderService'
import {routes} from './routes'
import {OrderCondition} from './OrderCondition'
import {OrderDiscount} from './OrderDiscount'
import type {FastifyInstance} from 'fastify'
import type {ProductService} from '@app/product/ProductService'


class Order {
  public readonly service: OrderService
  public readonly OrderCondition: typeof OrderCondition
  public readonly OrderDiscount: typeof OrderDiscount
  constructor(
    service: OrderService
  ) {
    this.service = service
    this.OrderCondition = OrderCondition
    this.OrderDiscount = OrderDiscount

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }
}

export async function initOrder(productService: ProductService) {
  return new Order(new OrderService(new OrderRepository(OrderModel), productService))
}

export type {
  Order
}

export {
  OrderCondition,
  OrderDiscount
}