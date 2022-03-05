import {ObjectId, Timestamp} from '@common/schemas/helpers'
import {UserRole} from '../UserRole'
import {v4} from 'uuid'


export const _id = new ObjectId({entity: 'user'})
export const username = {
  type: 'string',
  minLength: 1,
  maxLength: 24,
  pattern: "^[a-z0-9_-]+$",
  example: 'user',
  errorMessage: {
    minLength: 'Username cannot be shorter than 1 character',
    maxLength: 'Username cannot be longer than 24 characters',
    pattern: 'Username consists of alphanumeric characters (a-zA-Z0-9), lowercase, or uppercase\n'
      + 'Username allowed of the underscore (_), and hyphen (-)'
  }
}
export const mUsername = {
  description: 'Search by partial match of the username',
  type: 'string',
  minLength: 1,
  maxLength: 24,
  example: 'Joe',
  errorMessage: {
    minLength: 'Specify at least 1 character to search by username',
    maxLength: 'Username cannot be longer than 24 characters'
  }
}
export const fEmail = {
  description: 'Search for a complete match of the email address',
  type: 'string',
  minLength: 1,
  maxLength: 1024,
  example: 'user@nowhere.com',
  errorMessage: {
    minLength: 'Specify at least 1 character to search by email',
    maxLength: 'Email address cannot be longer than 1024 characters'
  }
}
export const email = {
  type: 'string',
  example: 'user@nowhere.com',
  emailValidator: true,
  maxLength: 1024,
  errorMessage: {
    emailValidator: 'Invalid email address',
    maxLength: 'Email address cannot be longer than 1024 characters'
  }
}
export const avatar = {
  type: 'string',
  example: `#=${v4()}`
}
export const mEmail = {
  description: 'Search by partial match of the email address',
  type: 'string',
  minLength: 1,
  maxLength: 1024,
  errorMessage: {
    minLength: 'Specify at least 1 character to search by email',
    maxLength: 'Email address cannot be longer than 1024 characters'
  }
}
export const role = {
  type: 'string',
  enum: Object.values(UserRole),
  errorMessage: {
    enum: `Acceptable user role values: ${Object.values(UserRole).join(', ')}`
  }
}
export const password = {
  type: 'string',
  minLength: 6,
  maxLength: 1024,
  errorMessage: {
    minLength: 'Password must not be less than 6 characters',
    maxLength: 'Password must not be more than 1024 characters'
  }
}
export const createdAt = new Timestamp({description: 'Timestamp of user creation'})
export const updatedAt = new Timestamp({description: 'User update timestamp'})