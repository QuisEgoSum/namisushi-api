import {BaseService} from '@core/service'
import {rawPopulatedTransform} from '@app/order/order-transform'
import {CreatedOrderDoesNotExistError, OrderDoesNotExistError} from '@app/order/order-error'
import {OrderDiscount} from '@app/order/OrderDiscount'
import {OrderCondition} from '@app/order/OrderCondition'
import {config} from '@config'
import {Types} from 'mongoose'
import type {IOrder} from '@app/order/OrderModel'
import type {OrderRepository} from '@app/order/OrderRepository'
import type {CreateOrder} from '@app/order/schemas/entities'
import type {ProductService} from '@app/product/ProductService'
import type {CounterService} from '@app/order/packages/counter/CounterService'


export class OrderService extends BaseService<IOrder, OrderRepository> {
  private readonly productService: ProductService
  private readonly discounts: {[key in OrderDiscount]: number}
  private readonly counterService: CounterService

  /**
   * @summary С понедельника по четверг с 11:00 до 16:00
   */
  private static isWeekday(): boolean {
    const date = new Date()
    const day = date.getDay()
    const isRequiredDay = day >= 1 && day <= 4
    if (!isRequiredDay) {
      return false
    }
    const time = date.getHours() * 60 + date.getMinutes()
    return  time >= 660 && time < 960
  }

  constructor(
    repository: OrderRepository,
    productService: ProductService,
    counterService: CounterService
  ) {
    super(repository)

    this.productService = productService
    this.counterService = counterService

    this.Error.EntityNotExistsError = OrderDoesNotExistError

    this.discounts = {
      [OrderDiscount.WEEKDAY]: config.order.discount.weekday,
      [OrderDiscount.WITHOUT_DELIVERY]: config.order.discount.withoutDelivery
    }
  }

  async createOrder(createOrder: CreateOrder, userId: Types.ObjectId | null) {
    const order: Partial<IOrder> & {productsSum: number, weight: number} = {
      username: createOrder.username,
      phone: createOrder.phone,
      delivery: createOrder.delivery,
      deliveryCost: createOrder.deliveryCost,
      address: createOrder.address,
      additionalInformation: createOrder.additionalInformation,
      cost: 0,
      productsSum: 0,
      weight: 0,
      clientId: userId,
      condition: OrderCondition.NEW,
      isTestOrder: createOrder.isTestOrder
    }
    if (createOrder.delivery && createOrder.deliveryCost === null) {
      order.deliveryCalculateManually = true
    } else if (order.delivery) {
      order.deliveryCalculateManually = false
    } else {
      order.deliveryCalculateManually = null
    }
    order.products = await this.productService.findAndCalculateProducts(createOrder.products)
    for (const product of order.products) {
      order.productsSum += product.cost * product.number
      order.weight += product.weight * product.number
    }
    const discounts: {type: OrderDiscount, percent: number}[] = []
    if (!createOrder.delivery) {
      discounts.push({type: OrderDiscount.WITHOUT_DELIVERY, percent: this.discounts[OrderDiscount.WITHOUT_DELIVERY]})
    }
    if (OrderService.isWeekday()) {
      discounts.push({type: OrderDiscount.WEEKDAY, percent: this.discounts[OrderDiscount.WEEKDAY]})
    }
    order.discount = discounts
      .sort((a, b) =>  a.percent > b.percent ? -1 : 1)[0] || null
    if (order.discount) {
      order.cost = Math.floor(order.productsSum * (100 - order.discount.percent) / 100)
    } else {
      order.cost = order.productsSum
    }
    order.number = await this.counterService.inc(order.isTestOrder)
    const savedOrder = await this.repository.create(order)
    const rawPopulatedOrder = await this.repository.findPopulatedOrderById(savedOrder._id)
    if (!rawPopulatedOrder) throw new CreatedOrderDoesNotExistError()
    const populatedOrder = rawPopulatedTransform(rawPopulatedOrder)
    //TODO: Event
    return populatedOrder
  }
}