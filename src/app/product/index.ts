import {ProductService} from '@app/product/ProductService'
import {ProductRepository} from '@app/product/ProductRepository'
import {ProductModel} from './ProductModel'
import {FastifyInstance} from 'fastify'
import {routes} from '@app/product/routes'
import * as schemas from './schemas'


class Product {
  public readonly service: ProductService
  public readonly schemas: typeof import('./schemas')
  constructor(
    service: ProductService
  ) {
    this.service = service
    this.schemas = schemas
  }

  async router(fastify: FastifyInstance) {
    return routes(fastify, this.service)
  }
}


export async function initProduct(): Promise<Product> {
  return new Product(new ProductService(new ProductRepository(ProductModel)))
}


export type {
  Product
}