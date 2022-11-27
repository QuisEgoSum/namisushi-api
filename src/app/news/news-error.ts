import {EntityDoesNotExistError, EntityExistsError} from '@error'


export const NewsWithTitleAlreadyExistError = EntityExistsError.extends(
  {},
  {
    error: 'NewsWithTitleAlreadyExistError',
    message: 'Новость с таким заголовком уже существует',
    code: 10000
  }
)

export const NewsWithSlugAlreadyExistError = EntityExistsError.extends(
  {},
  {
    error: 'NewsWithSlugAlreadyExistError',
    message: 'Новость с таким slug уже существует',
    code: 10001
  }
)

export const NewsNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'NewsNotExistError',
    message: 'Новость не найдена',
    code: 10002
  }
)