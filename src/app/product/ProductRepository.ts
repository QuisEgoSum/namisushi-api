import {IProduct, ProductModel, IVariantProduct} from '@app/product/ProductModel'
import {GenericRepository} from '@core/repository/GenericRepository'
import {UpdateSingleProduct, UpdateVariantProduct, VariantProduct} from '@app/product/schemas/entities'
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

  async findAndUpdateVariant(productId: string, update: UpdateVariantProduct): Promise<{_id: Types.ObjectId} | null> {
    return this.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        type: ProductType.VARIANT
      },
      update,
      {
        new: true,
        projection: {_id: 1}
      }
    )
  }

  async findVariantProductById(productId: string): Promise<VariantProduct | null> {
    return this.Model.aggregate<VariantProduct>([
      {$match: {_id: new Types.ObjectId(productId), type: ProductType.VARIANT}},
      {
        $lookup: {
          from: 'product_variants',
          let: {productId: '$_id'},
          pipeline: [
            {$match: {$expr: {productId: '$$productId'}}},
            {$project: {
              productId: 0
            }}
          ],
          as: 'variants'
        }
      }
    ]).then(result => result[0] || null)
  }
}