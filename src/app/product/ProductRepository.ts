import {IProduct, ISingleProduct, ProductModel} from '@app/product/ProductModel'
import {GenericRepository} from '@core/repository/GenericRepository'
import {UpdateSingleProduct, UpdateVariantProduct, VariantProduct} from '@app/product/schemas/entities'
import {Types} from 'mongoose'
import {ProductType} from '@app/product/ProductType'
import {DataList} from '@common/data'


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

  async addToSetImages(productId: string, images: string[]): Promise<{images: string[]} | null> {
    return this.findByIdAndUpdate<IProduct>(
      new Types.ObjectId(productId),
      {$addToSet: {images}},
      {new: true, projection: {images: 1}}
    )
  }

  async pullImage(productId: string, imageName: string) {
    return this.updateOne({_id: new Types.ObjectId(productId), images: imageName}, {$pull: {images: imageName}})
  }

  async updateOrderImages(productId: string, images: string[], oldImages: string[]) {
    return this.updateOne(
      {_id: new Types.ObjectId(productId), images: oldImages},
      {$set: {images: images}}
    )
  }

  async findAll(): Promise<DataList<ISingleProduct | VariantProduct>> {
    const [singleList, variantList, total] = await Promise.all([
      this.Model.find({type: ProductType.SINGLE}),
      this.Model.aggregate<VariantProduct>([
        {$match: {type: ProductType.VARIANT}},
        {
          $lookup: {
            from: 'product_variants',
            let: {productId: '$_id'},
            pipeline: [
              {$match: {$expr: {productId: '$$productId'}}},
              {$project: {productId: 0}}
            ],
            as: 'variants'
          }
        }
      ]),
      this.Model.count()
    ]) as unknown as [any[], any[], number]
    return new DataList<ISingleProduct | VariantProduct>(total, 1, singleList.concat(variantList))
  }
}