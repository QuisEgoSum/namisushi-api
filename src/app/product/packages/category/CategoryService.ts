import {BaseService, ServiceError} from '@core/service'
import {BaseRepositoryError} from '@core/repository'
import * as error from '@app/product/packages/category/category-error'
import type {CategoryRepository} from '@app/product/packages/category/CategoryRepository'
import type {ICategory} from '@app/product/packages/category/CategoryModel'


export class CategoryService extends BaseService<ICategory, CategoryRepository> {

  public error: ServiceError & typeof error

  constructor(repository: CategoryRepository) {
    super(repository)

    this.error = {
      EntityDoesNotExistError: error.CategoryDoesNotExistError,
      EntityExistsError: error.CategoryExistsError,
      ...error
    }
  }

  /**
   * @override
   */
  errorHandler<T>(error: Error | BaseRepositoryError): T {
    if (error instanceof BaseRepositoryError.UniqueKeyError) {
      throw new this.error.EntityExistsError()
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
    throw new this.error.ProductAlreadyInCategoryError()
  }

  async pullProduct(categoryId: string, productId: string) {
    const category = await this.repository.pullCategory(categoryId, productId)
    if (category) return category
    await this.existsById(categoryId)
    throw new this.error.ProductNotInCategoryError()
  }

  findVisible() {
    return this.repository.find({visible: true})
  }
}