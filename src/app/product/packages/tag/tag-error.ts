import {EntityDoesNotExistError, EntityExistsError} from '@error'


export const TagDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'TagDoesNotExistError',
    code: 7000,
    message: 'Тэг не найден'
  }
)

export const TagExistsError = EntityExistsError.extends(
  {},
  {
    error: 'TagExistsError',
    code: 7001,
    message: 'Тэг с таким именем уже существует'
  }
)