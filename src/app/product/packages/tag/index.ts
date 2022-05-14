import {routes} from './routes'
import * as schemas from './schemas'
import * as error from './tag-error'
import {TagService} from './TagService'
import {TagRepository} from './TagRepository'
import {TagModel, ITag} from './TagModel'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'
import {TagEventEmitter, TagEvents, ITagEventEmitter} from '@app/product/packages/tag/TagEventEmitter'


class Tag {
  public readonly schemas: typeof schemas
  public readonly error: typeof error

  constructor(
    public readonly service: TagService,
    public readonly emitter: ITagEventEmitter
  ) {
    this.schemas = schemas
    this.error = error
  }

  async router(fastify: FastifyInstance, productService: ProductService) {
    await routes(fastify, this.service, productService)
  }
}


export async function initTag() {
  const emitter = new TagEventEmitter()
  return new Tag(new TagService(new TagRepository(TagModel), emitter), emitter)
}


export {
  schemas,
  error,
  TagEvents
}

export type {
  Tag,
  ITag,
  TagService,
  ITagEventEmitter
}