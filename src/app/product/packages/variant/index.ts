import {VariantService} from '@app/product/packages/variant/VariantService'
import {VariantRepository} from '@app/product/packages/variant/VariantRepository'
import {VariantModel} from '@app/product/packages/variant/VariantModel'
import {routes} from '@app/product/packages/variant/routes'
import type {FastifyInstance} from 'fastify'


class Variant {
  public readonly service: VariantService
  constructor(service: VariantService) {
    this.service = service
  }

  async router(fastify: FastifyInstance) {
    return await routes(fastify, this.service)
  }
}


export async function initVariant(): Promise<Variant> {
  return new Variant(new VariantService(new VariantRepository(VariantModel)))
}

export type {
  Variant
}