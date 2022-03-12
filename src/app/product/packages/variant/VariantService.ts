import {BaseService} from '@core/service'
import {IVariant} from '@app/product/packages/variant/VariantModel'
import {VariantRepository} from '@app/product/packages/variant/VariantRepository'
import {VariantDoesNotExist} from '@app/product/packages/variant/variant-error'
import {UpdateVariant} from '@app/product/packages/variant/schemas/entities'
import {Types} from 'mongoose'


export class VariantService extends BaseService<IVariant, VariantRepository> {
  constructor(repository: VariantRepository) {
    super(repository)

    this.Error.EntityNotExistsError = VariantDoesNotExist
  }

  async findAndUpdate(productId: string, variantId: string, update: UpdateVariant) {
    return await this.findOneAndUpdate(
      {
        _id: new Types.ObjectId(variantId),
        productId: new Types.ObjectId(productId)
      },
      update
    )
  }
}