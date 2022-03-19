import {EntityDoesNotExistError, InvalidDataError} from '@error'


export const OrderDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'OrderDoesNotExistError',
    message: 'Заказ не найден',
    code: 6000
  }
)

export const OrderCannotBeCanceledError = InvalidDataError.extends(
  {},
  {
    error: 'OrderCannotBeCanceledError',
    message: 'Вы не можете отменить этот заказ',
    code: 6001
  }
)