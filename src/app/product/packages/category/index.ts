import {CategoryModel, ICategory} from '@app/product/packages/category/CategoryModel'
import {CategoryRepository} from '@app/product/packages/category/CategoryRepository'
import {CategoryService} from '@app/product/packages/category/CategoryService'
import {routes} from '@app/product/packages/category/routes'
import type {ProductService} from '@app/product/ProductService'
import type {FastifyInstance} from 'fastify'


class Category {
  public readonly service: CategoryService
  constructor(
    service: CategoryService
  ) {
    this.service = service
  }

  async router(fastify: FastifyInstance, productService: ProductService) {
    await routes(fastify, this.service, productService)
  }
}


export async function initCategory(): Promise<Category> {
  return new Category(new CategoryService(new CategoryRepository(CategoryModel)))
}


export type {
  Category,
  CategoryService,
  ICategory
}