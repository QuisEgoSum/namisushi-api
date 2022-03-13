import {CategoryService} from '@app/product/packages/category/CategoryService'
import {CategoryRepository} from '@app/product/packages/category/CategoryRepository'
import {CategoryModel} from '@app/product/packages/category/CategoryModel'
import {routes} from '@app/product/packages/category/routes'
import type {FastifyInstance} from 'fastify'


class Category {
  public readonly service: CategoryService
  constructor(
    service: CategoryService
  ) {
    this.service = service
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }
}



export async function initCategory(): Promise<Category> {
  return new Category(new CategoryService(new CategoryRepository(CategoryModel)))
}

export type {
  Category
}