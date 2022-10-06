import {EntityDoesNotExistError, EntityExistsError, InvalidDataError} from '@error'
import {config} from '@config'
import {ObjectId} from '@common/schemas/helpers'


export const ProductDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'ProductDoesNotExist',
    message: 'Продукт не найден',
    code: 3000
  }
)

export const MaximumImagesExceededError = InvalidDataError.extends(
  {},
  {
    error: 'MaximumImagesExceededError',
    message: `Вы не можете добавить продукту больше ${config.product.image.maximum} изображений`,
    code: 3001
  }
)

export const ProductImageDoesNotExist = EntityDoesNotExistError.extends(
  {},
  {
    error: 'ProductImageDoesNotExist',
    message: 'Картинка не найдена',
    code: 3002
  }
)

export const ProductImagesNotCompatibleError = InvalidDataError.extends(
  {},
  {
    error: 'ProductImagesNotCompatibleError',
    message: 'Предоставленный список изображений не соответствует фактическому',
    code: 3003
  }
)

export const ProductVariantsDoNotExistError = EntityDoesNotExistError.extends(
  {
    properties: {
      variants: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            productId: new ObjectId(),
            variantId: new ObjectId()
          },
          required: ['productId', 'variantId']
        }
      }
    },
    required: ['variants']
  },
  {
    error: 'ProductVariantsDoNotExistError',
    message: 'Один или несколько вариантов продукта не найдено',
    code: 3004
  }
)

export const ProductsDoNotExistError = EntityDoesNotExistError.extends(
  {
    properties: {
      productIds: {
        type: 'array',
        items: new ObjectId()
      }
    }
  },
  {
    error: 'ProductsDoNotExistError',
    message: 'Один или несколько продуктов не найдено',
    code: 3005
  }
)

export const ProductExistError = EntityExistsError.extends(
  {},
  {
    error: 'ProductExistError',
    code: 3006,
    message: 'Продукт с таким названием уже существует'
  }
)

export const ProductVariantNotHaveImagesError = InvalidDataError.extends(
  {},
  {
    error: 'ProductVariantNotHaveImagesError',
    code: 3007,
    message: 'Продукт с вариантами не имеет основных изображений'
  }
)