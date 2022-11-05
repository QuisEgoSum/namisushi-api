import {BaseRepository} from '@core/repository'
import {IFavorite} from '@app/product/packages/favorite/FavoriteModel'
import {Types} from 'mongoose'
import {IProduct} from '@app/product/ProductModel'


export class FavoriteRepository extends BaseRepository<IFavorite> {
  async findProducts(userId: Types.ObjectId) {
    return this.Model
      .aggregate<IProduct>(    [
        {$match: {userId: userId}},
        {
          $lookup:
            {
              from: 'products',
              localField: 'productId',
              foreignField: '_id',
              as: 'products'
            }
        },
        {$project: {product: {$arrayElemAt: ["$products", 0]}}},
        {$replaceRoot: {newRoot: '$product'}},
        {
          $lookup:
            {
              from: 'product_tags',
              localField: 'tags',
              foreignField: '_id',
              as: 'tags'
            }
        },
        {$project: {'tags.createdAt': 0, 'tags.updatedAt': 0}},
        {
          $lookup: {
            from: 'product_variants',
            let: {productId: '$_id'},
            pipeline: [
              {$match: {$expr: {$eq: ['$productId', '$$productId']}, visible: true}},
              {$project: {productId: 0}}
            ],
            as: 'variants'
          }
        }
      ])
  }
}