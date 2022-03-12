import {IProduct, ProductModel} from '@app/product/ProductModel'
import {GenericRepository} from '@core/repository/GenericRepository'
import {UpdateSingleProduct} from '@app/product/schemas/entities'
import {Types} from 'mongoose'
import {ProductType} from '@app/product/ProductType'


export class ProductRepository extends GenericRepository<IProduct> {
  constructor(Model: typeof ProductModel) {
    super(Model)
  }

  async findAndUpdateSingle(productId: string, update: UpdateSingleProduct) {
    return this.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        type: ProductType.SINGLE
      },
      update
    )
  }
}