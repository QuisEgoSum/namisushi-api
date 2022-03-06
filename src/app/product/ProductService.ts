import {GenericService} from '@core/service'
import {IProduct, SingleProduct} from './ProductModel'
import {ProductRepository} from '@app/product/ProductRepository'
import {CreateSingleProduct} from '@app/product/schemas/entities'
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
}