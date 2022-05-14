import {IProduct, ISingleProduct, ProductModel} from '@app/product/ProductModel'
import {GenericRepository} from '@core/repository/GenericRepository'
import {
  OrderSingleProductList, OrderVariantProductList,
  UpdateSingleProduct,
  UpdateVariantProduct,
  VariantProduct
} from '@app/product/schemas/entities'
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

  async addToSetImages(productId: string, images: string[]): Promise<{images: string[]} | null> {
    return this.findByIdAndUpdate<IProduct>(
      new Types.ObjectId(productId),
      {$addToSet: {images}},
      {new: true, projection: {images: 1}}
    )
  }

  async pullImage(productId: string, filename: string) {
    return this.updateOne({_id: new Types.ObjectId(productId), images: filename}, {$pull: {images: filename}})
  }

  async updateOrderImages(productId: string, images: string[], oldImages: string[]) {
    return this.updateOne(
      {_id: new Types.ObjectId(productId), images: oldImages},
      {$set: {images: images}}
    )
  }

  async findAll(): Promise<Array<ISingleProduct | VariantProduct>> {
    const [singleList, variantList] = await Promise.all([
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
      ])
    ]) as unknown as [any[], any[]]
    return singleList.concat(variantList)
  }

  findSingleVisible() {
    return this.find<ISingleProduct>({type: ProductType.SINGLE, visible: true})
  }

  findVariantVisible() {
    return this.Model.aggregate<VariantProduct>([
      {$match: {type: ProductType.VARIANT, visible: true}},
      {
        $lookup: {
          from: 'product_variants',
          let: {productId: '$_id'},
          pipeline: [
            {$match: {$expr: {productId: '$$productId', visible: true}}},
            {$project: {productId: 0}}
          ],
          as: 'variants'
        }
      }
    ])
  }

  async findOrderSingleVisibleByIds(ids: string[]): Promise<OrderSingleProductList[]> {
    if (!ids.length) {
      return []
    }
    return this.find<ISingleProduct>(
      {
        _id: {$in: ids.map(id => new Types.ObjectId(id))},
        type: ProductType.SINGLE,
        visible: true
      },
      {
        cost: 1,
        weight: 1
      }
    )
  }

  async findOrderVariantVisibleByIds(ids: string[], variantIds: string[]): Promise<OrderVariantProductList[]> {
    if (!ids.length) {
      return []
    }
    return this.Model.aggregate<OrderVariantProductList>([
      {
        $match: {
          _id: {
            $in: ids.map(id => new Types.ObjectId(id))
          },
          type: ProductType.VARIANT,
          visible: true
        }
      },
      {
        $lookup: {
          from: 'product_variants',
          let: {productId: '$_id'},
          pipeline: [
            {
              $match: {
                _id: {$in: variantIds.map(id => new Types.ObjectId(id))},
                visible: true,
                $expr: {
                    productId: '$$productId',
                }
              }
            },
            {
              $project: {
                cost: 1,
                weight: 1
              }
            }
          ],
          as: 'variants'
        }
      },
      {
        $project: {variants: 1}
      }
    ]).exec()
  }

  async pullTag(tagId: Types.ObjectId) {
    await this.Model.updateMany(
      {tags: tagId},
      {$pull: {tags: tagId}}
    )
  }
}