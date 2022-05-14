import {GenericService, ServiceError} from '@core/service'
import {ProductType} from '@app/product/ProductType'
import * as error from '@app/product/product-error'
import * as fs from '@utils/fs'
import {config} from '@config'
import {logger} from '@logger'
import {Types} from 'mongoose'
import type {IProduct, ISingleProduct, IVariantProduct} from '@app/product/ProductModel'
import type {ProductRepository} from '@app/product/ProductRepository'
import type * as entities from '@app/product/schemas/entities'
import type {BaseVariant, CreateVariant, UpdateVariant} from '@app/product/packages/variant/schemas/entities'
import type {VariantService} from '@app/product/packages/variant'
import type {CategoryService} from '@app/product/packages/category'
import type {TagService} from '@app/product/packages/tag'
import type {CreateOrderProduct, CreateOrderSingleProduct, CreateOrderVariantProduct} from '@app/order/schemas/entities'
import type {IOrderProduct} from '@app/order/OrderModel'
import type {MultipartFile} from '@fastify/multipart'


export class ProductService extends GenericService<IProduct, ProductRepository> {

  public readonly error: ServiceError & typeof error
  private cachedVisibleProducts: string
  private cacheTimeout: null | NodeJS.Timeout
  private logger: typeof logger

  constructor(
    repository: ProductRepository,
    private readonly variantService: VariantService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService
  ) {
    super(repository)

    this.cachedVisibleProducts = ''
    this.cacheTimeout = null

    this.logger = logger.child({label: 'ProductService'})

    this.error = {
      EntityExistsError: error.ProductExistError,
      EntityDoesNotExistError: error.ProductDoesNotExistError,
      ...error
    }
  }

  private async timeoutReloadCache() {
    this.logger.info("Reload cache timeout")
    try {
      if (this.cacheTimeout !== null) {
        this.cacheTimeout = null
      }
      await this.reloadVisibleProductsCache(false)
    } catch(error) {
      logger.error(error)
    }
  }

  async reloadVisibleProductsCache(timeout = false): Promise<void> {
    this.logger.info("Reload cache")
    const [categories, single, variant] = await Promise.all([
      this.categoryService.findVisible(),
      this.repository.findSingleVisible(),
      this.repository.findVariantVisible()
    ])
    this.cachedVisibleProducts = JSON.stringify({categories, products: [...single, ...variant]})
    if (timeout) {
      if (this.cacheTimeout !== null) {
        this.cacheTimeout.unref()
        this.cacheTimeout = null
      }
      this.cacheTimeout = setTimeout(() => this.timeoutReloadCache(), 15000)
    }
  }

  async createSingle(product: entities.CreateSingleProduct) {
    return await this.create<ISingleProduct>({
      type: ProductType.SINGLE,
      title: product.title,
      description: product.description,
      visible: product.visible,
      cost: product.cost,
      ingredients: product.ingredients,
      weight: product.weight
    })
  }

  async createVariant(product: entities.CreateVariantProduct) {
    return await this.create<IVariantProduct>({
      type: ProductType.VARIANT,
      title: product.title,
      description: product.description,
      visible: product.visible,
      ingredients: product.ingredients,
      cost: null,
      weight: null
    })
  }

  async addVariant(productId: string, variant: CreateVariant): Promise<BaseVariant> {
    await this.existsById(productId)
    return await this.variantService.create({
      productId: new Types.ObjectId(productId),
      title: variant.title,
      visible: variant.visible,
      icon: variant.icon,
      cost: variant.cost,
      weight: variant.weight
    })
  }

  async findVariantProductById(productId: string): Promise<entities.VariantProduct> {
    const product = await this.repository.findVariantProductById(productId)
    if (!product) throw new this.error.EntityDoesNotExistError()
    return product
  }

  async findAndUpdateSingleProduct(productId: string, update: entities.UpdateSingleProduct) {
    this.checkUpdateData(update)
    const product = await this.repository.findAndUpdateSingle(productId, update)
    if (!product) {
      throw new this.error.EntityDoesNotExistError()
    }
    return product
  }

  async findAndUpdateVariantProduct(productId: string, update: entities.UpdateVariantProduct) {
    this.checkUpdateData(update)
    const product = await this.repository.findAndUpdateVariant(productId, update)
    if (!product) {
      throw new this.error.EntityDoesNotExistError()
    }
    return await this.findVariantProductById(productId)
  }

  async findAndUpdateVariant(productId: string, variantId: string, update: UpdateVariant) {
    return await this.variantService.findAndUpdate(productId, variantId, update)
  }

  async attachImage(productId: string, files: MultipartFile[]): Promise<string[]> {
    const product = await this.findById(productId, {images: 1})
    if (product.images.length + files.length > config.product.image.maximum) {
      throw new this.error.MaximumImagesExceededError()
    }
    const images = await Promise.all(
      files
        .map(file => fs.createFilepath(config.product.image.file.destination, file.mimetype.split('/').pop() || 'png'))
        .map((promise, i) => promise.then(
          file => fs.writeFile(file.filepath, files[i].file).then(() => file.filename))
        )
    )
    const updatedProduct = await this.repository.addToSetImages(productId, images)
    if (!updatedProduct) {
      await Promise.all(images.map(filename => fs.deleteFile(config.product.image.file.destination, filename)))
      throw new this.error.EntityDoesNotExistError()
    }
    return updatedProduct.images
  }

  async deleteImage(productId: string, filename: string) {
    const result = await this.repository.pullImage(productId, filename)
    if (result.matchedCount == 0) {
      await this.existsById(productId)
      throw new this.error.ProductImageDoesNotExist()
    }
    await fs.deleteFile(config.product.image.file.destination, filename)
  }

  async updateOrderImages(productId: string, images: string[]) {
    const product = await this.findById(productId, {images: 1})
    const oldImages = new Set(product.images)
    if (oldImages.size !== images.length) {
      throw new this.error.ProductImagesNotCompatibleError()
    }
    const oldImagesSize = oldImages.size
    images.forEach(filename => oldImages.add(filename))
    if (oldImages.size !== oldImagesSize) {
      throw new this.error.ProductImagesNotCompatibleError()
    }
    const result = await this.repository.updateOrderImages(productId, images, product.images)
    if (result.matchedCount === 0) {
      throw new this.error.ProductImagesNotCompatibleError()
    }
    return images
  }

  async findAll() {
    return this.repository.findAll()
  }

  async addToCategory(productId: string, categoryId: string) {
    await this.existsById(productId)
    return await this.categoryService.addProduct(categoryId, productId)
  }

  findVisible(): string {
    return this.cachedVisibleProducts
  }

  private addMissingProducts(array: string[], expected: string[] | IterableIterator<string>, actual: {_id: Types.ObjectId}[]) {
    const expectedSet = new Set(expected)
    actual.forEach(product => expectedSet.delete(String(product._id)))
    array.push(...expectedSet)
  }

  async findAndCalculateProducts(sourceProducts: CreateOrderProduct[]): Promise<IOrderProduct[]> {
    const sourceSingleProductsMap: Map<string, CreateOrderSingleProduct> = new Map()
    const sourceVariantProductsMap: Map<string, Map<string, CreateOrderVariantProduct>> = new Map()
    const singleProductsMap: Map<string, {cost: number, weight: number}> = new Map()
    const variantProductsMap: Map<string, Map<string, {cost: number, weight: number}>> = new Map()
    const products: IOrderProduct[] = []
    for (const product of sourceProducts) {
      //SINGLE
      if (!('variantId' in product)) {
        const value = sourceSingleProductsMap.get(product.productId)
        if (value !== undefined) {
          value.number += product.number
        } else {
          sourceSingleProductsMap.set(product.productId, product)
        }
        continue
      }
      //VARIANT
      let products = sourceVariantProductsMap.get(product.productId)
      if (products === undefined) {
        products = new Map()
        sourceVariantProductsMap.set(product.productId, products)
      }
      const value = products.get(product.variantId)
      if (value !== undefined) {
        value.number += product.number
      } else {
        products.set(product.variantId, product)
      }
    }
    const [singleProducts, variantProducts] = await Promise.all([
      this.repository.findOrderSingleVisibleByIds(Array.from(sourceSingleProductsMap.keys())),
      this.repository.findOrderVariantVisibleByIds(
        Array.from(sourceVariantProductsMap.keys()),
        Array.from(Array.from(sourceVariantProductsMap.values()).map(value => Array.from(value.keys())).flat())
      )
    ])
    const notExistProductIds: string[] = []
    if (singleProducts.length !== sourceSingleProductsMap.size) {
      this.addMissingProducts(notExistProductIds, sourceSingleProductsMap.keys(), singleProducts)
    }
    if (variantProducts.length !== sourceVariantProductsMap.size) {
      this.addMissingProducts(notExistProductIds, sourceVariantProductsMap.keys(), variantProducts)
    }
    if (notExistProductIds.length) {
      throw new this.error.ProductsDoNotExistError({productIds: notExistProductIds})
    }
    singleProducts.forEach(product => singleProductsMap.set(String(product._id), {cost: product.cost, weight: product.weight}))
    variantProducts.forEach(
      product => variantProductsMap
        .set(String(product._id), new Map(
          product.variants.map(variant => [String(variant._id), {cost: variant.cost, weight: variant.weight}])
        ))
    )
    const notExistVariants: {productId: string, variantId: string}[] = []
    for (const [productId, sourceVariantsMap] of sourceVariantProductsMap.entries()) {
      const variantsMap = variantProductsMap.get(productId)
      if (!variantsMap) {
        throw new this.error.ProductsDoNotExistError({productIds: [productId]})
      }
      for (const [variantId, sourceVariant] of sourceVariantsMap.entries()) {
        const variant = variantsMap.get(variantId)
        if (!variant) {
          notExistVariants.push({productId, variantId})
          continue
        }
        products.push({
          productId: new Types.ObjectId(productId),
          variantId: new Types.ObjectId(variantId),
          cost: variant.cost,
          weight: variant.weight,
          number: sourceVariant.number
        })
      }
    }
    if (notExistVariants.length) {
      throw new this.error.ProductVariantsDoNotExistError({variants: notExistVariants})
    }
    for (const [productId, sourceProduct] of sourceSingleProductsMap.entries()) {
      const product = singleProductsMap.get(productId)
      if (!product) {
        throw new this.error.ProductsDoNotExistError({productIds: [productId]})
      }
      products.push({
        productId: new Types.ObjectId(productId),
        cost: product.cost,
        weight: product.weight,
        number: sourceProduct.number,
        variantId: null
      })
    }
    return products
  }
}