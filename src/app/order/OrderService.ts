import {BaseService} from '@core/service'
import {IOrder} from '@app/order/OrderModel'
import {OrderRepository} from '@app/order/OrderRepository'
import {OrderDoesNotExistError} from '@app/order/order-error'
import {CreateOrder} from '@app/order/schemas/entities'
import {Types} from 'mongoose'


export class OrderService extends BaseService<IOrder, OrderRepository> {
  constructor(repository: OrderRepository) {
    super(repository)

    this.Error.EntityNotExistsError = OrderDoesNotExistError
  }

  async createOrder(order: CreateOrder, userId: Types.ObjectId) {
    return null
  }
}