import {BaseService} from '@core/service'
import {TagDoesNotExistError, TagExistsError} from '@app/product/packages/tag/tag-error'
import * as fs from '@utils/fs'
import {config} from '@config'
import type {ITag} from './TagModel'
import type {TagRepository} from './TagRepository'
import type {ProductService} from '@app/product'
import {MultipartFile} from '@fastify/multipart'


export class TagService extends BaseService<ITag, TagRepository> {
  constructor(
    repository: TagRepository,
    private readonly productService: ProductService
  ) {
    super(repository)

    this.error.EntityExistsError = TagExistsError
    this.error.EntityDoesNotExistError = TagDoesNotExistError
  }

  async createTag(name: string, image: MultipartFile) {
    const filename = await fs.createFilepath(config.product.tag.icon.destination, 'svg')
    const tag = await this.create({name: name, icon: filename.filename})
    await fs.writeFile(filename.filepath, image.file)
    return tag
  }
}