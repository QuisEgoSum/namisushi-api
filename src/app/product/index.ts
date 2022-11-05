import * as schemas from './schemas'
import * as error from './product-error'
import {ProductService} from '@app/product/ProductService'
import {ProductRepository} from '@app/product/ProductRepository'
import {ProductModel} from './ProductModel'
import {routes} from '@app/product/routes'
import {initVariant, Variant} from '@app/product/packages/variant'
import {initCategory, Category} from '@app/product/packages/category'
import type {FastifyInstance} from 'fastify'
import {initTag, Tag} from '@app/product/packages/tag'
import {ProductEventListener} from '@app/product/ProductEventListener'
import {Favorite, initFavorite} from '@app/product/packages/favorite'


class Product {
  public readonly schemas: typeof schemas
  public readonly error: typeof error
  constructor(
    public readonly service: ProductService,
    public readonly variant: Variant,
    public readonly category: Category,
    public readonly tag: Tag,
    public readonly favorite: Favorite,
    private readonly listener: ProductEventListener
  ) {
    this.schemas = schemas
    this.error = error

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await Promise.all([
      routes(fastify, this.service),
      this.category.router(fastify, this.service),
      this.variant.router(fastify, this.service),
      this.tag.router(fastify, this.service),
      this.favorite.router(fastify)
    ])
  }
}


export async function initProduct(): Promise<Product> {
  const variant = await initVariant()
  const category = await initCategory()
  const tag = await initTag()
  const favorite = await initFavorite()

  const service = new ProductService(
    new ProductRepository(ProductModel),
    variant.service,
    category.service,
    tag.service,
    favorite.service
  )

  await service.reloadVisibleProductsCache()

  const listener = new ProductEventListener(service, tag.emitter)

  return new Product(
    service,
    variant,
    category,
    tag,
    favorite,
    listener
  )
}

export {
  schemas,
  error
}

export type {
  Product,
  ProductService
}