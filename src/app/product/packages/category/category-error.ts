import {EntityDoesNotExistError, EntityExistsError, InvalidDataError} from '@error'


export const CategoryDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'CategoryDoesNotExistError',
    message: 'Категория не найдена',
    code: 5000
  }
)

export const CategoryExistsError = EntityExistsError.extends(
  {},
  {
    error: 'CategoryExistsError',
    message: 'Категория с таким именем уже существует',
    code: 5001
  }
)

export const ProductAlreadyInCategory = InvalidDataError.extends(
  {},
  {
    error: 'ProductAlreadyInCategory',
    message: 'Продукт уже находится в категории',
    code: 5002
  }
)