import {BaseService} from '@core/service'
import {IVariant} from '@app/product/packages/variant/VariantModel'
import {VariantRepository} from '@app/product/packages/variant/VariantRepository'


export class VariantService extends BaseService<IVariant, VariantRepository> {}