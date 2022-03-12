import {GenericService} from '@core/service'
import {IProduct, ISingleProduct, IVariantProduct} from './ProductModel'
import {ProductRepository} from '@app/product/ProductRepository'
import {
  CreateSingleProduct,
  CreateVariantProduct,
  UpdateSingleProduct, UpdateVariantProduct,
  VariantProduct
} from '@app/product/schemas/entities'
import {ProductType} from '@app/product/ProductType'
import {ProductDoesNotExist} from '@app/product/product-error'
import {VariantService} from '@app/product/packages/variant/VariantService'
import {BaseVariant, CreateVariant} from '@app/product/packages/variant/schemas/entities'
import {Types} from 'mongoose'
import {IVariant} from '@app/product/packages/variant/VariantModel'


export class ProductService extends GenericService<IProduct, ProductRepository> {
  private variantService: VariantService
  constructor(
    repository: ProductRepository,
    variantService: VariantService
  ) {
    super(repository)

    this.variantService = variantService

    this.Error.EntityNotExistsError = ProductDoesNotExist
  }

  async createSingle(product: CreateSingleProduct) {
    return await this.create<ISingleProduct>({
      type: ProductType.SINGLE,
      title: product.title,
      description: product.description,
      show: product.show,
      cost: product.cost,
      ingredients: product.ingredients,
      weight: product.weight
    })
  }

  async createVariant(product: CreateVariantProduct) {
    return await this.create<IVariantProduct>({
      type: ProductType.VARIANT,
      title: product.title,
      description: product.description,
      show: product.show,
      ingredients: product.ingredients
    })
  }

  async addVariant(productId: string, variant: CreateVariant): Promise<BaseVariant> {
    await this.existsById(productId)
    return await this.variantService.create({
      productId: new Types.ObjectId(productId),
      title: variant.title,
      show: variant.show,
      icon: variant.icon,
      cost: variant.cost,
      weight: variant.weight
    })
  }

  async findVariantProductById(productId: string): Promise<VariantProduct> {
    const product = await this.repository.findVariantProductById(productId)
    if (!product) throw new this.Error.EntityNotExistsError()
    return product
  }

  async findAndUpdateSingleProduct(productId: string, update: UpdateSingleProduct) {
    this.checkUpdateData(update)
    const product = await this.repository.findAndUpdateSingle(productId, update)
    if (!product) {
      throw new this.Error.EntityNotExistsError()
    }
    return product
  }

  async findAndUpdateVariantProduct(productId: string, update: UpdateVariantProduct) {
    this.checkUpdateData(update)
    const product = await this.repository.findAndUpdateVariant(productId, update)
    if (!product) {
      throw new this.Error.EntityNotExistsError()
    }
    return await this.findVariantProductById(productId)
  }
}