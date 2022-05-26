import {
  AccessError,
  AuthorizationError,
  EntityExistsError,
  EntityDoesNotExistError,
  InvalidDataError,
  TooEarlyError, InternalError
} from '@core/error'


export const UserAuthorizationError = AuthorizationError.extends(
  {},
  {
    code: 2000,
    error: 'UserAuthorizationError'
  }
)

export const UserRightsError = AccessError.extends(
  {},
  {
    error: 'UserRightsError',
    code: 2001,
    message: 'Вы не можете выполнить это действие'
  }
)

export const IncorrectUserCredentials = InvalidDataError.extends(
  {},
  {
    error: 'IncorrectUserCredentials',
    code: 2002,
    message: 'Неверный логин или пароль'
  }
)

export const UserNotExistsError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'UserNotExistsError',
    code: 2003,
    message: 'Пользователь не найден'
  }
)

export const UserExistsError = EntityExistsError.extends(
  {
    properties: {
      message: {
        type: 'string',
        default: undefined,
        example: 'Пользователь с таким адресом электронной почты уже существует',
        enum: [
          'Пользователь с таким адресом электронной почты уже существует',
          'Пользователь с таким номером телефона уже существует'
        ]
      },
      key: {
        type: 'string',
        enum: ['email', 'phone']
      }
    }
  },
  {
    error: 'UserExistsError',
    code: 2004
  }
)

export const InvalidPasswordError = InvalidDataError.extends(
  {},
  {
    error: 'InvalidPasswordError',
    code: 2005,
    message: 'Неверный пароль'
  }
)

export const UserRegisteredError = InvalidDataError.extends(
  {},
  {
    error: 'UserRegisteredError',
    code: 2006,
    message: 'Пользователь с этим номером телефона уже зарегистрирован'
  }
)

export const SendOtpTimeoutError = TooEarlyError.extends(
  {
    properties: {
      message: {
        type: 'string',
        default: 'Интервал между отправкой сообщений должен быть 60 секунд',
        enum: [
          'Интервал между отправкой сообщений должен быть 60 секунд',
          'Интервал между отправкой сообщений должен быть 60 секунд. Подождите ещё {number}'
        ]
      }
    }
  },
  {
    error: 'SendOtpTimeoutError',
    code: 2007
  }
)

export const InvalidOtpCodeError = InvalidDataError.extends(
  {},
  {
    error: 'InvalidOtpCodeError',
    code: 2008,
    message: 'Неверный код или время жизни кода истекло'
  }
)