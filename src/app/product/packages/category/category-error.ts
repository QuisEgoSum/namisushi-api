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

export const ProductAlreadyInCategoryError = InvalidDataError.extends(
  {},
  {
    error: 'ProductAlreadyInCategoryError',
    message: 'Продукт уже находится в категории',
    code: 5002
  }
)
export const ProductNotInCategoryError = InvalidDataError.extends(
  {},
  {
    error: 'ProductNotInCategoryError',
    message: 'Продукт не находится в этой категории',
    code: 5003
  }
)