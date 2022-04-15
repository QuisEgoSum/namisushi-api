import {BaseService} from '@core/service'
import {IVariant} from '@app/product/packages/variant/VariantModel'
import {VariantRepository} from '@app/product/packages/variant/VariantRepository'
import {VariantDoesNotExistError, VariantIconDoesNotExistError} from '@app/product/packages/variant/variant-error'
import {UpdateVariant} from '@app/product/packages/variant/schemas/entities'
import {Types} from 'mongoose'
import type {MultipartFile} from 'fastify-multipart'
import {createFilepath, deleteFile, isExistFile, moveFile, readDir} from '@utils/fs'
import {config} from '@config'
import {InternalError} from '@error'


export class VariantService extends BaseService<IVariant, VariantRepository> {
  private icons: Set<string>
  constructor(repository: VariantRepository) {
    super(repository)

    this.Error.EntityDoesNotExistError = VariantDoesNotExistError
    this.icons = new Set()
  }

  async resetIconsList() {
    const icons = await readDir(config.product.variant.icon.destination)
    this.icons = new Set(icons.filter(name => name.endsWith('.svg')))
  }

  async getIcons() {
    return Array.from(this.icons)
  }

  async deleteIcon(filename: string) {
    if (!await isExistFile(config.product.variant.icon.destination, filename)) {
      throw new VariantIconDoesNotExistError()
    }
    if (!await deleteFile(config.product.variant.icon.destination, filename)) {
      throw new InternalError({message: 'При удалении иконки произошла ошибка'})
    }
    await Promise.all([
      this.repository.removeIcon(filename),
      this.resetIconsList()
    ])
  }

  async uploadIcon(file: MultipartFile) {
    const filepath = await createFilepath(config.product.variant.icon.destination, 'svg')
    await moveFile(file.filepath, filepath.filepath)
    await this.resetIconsList()
    return filepath.filename
  }

  async create(entity: Partial<IVariant>) {
    if (entity.icon && !this.icons.has(entity.icon)) {
      throw new VariantIconDoesNotExistError()
    }
    return super.create(entity)
  }

  async findAndUpdate(productId: string, variantId: string, update: UpdateVariant) {
    if (update.icon && !this.icons.has(update.icon)) {
      throw new VariantIconDoesNotExistError()
    }
    return await this.findOneAndUpdate(
      {
        _id: new Types.ObjectId(variantId),
        productId: new Types.ObjectId(productId)
      },
      update
    )
  }
}