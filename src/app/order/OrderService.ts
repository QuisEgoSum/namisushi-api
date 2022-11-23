import {BaseService} from '@core/service'
import {rawPopulatedTransform} from '@app/order/order-transform'
import {CreatedOrderDoesNotExistError, MISSING_ADDRESS_ERROR, OrderDoesNotExistError} from '@app/order/order-error'
import * as schemas from '@app/order/schemas'
import type {IOrder} from '@app/order/OrderModel'
import type {OrderRepository} from '@app/order/OrderRepository'
import type {CreateOrder} from '@app/order/schemas/entities'
import type {ProductService} from '@app/product/ProductService'
import type {CounterService} from '@app/order/packages/counter/CounterService'
import {Types} from 'mongoose'
import {OrderCondition} from '@app/order/enums'
import {OrderNotificationService} from '@app/order/OrderNotificationService'
import {UserService} from '@app/user'
import {DiscountService} from '@app/order/DiscountService'


export type InitOrder = Partial<IOrder> & {productsSum: number, weight: number, cost: number}


export class OrderService extends BaseService<IOrder, OrderRepository> {
  constructor(
    repository: OrderRepository,
    private readonly productService: ProductService,
    private readonly counterService: CounterService,
    private readonly orderNotificationService: OrderNotificationService,
    private readonly userService: UserService,
    private readonly discountService: DiscountService
  ) {
    super(repository)

    this.error.EntityDoesNotExistError = OrderDoesNotExistError
  }

  async createOrder(createOrder: CreateOrder) {
    if (createOrder.delivery && !createOrder.address) {
      throw MISSING_ADDRESS_ERROR
    }
    if (!createOrder.clientId) {
      createOrder.clientId = await this.userService.upsertByPhone(
        createOrder.phone,
        createOrder.username
      )
    } else {
      await this.userService.setNameIfNull(
        createOrder.clientId,
        createOrder.username
      )
    }
    const order: InitOrder = {
      username: createOrder.username,
      phone: createOrder.phone,
      delivery: createOrder.delivery,
      deliveryCost: createOrder.deliveryCost || null,
      address: createOrder.address || null,
      additionalInformation: createOrder.additionalInformation,
      cost: 0,
      productsSum: 0,
      weight: 0,
      clientId: createOrder.clientId,
      condition: OrderCondition.NEW,
      isTestOrder: createOrder.isTestOrder,
      time: createOrder.time || null
    }
    if (createOrder.delivery && (createOrder.deliveryCost === null || createOrder.deliveryCost === undefined)) {
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
    await this.discountService.make(order)
    if (typeof order.deliveryCost === 'number') {
      order.cost += order.deliveryCost
    }
    order.number = await this.counterService.inc(order.isTestOrder)
    const savedOrder = await this.repository.create(order)
    const rawPopulatedOrder = await this.repository.findPopulatedOrderById(savedOrder._id)
    if (!rawPopulatedOrder) throw new CreatedOrderDoesNotExistError()
    return rawPopulatedTransform(rawPopulatedOrder)
  }

  async findByNumber(number: number, isTestOrder = false, clientId?: Types.ObjectId) {
    const order = await this.repository.findPopulatedOrderByNumber(number, isTestOrder, clientId)
    if (order === null) {
      throw new this.error.EntityDoesNotExistError()
    }
    return rawPopulatedTransform(order)
  }

  async find(query: schemas.entities.FindQueryAdmin) {
    return this.repository.findExpandPage(query)
  }

  private async updateCondition(order: IOrder | null, condition: OrderCondition) {
    if (!order) {
      throw new this.error.EntityDoesNotExistError()
    }
    if (order.condition != condition) {
      await this.orderNotificationService.updateStatus(String(order._id), condition, order.delivery, order.clientId)
    }
  }

  async updateConditionByNumber(number: number, condition: OrderCondition, isTestOrder = false) {
    await this.updateCondition(
      await this.repository.findAndUpdateConditionByNumber(number, condition, isTestOrder),
      condition
    )
  }

  async updateConditionById(orderId: string, condition: OrderCondition) {
    await this.updateCondition(
      await this.repository.findAndUpdateConditionById(orderId, condition),
      condition
    )
  }
}