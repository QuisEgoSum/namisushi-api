import {BaseRepository} from '@core/repository'
import {Types} from 'mongoose'
import type {IOrder} from '@app/order/OrderModel'
import type {RawPopulatedOrder} from '@app/order/schemas/entities'


export class OrderRepository extends BaseRepository<IOrder> {
  async findPopulatedOrderById(_id: Types.ObjectId): Promise<RawPopulatedOrder | null> {
    return this.Model.aggregate([
      {$match: {_id: _id}},
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
    ])
      .then(result => result[0])
  }
}