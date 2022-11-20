import {
  EntityDoesNotExistError,
  InternalError,
  InvalidDataError,
  JsonSchemaValidationError,
  JsonSchemaValidationErrors
} from '@error'


export const MISSING_ADDRESS_ERROR = new JsonSchemaValidationErrors({
  in: 'body',
  errors: [new JsonSchemaValidationError({
    message: 'Укажите адрес доставки',
    code: 1002,
    error: 'JsonSchemaValidationError',
    keyword: 'required',
    schemaPath: '#/required',
    dataPath: '',
    details: {
      'missingProperty': 'address'
    }
  })]
})


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