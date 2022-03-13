import {EntityDoesNotExistError, InvalidDataError} from '@error'
import {config} from '@config'


export const ProductDoesNotExist = EntityDoesNotExistError.extends(
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