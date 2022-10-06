import {BaseRepository} from '@core/repository'
import {IVariant} from '@app/product/packages/variant/VariantModel'


export class VariantRepository extends BaseRepository<IVariant> {
  async removeIcon(filename: string) {
    await this.Model.updateMany({icon: filename}, {icon: null})
  }

  async setImage(variantId: string, filename: string) {
    await this.updateById(variantId, {image: filename})
  }

  async findAndDeleteImage(variantId: string) {
    return await this.findByIdAndUpdate(variantId, {image: null}, {new: false})
  }
}