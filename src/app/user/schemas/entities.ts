import {
  _id, avatar, createdAt, email,
  mEmail, role, updatedAt,
  savedUsername, savedEmail,
  savedPhone, name, phone,
  allowedChangeRole, savedName,
  otpCode
} from './properties'
import {UserRole} from '@app/user/UserRole'
import {QueryPageLimit, QueryPageNumber, QuerySortDirection} from '@common/schemas/query'
import type {SortDirection} from 'mongodb'


export interface UserCredentials {
  code: string
  phone: string
}

export const UserCredentials = {
  title: 'UserCredentials',
  type: 'object',
  properties: {
    code: otpCode,
    phone: phone
  },
  additionalProperties: false,
  required: ['code', 'phone']
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

export interface CreateUser {
  name?: string
  email?: string
  role: UserRole
  phone: string
}

export const CreateUser = {
  title: 'CreateUser',
  type: 'object',
  properties: {
    name: name,
    email: email,
    phone: phone,
    role: allowedChangeRole
  },
  additionalProperties: false,
  required: ['role', 'phone'],
  errorMessage: {
    required: {
      role: 'Выберите роль',
      phone: 'Номер телефона'
    }
  }
}

export interface FindUsersQueryAdmin {
  fRole?: UserRole,
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
  phone?: string
  role?: UserRole
}

export const UpdateUserById = {
  title: 'UpdateUserById',
  type: 'object',
  properties: {
    name: name,
    email: email,
    phone: phone,
    role: allowedChangeRole
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