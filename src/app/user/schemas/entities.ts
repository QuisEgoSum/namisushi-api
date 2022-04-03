import {
  _id,
  avatar,
  createdAt,
  email,
  mEmail,
  mUsername,
  password,
  role,
  updatedAt,
  username,
  savedUsername, savedEmail, savedPhone, name, telegramId, phone, allowedChangeRole, savedName
} from './properties'
import {UserRole} from '../UserRole'
import {QueryPageLimit, QueryPageNumber, QuerySortDirection} from '@common/schemas/query'
import type {SortDirection} from 'mongodb'


export interface UserCredentials {
  login: string,
  password: string
}

export const UserCredentials = {
  title: 'UserCredentials',
  type: 'object',
  properties: {
    login: {
      description: 'username, email или phone',
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  additionalProperties: false,
  required: ['login', 'password'],
  errorMessage: {
    type: 'Введите логин и пароль',
    required: {
      login: 'Введите логин',
      password: 'Введите пароль'
    }
  }
}

export const UserBase = {
  title: 'UserBase',
  type: 'object',
  properties: {
    _id: _id,
    name: savedName,
    username: savedUsername,
    email: savedEmail,
    phone: savedPhone,
    role: role,
    avatar: avatar,
    createdAt: createdAt,
    updatedAt: updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'username',
    'name',
    'email',
    'phone',
    'role',
    'avatar',
    'createdAt',
    'updatedAt'
  ]
}

export const UserExpand = {
  title: 'UserExpand',
  type: 'object',
  properties: {
    _id: _id,
    name: savedName,
    username: savedUsername,
    email: savedEmail,
    phone: savedPhone,
    role: role,
    avatar: avatar,
    telegramId: telegramId,
    createdAt: createdAt,
    updatedAt: updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'name',
    'username',
    'email',
    'phone',
    'role',
    'avatar',
    'telegramId',
    'createdAt',
    'updatedAt'
  ]
}

export interface CreateUser {
  name: string
  username: string
  email: string
  role: UserRole
  password: string
}

export const CreateUser = {
  title: 'CreateUser',
  type: 'object',
  properties: {
    name: name,
    username: username,
    email: email,
    phone: phone,
    role: allowedChangeRole,
    password: password
  },
  additionalProperties: false,
  required: ['name', 'role', 'password'],
  errorMessage: {
    required: {
      name: 'Введите имя пользователя',
      role: 'Выберите роль',
      password: 'Введите пароль'
    }
  }
}

export interface FindUsersQueryAdmin {
  fRole?: UserRole,
  mUsername?: string,
  mEmail?: string,
  sCreatedAt: SortDirection,
  page: number,
  limit: number
}

export const FindUsersQueryAdmin = {
  title: 'FindUsersQuery',
  type: 'object',
  properties: {
    fRole: role,
    mUsername: mUsername,
    mEmail: mEmail,
    sCreatedAt: new QuerySortDirection().setDefault('desc'),
    page: new QueryPageNumber().setDefault(1),
    limit: new QueryPageLimit().setDefault(10)
  },
  additionalProperties: false
}

export interface UpdateUserById {
  name?: string
  email?: string
  username?: string
  phone?: string
  password?: string
  role?: UserRole
}

export const UpdateUserById = {
  title: 'UpdateUserById',
  type: 'object',
  properties: {
    name: name,
    email: email,
    username: username,
    phone: phone,
    password: password,
    role: allowedChangeRole
  },
  additionalProperties: false
}

export interface UpdateUser {
  name?: string
  username?: string
  email?: string
}

export const UpdateUser = {
  title: 'UpdateUser',
  type: 'object',
  properties: {
    name: name,
    username: username,
    email: email
  },
  additionalProperties: false
}

export interface UpdateUserPassword {
  password: string,
  oldPassword: string
}

export const UpdateUserPassword = {
  title: 'UpdateUserPassword',
  type: 'object',
  properties: {
    password: password,
    oldPassword: {
      type: 'string'
    }
  },
  additionalProperties: false,
  required: ['password', 'oldPassword'],
  errorMessage: {
    required: {
      password: 'Введите новый пароль',
      oldPassword: 'Введите старый пароль'
    }
  }
}

export interface SendSignupOtp {
  phone: string
}

export const SendSignupOtp = {
  title: 'SendSignupOtp',
  type: 'object',
  properties: {
    phone
  },
  additionalProperties: false,
  required: ['phone']
}