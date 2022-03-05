import {AccessError, AuthorizationError, EntityExistsError, EntityNotExistsError, InvalidDataError} from '@core/error'


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
    message: 'You don\'t have enough permissions to perform this action'
  }
)

export const IncorrectUserCredentials = InvalidDataError.extends(
  {},
  {
    error: 'IncorrectUserCredentials',
    code: 2002,
    message: 'Invalid login or password'
  }
)

export const UserNotExistsError = EntityNotExistsError.extends(
  {},
  {
    error: 'UserNotExistsError',
    code: 2003,
    message: 'User not found'
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