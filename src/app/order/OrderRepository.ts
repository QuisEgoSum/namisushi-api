import {BaseRepository} from '@core/repository'
import * as schemas from '@app/order/schemas'
import {OrderCondition} from '@app/order/enums'
import {DataList} from '@common/data'
import {FilterQuery, Types} from 'mongoose'
import type {IOrder} from '@app/order/OrderModel'
import type {RawPopulatedOrder} from '@app/order/schemas/entities'


export class OrderRepository extends BaseRepository<IOrder> {
  private static readonly LOOKUP_PRODUCTS_STAGES = [
    {
      $lookup: {
        from: 'products',
        localField: 'products.productId',
        foreignField: '_id',
        as: '_products'
      }
    },
    {
      $lookup: {
        from: 'product_variants',
        localField: 'products.variantId',
        foreignField: '_id',
        as: '_variants'
      }
    }
  ]

  async findPopulatedOrderById(_id: Types.ObjectId): Promise<RawPopulatedOrder | null> {
    return this.Model.aggregate<RawPopulatedOrder>([
      {$match: {_id: _id}},
      ...OrderRepository.LOOKUP_PRODUCTS_STAGES
    ])
      .then(result => result[0] || null)
  }

  async findPopulatedOrderByNumber(number: number, isTestOrder = false, clientId?: Types.ObjectId): Promise<RawPopulatedOrder | null> {
    const match: FilterQuery<IOrder> = {number: number, isTestOrder: isTestOrder}
    if (clientId) {
      match.clientId = clientId
    }
    return this.Model.aggregate<RawPopulatedOrder>([
      {$match: match},
      ...OrderRepository.LOOKUP_PRODUCTS_STAGES
    ])
      .then(result => result[0] || null)
  }

  findExpandPage(query: schemas.entities.FindQueryAdmin): Promise<DataList<schemas.entities.PreviewExpandOrder>> {
    const filter: FilterQuery<IOrder> = {isTestOrder: false}
    if (query.fClientId) {
      filter.clientId = new Types.ObjectId(query.fClientId)
    }
    if (query.fCondition) {
      filter.condition = query.fCondition
    }
    if (query.fIsTestOrder) {
      filter.isTestOrder = true
    }
    return this.findPage(
      {limit: query.limit, page: query.page},
      filter,
      {
        number: 1,
        clientId: 1,
        phone: 1,
        address: 1,
        cost: 1,
        username: 1,
        condition: 1,
        delivery: 1,
        discount: 1,
        additionalInformation: 1,
        deliveryCalculateManually: 1,
        createdAt: 1,
        isTestOrder: 1,
        time: 1
      },
      {
        sort: {createdAt: query.sCreatedAt}
      }
    )
  }

  async findAndUpdateConditionByNumber(number: number, condition: OrderCondition, isTestOrder: boolean) {
    return await this.findOneAndUpdate(
      {number, isTestOrder},
      {$set: {condition}},
      {new: false, projection: {delivery: 1, clientId: 1, condition: 1}}
    )
  }

  async findAndUpdateConditionById(orderId: string | Types.ObjectId, condition: OrderCondition) {
    return await this.findOneAndUpdate(
      {_id: new Types.ObjectId(orderId)},
      {$set: {condition}},
      {new: false, projection: {delivery: 1, clientId: 1, condition: 1}}
    )
  }
}