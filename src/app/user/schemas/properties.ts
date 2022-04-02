import {ObjectId, Timestamp} from '@common/schemas/helpers'
import {UserRole} from '../UserRole'
import {v4} from 'uuid'
import {phonePattern} from '@common/schemas/pattern'


export const _id = new ObjectId({entity: 'user'})
export const savedUsername = {
  type: ['string', 'null']
}
export const username = {
  type: 'string',
  minLength: 1,
  maxLength: 24,
  pattern: "^[a-z0-9_-]+$",
  example: 'user',
  errorMessage: {
    minLength: 'Имя пользователя должно содержать как минимум 1 символ',
    maxLength: 'Имя пользователя не может превышать 24 символа',
    pattern: 'Имя пользователя может содержать цифры, английские символы, символ нижнего подчёркивания(_) и дефис(-)'
  }
}
export const mUsername = {
  description: 'Поиск по частичному совпадению username',
  type: 'string',
  minLength: 1,
  maxLength: 24,
  example: 'Joe',
  errorMessage: {
    minLength: 'Укажите хотя бы 1 символ в поле username',
    maxLength: 'Username не может содержать больше 24 символов'
  }
}
export const email = {
  type: 'string',
  example: 'user@nowhere.com',
  emailValidator: true,
  maxLength: 1024,
  errorMessage: {
    emailValidator: 'Невалидный адрес электронной почты',
    maxLength: 'Длина электронной почты не должна превышать 1024 символов'
  }
}
export const savedEmail = {
  type: ['string', 'null']
}
export const avatar = {
  type: 'string',
  example: `#=${v4()}`
}
export const mEmail = {
  description: 'Поиск по частичному совпадению email',
  type: 'string',
  minLength: 1,
  maxLength: 1024,
  errorMessage: {
    minLength: 'Specify at least 1 character to search by email',
    maxLength: 'Email address cannot be longer than 1024 characters'
  }
}
export const allowedChangeRole = {
  type: 'string',
  enum: [UserRole.USER, UserRole.ADMIN, UserRole.WATCHER],
  errorMessage: {
    enum: `Допустимые роли: ${[UserRole.USER, UserRole.ADMIN, UserRole.WATCHER].join(', ')}`
  }
}
export const role = {
  type: 'string',
  enum: Object.values(UserRole),
  errorMessage: {
    enum: `Допустимые роли: ${Object.values(UserRole).join(', ')}`
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
export const phone = {
  type: 'string',
  pattern: phonePattern,
  errorMessage: {
    type: 'Номер телефона должен быть строкой',
    pattern: 'Указанный номер телефона некорректен'
  }
}
export const savedPhone = {
  type: ['string', 'null'],
  pattern: phonePattern
}
export const savedName = {
  type: ['string', 'null'],
  minLength: 1,
  maxLength: 128,
  errorMessage: {
    minLength: 'Имя должно содержать как минимум 1 символ',
    maxLength: 'Имя не должно содержать больше 128 символов'
  }
}
export const name = {
  type: 'string',
  minLength: 1,
  maxLength: 128,
  errorMessage: {
    minLength: 'Имя должно содержать как минимум 1 символ',
    maxLength: 'Имя не должно содержать больше 128 символов'
  }
}
export const telegramId = {
  type: ['string', 'null']
}
export const createdAt = new Timestamp({description: 'Timestamp of user creation'})
export const updatedAt = new Timestamp({description: 'User update timestamp'})