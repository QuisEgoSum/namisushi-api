import {EntityDoesNotExistError, InternalError, InvalidDataError} from '@error'


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

export const CreatedOrderDoesNotExistError = InternalError.extends(
  {},
  {code: 6002}
)