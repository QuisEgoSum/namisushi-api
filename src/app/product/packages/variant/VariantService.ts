import {BaseService, ServiceError} from '@core/service'
import * as error from '@app/product/packages/variant/variant-error'
import * as fs from '@utils/fs'
import {EntityExistsError, InternalError} from '@error'
import {config} from '@config'
import {Types} from 'mongoose'
import type {VariantRepository} from '@app/product/packages/variant/VariantRepository'
import type {IVariant} from '@app/product/packages/variant/VariantModel'
import type {UpdateVariant} from '@app/product/packages/variant/schemas/entities'
import type {MultipartFile} from '@fastify/multipart'


export class VariantService extends BaseService<IVariant, VariantRepository> {
  public error: ServiceError & typeof error

  private icons: Set<string>
  constructor(repository: VariantRepository) {
    super(repository)

    this.error = {
      EntityExistsError: EntityExistsError,
      EntityDoesNotExistError: error.VariantDoesNotExistError,
      ...error
    }
    this.icons = new Set()
  }

  async resetIconsList() {
    const icons = await fs.readDir(config.product.variant.icon.destination)
    this.icons = new Set(icons.filter(name => name.endsWith('.svg')))
  }

  async getIcons() {
    return Array.from(this.icons)
  }

  async deleteIcon(filename: string) {
    if (!await fs.isExistFile(config.product.variant.icon.destination, filename)) {
      throw new this.error.VariantIconDoesNotExistError()
    }
    if (!await fs.deleteFile(config.product.variant.icon.destination, filename)) {
      throw new InternalError({message: 'При удалении иконки произошла ошибка'})
    }
    await Promise.all([
      this.repository.removeIcon(filename),
      this.resetIconsList()
    ])
  }

  async uploadIcon(file: MultipartFile) {
    const filepath = await fs.createFilepath(config.product.variant.icon.destination, 'svg')
    await fs.writeFile(filepath.filepath, await file.toBuffer())
    await this.resetIconsList()
    return filepath.filename
  }

  async create(entity: Partial<IVariant>) {
    if (entity.icon && !this.icons.has(entity.icon)) {
      throw new this.error.VariantIconDoesNotExistError()
    }
    return super.create(entity)
  }

  async findAndUpdate(productId: string, variantId: string, update: UpdateVariant) {
    if (update.icon && !this.icons.has(update.icon)) {
      throw new this.error.VariantIconDoesNotExistError()
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