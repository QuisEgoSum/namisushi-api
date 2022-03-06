import {GenericService} from '@core/service'
import {IProduct} from './ProductModel'
import {ProductRepository} from '@app/product/ProductRepository'


export class ProductService extends GenericService<IProduct, ProductRepository> {
  constructor(repository: ProductRepository) {
    super(repository)
  }
}