import {BaseService} from '@core/service'
import {TagDoesNotExistError, TagExistsError} from '@app/product/packages/tag/tag-error'
import * as fs from '@utils/fs'
import {config} from '@config'
import {NoDataForUpdatingError} from '@error'
import {Types} from 'mongoose'
import type {ITag} from './TagModel'
import type {ITagEventEmitter} from './TagEventEmitter'
import {TagEvents} from './TagEventEmitter'
import type {TagRepository} from './TagRepository'
import type {MultipartFile} from '@fastify/multipart'
import {PageOptions} from '@core/repository'


export class TagService extends BaseService<ITag, TagRepository> {
  constructor(
    repository: TagRepository,
    private readonly emitter: ITagEventEmitter
  ) {
    super(repository)

    this.error.EntityExistsError = TagExistsError
    this.error.EntityDoesNotExistError = TagDoesNotExistError
  }

  get iconDestination() {
    return config.product.tag.icon.destination
  }
  
  async createTag(name: string, icon: MultipartFile) {
    const filename = await fs.createFilepath(this.iconDestination, 'svg')
    const tag = await this.create({name: name, icon: filename.filename})
    await fs.writeFile(filename.filepath, icon.file)
    return tag
  }

  async updateTag(tagId: string, name?: string, icon?: MultipartFile) {
    if (!name && !icon) {
      throw new NoDataForUpdatingError()
    }
    if (icon) {
      const filename = await fs.createFilepath(this.iconDestination, 'svg')
      const oldTag = await this.repository.updateTag(tagId, filename.filename, name)
      if (!oldTag) {
        throw new this.error.EntityDoesNotExistError()
      }
      await fs.writeFile(filename.filepath, icon.file)
      await fs.deleteFile(this.iconDestination, oldTag.icon)
      return await this.findById(tagId)
    } else {
      return await this.findOneAndUpdate({_id: new Types.ObjectId(tagId)}, {name}, {new: true})
    }
  }

  /**
   * @override
   */
  async deleteById(tagId: string) {
    const tag = await this.findByIdAndDelete(tagId)
    await fs.deleteFile(this.iconDestination, tag.icon)
    this.emitter.emit(TagEvents.DELETE_TAG, tag._id)
  }

  async find(query: PageOptions) {
    return this.repository.findPage(query)
  }

  async findAll() {
    return this.repository.find({})
  }
}