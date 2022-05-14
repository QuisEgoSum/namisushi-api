import {ITagEventEmitter, TagEvents} from '@app/product/packages/tag'
import {ProductService} from '@app/product/ProductService'
import {Types} from 'mongoose'
import {logger as defaultLogger} from '@logger'


const logger = defaultLogger.child({label: 'ProductEventListener'})


export class ProductEventListener {
  private static errorHandler(error: Error) {
    logger.error(error)
  }

  constructor(
    private readonly productService: ProductService,
    private readonly tagEmitter: ITagEventEmitter
  ) {
    this.tagEmitter
      .on(TagEvents.DELETE_TAG, (tagId) => this.pullTag(tagId).catch(ProductEventListener.errorHandler))
  }

  private async pullTag(tagId: Types.ObjectId) {
    await this.productService.pullTag(tagId)
  }
}