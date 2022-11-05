import {EntityDoesNotExistError, InvalidDataError} from '@error'


export const ProductNotInFavoriteListError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'ProductNotInFavoriteListError',
    message: 'Этот продукт не находится в списке избранных',
    code: 9000
  }
)

export const ProductAlreadyInFavoriteListError = InvalidDataError.extends(
  {},
  {
    error: 'ProductAlreadyInFavoriteListError',
    message: 'Этот продукт уже есть в списке избранных',
    code: 9001
  }
)
