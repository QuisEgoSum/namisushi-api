import {BaseService, ServiceError} from '@core/service'
import {IFavorite} from '@app/product/packages/favorite/FavoriteModel'
import {FavoriteRepository} from '@app/product/packages/favorite/FavoriteRepository'
import * as error from '@app/product/packages/favorite/favorite-error'
import {Types} from 'mongoose'
import {IProduct} from '@app/product/ProductModel'


export class FavoriteService extends BaseService<IFavorite, FavoriteRepository> {
  public error: ServiceError & typeof error

  constructor(repository: FavoriteRepository) {
    super(repository)

    this.error = {
      EntityDoesNotExistError: error.ProductNotInFavoriteListError,
      EntityExistsError: error.ProductAlreadyInFavoriteListError,
      ...error
    }
  }

  async append(userId: string | Types.ObjectId, productId: string | Types.ObjectId) {
    await this.create({userId: new Types.ObjectId(userId), productId: new Types.ObjectId(productId)})
  }

  async remove(userId: string | Types.ObjectId, productId: string | Types.ObjectId) {
    await this.deleteOne({userId: new Types.ObjectId(userId), productId: new Types.ObjectId(productId)})
  }

  async find(userId: Types.ObjectId): Promise<IProduct[]> {
    return await this.repository.findProducts(userId)
  }
}