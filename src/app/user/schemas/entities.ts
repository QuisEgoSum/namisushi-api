import {
  _id, avatar, createdAt, email,
  mEmail, role, updatedAt,
  savedEmail,
  savedPhone, name, phone,
  allowedChangeRole, savedName,
  otpCode, username, password, savedUsername, mPhone, mName
} from './properties'
import {UserRole} from '@app/user/UserRole'
import {QueryPageLimit, QueryPageNumber, QuerySortDirection} from '@common/schemas/query'
import type {SortDirection} from 'mongodb'


export interface UserCredentialsByCode {
  code: string
  phone: string
}

export interface UserCredentialsByPassword {
  login: string
  password: string
}

export type UserCredentials = UserCredentialsByCode | UserCredentialsByPassword

export const UserCredentials = {
  title: 'UserCredentials',
  type: 'object',
  properties: {
    login: {},
    password: {},
    code: {},
    phone: {}
  },
  additionalProperties: false,
  oneOf: [
    {
      title: 'UserCredentialsByCode',
      type: 'object',
      properties: {
        code: otpCode,
        phone: phone,
        password: {type: 'null'},
        login: {type: 'null'}
      },
      additionalProperties: false,
      required: ['code', 'phone']
    },
    {
      title: 'UserCredentialsByPassword',
      type: 'object',
      properties: {
        login: {
          description: '`username`, `email` или `phone`',
          type: 'string'
        },
        password: password,
        code: {type: 'null'},
        phone: {type: 'null'}
      },
      additionalProperties: false,
      required: ['password', 'login']
    }
  ]
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
    'name',
    'username',
    'email',
    'phone',
    'role',
    'avatar',
    'createdAt',
    'updatedAt'
  ]
}

export interface CreateUser {
  name?: string
  email?: string
  role: UserRole
  phone: string
  username?: string
  password?: string
}

export const CreateUser = {
  title: 'CreateUser',
  type: 'object',
  properties: {
    name: name,
    email: email,
    phone: phone,
    role: allowedChangeRole,
    username: username,
    password: password
  },
  additionalProperties: false,
  required: ['role', 'phone'],
  errorMessage: {
    required: {
      role: 'Выберите роль',
      phone: 'Введите номер телефона'
    }
  }
}

export interface FindUsersQueryAdmin {
  fRole?: UserRole
  mEmail?: string
  sCreatedAt: SortDirection,
  page: number
  limit: number
  mPhone?: string
  mName?: string
}

export const FindUsersQueryAdmin = {
  title: 'FindUsersQuery',
  type: 'object',
  properties: {
    fRole: role,
    mEmail: mEmail,
    mPhone: mPhone,
    mName: mName,
    sCreatedAt: new QuerySortDirection().setDefault('desc'),
    page: new QueryPageNumber().setDefault(1),
    limit: new QueryPageLimit().setDefault(10)
  },
  additionalProperties: false
}

export interface UpdateUserById {
  name?: string
  email?: string
  phone?: string
  role?: UserRole
  username?: string
  password?: string
}

export const UpdateUserById = {
  title: 'UpdateUserById',
  type: 'object',
  properties: {
    name: name,
    email: email,
    phone: phone,
    role: allowedChangeRole,
    username: username,
    password: password
  },
  additionalProperties: false
}

export interface UpdateUser {
  name?: string
  email?: string
}

export const UpdateUser = {
  title: 'UpdateUser',
  type: 'object',
  properties: {
    name: name,
    email: email
  },
  additionalProperties: false
}

export interface CallOtp {
  phone: string
}

export const CallOtp = {
  title: 'CallOtp',
  type: 'object',
  properties: {
    phone
  },
  additionalProperties: false,
  required: ['phone']
}


export interface UpdateAvatar {
  avatar: string
}


export const UpdateAvatar = {
  title: 'UpdateAvatar',
  type: 'object',
  properties: {
    avatar: {type: 'string'}
  },
  additionalProperties: false,
  required: ['avatar']
}