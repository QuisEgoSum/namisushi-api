import {EntityNotExistsError} from '@error'


export const VariantDoesNotExist = EntityNotExistsError.extends(
  {},
  {
    error: 'VariantDoesNotExist',
    message: 'Вариант продукта не найден',
    code: 4000
  }
)