import {BaseRepository} from '@core/repository'
import {ICategory} from '@app/product/packages/category/CategoryModel'
import {Types} from 'mongoose'


export class CategoryRepository extends BaseRepository<ICategory> {

  async addCategory(categoryId: string, productId: string) {
    const productObjectId = new Types.ObjectId(productId)
    return await this.findOneAndUpdate(
      {
        _id: new Types.ObjectId(categoryId),
        productIds: {$ne: productObjectId}
      },
      {
        $addToSet: {
          productIds: productObjectId
        }
      }
    )
  }

  async pullCategory(categoryId: string, productId: string) {
    const productObjectId = new Types.ObjectId(productId)
    return await this.findOneAndUpdate(
      {
        _id: new Types.ObjectId(categoryId),
        productIds: productObjectId
      },
      {
        $pull: {
          productIds: productObjectId
        }
      }
    )
  }
}