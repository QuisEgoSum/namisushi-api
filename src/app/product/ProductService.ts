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
import {
  MaximumImagesExceededError,
  ProductDoesNotExist,
  ProductImageDoesNotExist,
  ProductImagesNotCompatibleError
} from '@app/product/product-error'
import {VariantService} from '@app/product/packages/variant/VariantService'
import {BaseVariant, CreateVariant, UpdateVariant} from '@app/product/packages/variant/schemas/entities'
import {Types} from 'mongoose'
import {MultipartFile} from 'fastify-multipart'
import {config} from '@config'
import {createFilepath, deleteFile, moveFile} from '@utils/fs'


export class ProductService extends GenericService<IProduct, ProductRepository> {
  private variantService: VariantService
  constructor(
    repository: ProductRepository,
    variantService: VariantService
  ) {
    super(repository)

    this.variantService = variantService

    this.Error.EntityDoesNotExistError = ProductDoesNotExist
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
    if (!product) throw new this.Error.EntityDoesNotExistError()
    return product
  }

  async findAndUpdateSingleProduct(productId: string, update: UpdateSingleProduct) {
    this.checkUpdateData(update)
    const product = await this.repository.findAndUpdateSingle(productId, update)
    if (!product) {
      throw new this.Error.EntityDoesNotExistError()
    }
    return product
  }

  async findAndUpdateVariantProduct(productId: string, update: UpdateVariantProduct) {
    this.checkUpdateData(update)
    const product = await this.repository.findAndUpdateVariant(productId, update)
    if (!product) {
      throw new this.Error.EntityDoesNotExistError()
    }
    return await this.findVariantProductById(productId)
  }

  async findAndUpdateVariant(productId: string, variantId: string, update: UpdateVariant) {
    return await this.variantService.findAndUpdate(productId, variantId, update)
  }

  async attachImage(productId: string, files: MultipartFile[]): Promise<string[]> {
    const product = await this.findById(productId, {images: 1})
    if (product.images.length + files.length > config.product.image.maximum) {
      throw new MaximumImagesExceededError()
    }
    const images = await Promise.all(
      files
        .map(file => createFilepath(config.product.image.file.destination, file.mimetype.split('/').pop() || 'png'))
        .map((promise, i) => promise.then(
          file => moveFile(files[i].filepath, file.filepath).then(() => file.filename))
        )
    )
    const updatedProduct = await this.repository.addToSetImages(productId, images)
    if (!updatedProduct) {
      throw new this.Error.EntityDoesNotExistError()
    }
    return updatedProduct.images
  }

  async deleteImage(productId: string, imageName: string) {
    const result = await this.repository.pullImage(productId, imageName)
    if (result.matchedCount == 0) {
      await this.existsById(productId)
      throw new ProductImageDoesNotExist()
    }
    await deleteFile(config.product.image.file.destination, imageName)
  }

  async updateOrderImages(productId: string, images: string[]) {
    const product = await this.findById(productId, {images: 1})
    const oldImages = new Set(product.images)
    if (oldImages.size !== images.length) {
      throw new ProductImagesNotCompatibleError()
    }
    const oldImagesSize = oldImages.size
    images.forEach(filename => oldImages.add(filename))
    if (oldImages.size !== oldImagesSize) {
      throw new ProductImagesNotCompatibleError()
    }
    const result = await this.repository.updateOrderImages(productId, images, product.images)
    if (result.matchedCount === 0) {
      throw new ProductImagesNotCompatibleError()
    }
    return images
  }
}