import './order-validator'
import {OrderRepository} from './OrderRepository'
import {OrderModel} from './OrderModel'
import {OrderService} from './OrderService'
import {routes} from './routes'
import {OrderCondition, OrderDiscount, OrderTelegramEvent} from './enums'
import {Counter, initCounter} from '@app/order/packages/counter'
import type {Product} from '@app/product'
import type {Notification} from '@app/notification'
import type {User} from '@app/user'
import type {FastifyInstance} from 'fastify'
import {Telegram} from '../../server/telegram/Telegram'
import {register} from '@app/order/order-telegram-handler'
import {OrderNotificationService} from '@app/order/OrderNotificationService'
import {OrderTelegramRepository} from '@app/order/OrderTelegramRepository'
import {OrderTelegramModel} from '@app/order/OrderTelegramModel'
import {DiscountService} from '@app/order/DiscountService'
import {OrderTelegramMessageRepository} from '@app/order/OrderTelegramMessageRepository'
import {OrderTelegramMessageModel} from '@app/order/OrderTelegramMessageModel'


class Order {
  public readonly OrderCondition: typeof OrderCondition
  public readonly OrderDiscount: typeof OrderDiscount
  constructor(
    public readonly service: OrderService,
    public readonly counter: Counter,
    public readonly orderNotificationService: OrderNotificationService,
    public readonly user: User
  ) {
    this.OrderCondition = OrderCondition
    this.OrderDiscount = OrderDiscount

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service, this.orderNotificationService)
  }
}


export async function initOrder(
  product: Product,
  notification: Notification,
  user: User,
  telegram: Telegram
) {
  const counter = await initCounter()
  const discountService = new DiscountService()
  const orderNotificationService = new OrderNotificationService(
    notification.service,
    new OrderTelegramRepository(OrderTelegramModel),
    new OrderTelegramMessageRepository(OrderTelegramMessageModel),
    telegram
  )
  const service = new OrderService(
    new OrderRepository(OrderModel),
    product.service,
    counter.service,
    orderNotificationService,
    user.service,
    discountService
  )
  register(telegram, service)
  return new Order(service, counter, orderNotificationService, user)
}


export type {
  Order
}


export {
  OrderCondition,
  OrderDiscount,
  OrderTelegramEvent
}