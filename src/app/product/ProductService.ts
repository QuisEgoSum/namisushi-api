import {GenericService} from '@core/service'
import {ProductType} from '@app/product/ProductType'
import {
  MaximumImagesExceededError,
  ProductDoesNotExistError,
  ProductImageDoesNotExist,
  ProductImagesNotCompatibleError, ProductsDoNotExistError, ProductVariantsDoNotExistError
} from '@app/product/product-error'
import {Types} from 'mongoose'
import {createFilepath, deleteFile, moveFile} from '@utils/fs'
import {config} from '@config'
import type {IProduct, ISingleProduct, IVariantProduct} from './ProductModel'
import type {ProductRepository} from '@app/product/ProductRepository'
import type {
  CreateSingleProduct,
  CreateVariantProduct,
  UpdateSingleProduct, UpdateVariantProduct,
  VariantProduct
} from '@app/product/schemas/entities'
import type {BaseVariant, CreateVariant, UpdateVariant} from '@app/product/packages/variant/schemas/entities'
import type {VariantService} from '@app/product/packages/variant/VariantService'
import type {CategoryService} from '@app/product/packages/category/CategoryService'
import type {ICategory} from '@app/product/packages/category/CategoryModel'
import type {CreateOrderProduct, CreateOrderSingleProduct, CreateOrderVariantProduct} from '@app/order/schemas/entities'
import type {MultipartFile} from 'fastify-multipart'
import {IOrderProduct} from '@app/order/OrderModel'


export class ProductService extends GenericService<IProduct, ProductRepository> {
  private variantService: VariantService
  private categoryService: CategoryService
  constructor(
    repository: ProductRepository,
    variantService: VariantService,
    categoryService: CategoryService
  ) {
    super(repository)

    this.variantService = variantService
    this.categoryService = categoryService

    this.Error.EntityDoesNotExistError = ProductDoesNotExistError
  }

  async createSingle(product: CreateSingleProduct) {
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

  async createVariant(product: CreateVariantProduct) {
    return await this.create<IVariantProduct>({
      type: ProductType.VARIANT,
      title: product.title,
      description: product.description,
      visible: product.visible,
      ingredients: product.ingredients
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

  async findAll() {
    return this.repository.findAll()
  }

  async addToCategory(productId: string, categoryId: string) {
    await this.existsById(productId)
    return await this.categoryService.addProduct(categoryId, productId)
  }

  async findVisible(): Promise<{categories: ICategory[], products: Array<ISingleProduct | VariantProduct>}> {
    const [categories, single, variant] = await Promise.all([
      this.categoryService.findVisible(),
      this.repository.findSingleVisible(),
      this.repository.findVariantVisible()
    ])
    return {
      categories,
      //@ts-ignore
      products: single.concat(variant)
    }
  }

  private addMissingProducts(array: string[], expected: string[] | IterableIterator<string>, actual: {_id: Types.ObjectId}[]) {
    const expectedSet = new Set(expected)
    actual.forEach(product => expectedSet.delete(String(product._id)))
    array.push(...expectedSet)
  }

  async findAndCalculateProducts(sourceProducts: CreateOrderProduct[])/*: Promise<IOrderProduct>*/ {
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
      throw new ProductsDoNotExistError({productIds: notExistProductIds})
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
        throw new ProductsDoNotExistError({productIds: [productId]})
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
      throw new ProductVariantsDoNotExistError({variants: notExistVariants})
    }
    for (const [productId, sourceProduct] of sourceSingleProductsMap.entries()) {
      const product = singleProductsMap.get(productId)
      if (!product) {
        throw new ProductsDoNotExistError({productIds: [productId]})
      }
      products.push({
        productId: new Types.ObjectId(productId),
        cost: product.cost,
        weight: product.weight,
        number: sourceProduct.number
      })
    }
    return products

    // const expectSingleProductIds: Set<string> = new Set()
    // const expectVariantProductIds: Set<string> = new Set()
    // const expectVariantIds: Set<string> = new Set()
    // const orderVariantProducts: CreateOrderVariantProduct[] = []
    // products.forEach(product => {
    //   if ('variantId' in product) {
    //     expectVariantProductIds.add(product.productId)
    //     expectVariantIds.add(product.variantId)
    //     orderVariantProducts.push(product)
    //   } else {
    //     expectSingleProductIds.add(product.productId)
    //   }
    // })
    // const [singleProducts, variantProducts] = await Promise.all([
    //   this.repository.findOrderSingleVisibleByIds(Array.from(expectSingleProductIds)),
    //   this.repository.findOrderVariantVisibleByIds(Array.from(expectVariantProductIds), Array.from(expectVariantIds))
    // ])
    // const notExistProductIds: string[] = []
    // if (expectSingleProductIds.size !== singleProducts.length) {
    //   const singleNotExistsIds = new Set(expectSingleProductIds)
    //   singleProducts.forEach(product => singleNotExistsIds.delete(String(product._id)))
    //   notExistProductIds.push(...singleNotExistsIds)
    // }
    // if (expectVariantProductIds.size !== variantProducts.length) {
    //   const variantNotExistsIds = new Set(expectVariantProductIds)
    //   variantProducts.forEach(product => variantNotExistsIds.delete(String(product._id)))
    //   notExistProductIds.push(...variantNotExistsIds)
    // }
    // if (notExistProductIds.length) {
    //   throw new ProductsDoNotExistError({productIds: notExistProductIds})
    // }
    // const notExistVariants: {productId: string, variantId: string}[] = []
    // const existVariantIds = new Set(
    //   variantProducts
    //     .map(product => product.variants.map(variant => String(variant._id)))
    //     .flat()
    // )
    // if (existVariantIds.size != expectVariantIds.size) {
    //   const foundVariantsMap: Map<string, Set<string>> = new Map(
    //     variantProducts
    //       .map(product => [String(product._id), new Set(product.variants.map(variant => String(variant._id)))])
    //   )
    //   for (const product of orderVariantProducts) {
    //     //@ts-ignore - проверка существования была выше
    //     if (!foundVariantsMap.get(product.productId).has(product.variantId)) {
    //       notExistVariants.push({
    //         productId: product.productId,
    //         variantId: product.variantId
    //       })
    //     }
    //   }
    // }
    // if (notExistVariants.length) {
    //   throw new ProductVariantsDoNotExistError({variants: notExistVariants})
    // }
    // return {
    //   single: new Map(singleProducts.map(product => [String(product._id), {cost: product.cost, weight: product.weight}])) as OrderSingleProductMap,
    //   variant: new Map(variantProducts
    //     .map(product => [
    //       String(product._id),
    //       new Map(product.variants.map(variant => [String(variant._id), {cost: variant.cost, weight: variant.weight}]))
    //     ])
    //   ) as OrderVariantProductMap
    // }
  }
}