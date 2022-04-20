import {ProductService} from '@app/product/ProductService'
import {ProductRepository} from '@app/product/ProductRepository'
import {ProductModel} from './ProductModel'
import {routes} from '@app/product/routes'
import {initVariant, Variant} from '@app/product/packages/variant'
import {initCategory, Category} from '@app/product/packages/category'
import * as schemas from './schemas'
import type {FastifyInstance} from 'fastify'


class Product {
  public readonly service: ProductService
  public readonly schemas: typeof import('./schemas')
  public readonly variant: Variant
  public readonly category: Category
  constructor(
    service: ProductService,
    variant: Variant,
    category: Category
  ) {
    this.service = service
    this.variant = variant
    this.category = category
    this.schemas = schemas

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await Promise.all([
      routes(fastify, this.service),
      this.category.router(fastify, this.service),
      this.variant.router(fastify, this.service)
    ])
  }
}


export async function initProduct(): Promise<Product> {
  const variant = await initVariant()
  const category = await initCategory()
  const service = new ProductService(new ProductRepository(ProductModel), variant.service, category.service)

  await service.reloadVisibleProductsCache()

  return new Product(
    service,
    variant,
    category
  )
}


export type {
  Product,
  ProductService
}