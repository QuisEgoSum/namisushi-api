import {BaseService} from '@core/service'
import {ICategory} from '@app/product/packages/category/CategoryModel'
import {CategoryRepository} from '@app/product/packages/category/CategoryRepository'
import {
  CategoryDoesNotExistError,
  CategoryExistsError,
  ProductAlreadyInCategoryError, ProductNotInCategoryError
} from '@app/product/packages/category/category-error'
import {BaseRepositoryError} from '@core/repository'


export class CategoryService extends BaseService<ICategory, CategoryRepository> {

  constructor(repository: CategoryRepository) {
    super(repository)

    this.Error.EntityNotExistsError = CategoryDoesNotExistError
    this.Error.EntityExistsError = CategoryExistsError
  }

  /**
   * @override
   */
  errorHandler<T>(error: Error | BaseRepositoryError): T {
    if (error instanceof BaseRepositoryError.UniqueKeyError) {
      throw new this.Error.EntityExistsError()
    } else {
      throw error
    }
  }

  async findAll() {
    return this.repository.find({})
  }

  async addProduct(categoryId: string, productId: string) {
    const category = await this.repository.addCategory(categoryId, productId)
    if (category) return category
    await this.existsById(categoryId)
    throw new ProductAlreadyInCategoryError()
  }

  async pullProduct(categoryId: string, productId: string) {
    const category = await this.repository.pullCategory(categoryId, productId)
    if (category) return category
    await this.existsById(categoryId)
    throw new ProductNotInCategoryError()
  }
}