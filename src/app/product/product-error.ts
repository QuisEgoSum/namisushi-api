import {EntityNotExistsError, InvalidDataError} from '../../core/error'
import {config} from '@config'


export const ProductDoesNotExist = EntityNotExistsError.extends(
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