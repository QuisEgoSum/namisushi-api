import {EntityDoesNotExistError} from '@error'


export const OrderDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'OrderDoesNotExistError',
    message: 'Заказ не найден',
    code: 6000
  }
)