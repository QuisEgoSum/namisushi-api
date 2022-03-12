import {EntityDoesNotExistError} from '@error'


export const VariantDoesNotExist = EntityDoesNotExistError.extends(
  {},
  {
    error: 'VariantDoesNotExist',
    message: 'Вариант продукта не найден',
    code: 4000
  }
)