import {ProductModel, IProduct} from '@app/product/ProductModel'
import {GenericRepository} from '@core/repository/GenericRepository'


export class ProductRepository extends GenericRepository<IProduct> {
  constructor(Model: typeof ProductModel) {
    super(Model)
  }
}