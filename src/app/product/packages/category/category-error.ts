import {EntityDoesNotExistError, EntityExistsError} from '@error'


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