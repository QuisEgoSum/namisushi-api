import {GenericService} from '@core/service'
import {IProduct, SingleProduct, VariantProduct} from './ProductModel'
import {ProductRepository} from '@app/product/ProductRepository'
import {CreateSingleProduct, CreateVariantProduct} from '@app/product/schemas/entities'
import {ProductType} from '@app/product/ProductType'


export class ProductService extends GenericService<IProduct, ProductRepository> {
  constructor(repository: ProductRepository) {
    super(repository)
  }

  async createSingle(product: CreateSingleProduct) {
    return await this.create<SingleProduct>({
      type: ProductType.SINGLE,
      title: product.title,
      description: product.description,
      show: product.show,
      cost: product.cost,
      ingredients: product.ingredients,
      weight: product.weight
    })
  }

  async createVariant(product: CreateVariantProduct) {
    return await this.create<VariantProduct>({
      type: ProductType.VARIANT,
      title: product.title,
      description: product.description,
      show: product.show,
      ingredients: product.ingredients,
      variants: product.variants
    })
  }
}