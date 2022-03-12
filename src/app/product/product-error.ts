import {EntityNotExistsError} from '../../core/error'


export const ProductDoesNotExist = EntityNotExistsError.extends(
  {},
  {
    error: 'ProductDoesNotExist',
    message: 'Продукт не найден',
    code: 3000
  }
)