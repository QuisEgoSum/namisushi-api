import {VariantService} from '@app/product/packages/variant/VariantService'
import {VariantRepository} from '@app/product/packages/variant/VariantRepository'
import {VariantModel} from '@app/product/packages/variant/VariantModel'


class Variant {
  public readonly service: VariantService
  constructor(service: VariantService) {
    this.service = service
  }
}


export async function initVariant(): Promise<Variant> {
  return new Variant(new VariantService(new VariantRepository(VariantModel)))
}

export type {
  Variant
}