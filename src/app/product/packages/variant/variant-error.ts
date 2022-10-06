import {EntityDoesNotExistError} from '@error'


export const VariantDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'VariantDoesNotExistError',
    message: 'Вариант продукта не найден',
    code: 4000
  }
)

export const VariantIconDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'VariantIconDoesNotExistError',
    message: 'Иконка не найдена',
    code: 4001
  }
)

export const VariantImageDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'VariantImageDoesNotExistError',
    message: 'Вариант продукта не содержит картинку',
    code: 4002
  }
)