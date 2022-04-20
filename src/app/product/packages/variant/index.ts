import {VariantService} from '@app/product/packages/variant/VariantService'
import {VariantRepository} from '@app/product/packages/variant/VariantRepository'
import {VariantModel, IVariant} from '@app/product/packages/variant/VariantModel'
import {routes} from '@app/product/packages/variant/routes'
import type {ProductService} from '@app/product'
import type {FastifyInstance} from 'fastify'


class Variant {
  public readonly service: VariantService
  constructor(service: VariantService) {
    this.service = service
  }

  async router(fastify: FastifyInstance, productService: ProductService) {
    await routes(fastify, this.service, productService)
  }
}


export async function initVariant(): Promise<Variant> {
  const service = new VariantService(new VariantRepository(VariantModel))
  await service.resetIconsList()
  return new Variant(service)
}


export type {
  Variant,
  VariantService,
  IVariant
}