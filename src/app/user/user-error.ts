import {AccessError, AuthorizationError, EntityExistsError, EntityDoesNotExistError, InvalidDataError} from '@core/error'


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
        example: 'User with this email address already exists',
        enum: [
          'User with this email address already exists',
          'User with this username already exists'
        ]
      },
      key: {
        type: 'string',
        enum: ['email', 'username']
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
    message: 'Invalid password'
  }
)