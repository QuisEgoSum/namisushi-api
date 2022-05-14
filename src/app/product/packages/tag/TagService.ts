import {BaseService} from '@core/service'
import {TagDoesNotExistError, TagExistsError} from '@app/product/packages/tag/tag-error'
import * as fs from '@utils/fs'
import {config} from '@config'
import {NoDataForUpdatingError} from '@error'
import {Types} from 'mongoose'
import type {ITag} from './TagModel'
import type {TagRepository} from './TagRepository'
import type {MultipartFile} from '@fastify/multipart'


export class TagService extends BaseService<ITag, TagRepository> {
  constructor(
    repository: TagRepository
  ) {
    super(repository)

    this.error.EntityExistsError = TagExistsError
    this.error.EntityDoesNotExistError = TagDoesNotExistError
  }

  async createTag(name: string, icon: MultipartFile) {
    const filename = await fs.createFilepath(config.product.tag.icon.destination, 'svg')
    const tag = await this.create({name: name, icon: filename.filename})
    await fs.writeFile(filename.filepath, icon.file)
    return tag
  }

  async updateTag(tagId: string, name?: string, icon?: MultipartFile) {
    if (!name && !icon) {
      throw new NoDataForUpdatingError()
    }
    if (icon) {
      const filename = await fs.createFilepath(config.product.tag.icon.destination, 'svg')
      const oldTag = await this.repository.updateTag(tagId, filename.filename, name)
      if (!oldTag) {
        throw new this.error.EntityDoesNotExistError()
      }
      await fs.writeFile(filename.filepath, icon.file)
      await fs.deleteFile(config.product.tag.icon.destination, oldTag.icon)
      return await this.findById(tagId)
    } else {
      return await this.findOneAndUpdate({_id: new Types.ObjectId(tagId)}, {name}, {new: true})
    }
  }
}