import {ProductService} from '@app/product/ProductService'
import {ProductRepository} from '@app/product/ProductRepository'
import {ProductModel} from './ProductModel'
import {FastifyInstance} from 'fastify'
import {routes} from '@app/product/routes'
import * as schemas from './schemas'
import {initVariant, Variant} from '@app/product/packages/variant'


class Product {
  public readonly service: ProductService
  public readonly schemas: typeof import('./schemas')
  public readonly variant: Variant
  constructor(
    service: ProductService,
    variant: Variant
  ) {
    this.service = service
    this.variant = variant
    this.schemas = schemas

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await Promise.all([
      routes(fastify, this.service),
      this.variant.router(fastify)
    ])
  }
}


export async function initProduct(): Promise<Product> {
  const variant = await initVariant()

  return new Product(new ProductService(new ProductRepository(ProductModel), variant.service), variant)
}


export type {
  Product
}