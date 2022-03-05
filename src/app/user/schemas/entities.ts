import {_id, avatar, createdAt, email, mEmail, fEmail, mUsername, password, role, updatedAt, username} from './properties'
import {UserRole} from '../UserRole'
import {QueryPageLimit, QueryPageNumber, QuerySortDirection} from '@common/schemas/query'
import type {SortDirection} from 'mongodb'
import {Types} from 'mongoose'


export interface UserCredentials {
  login: string,
  password: string
}

export const UserCredentials = {
  title: 'UserCredentials',
  type: 'object',
  properties: {
    login: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  additionalProperties: false,
  required: ['login', 'password'],
  errorMessage: {
    type: 'Enter your the password and username or email address',
    required: {
      login: 'Enter your username or email address',
      password: 'Enter your password'
    }
  }
}

export interface UserPreview {
  _id: Types.ObjectId,
  username: string,
  avatar: string
}

export const UserPreview = {
  title: 'UserPreview',
  type: 'object',
  properties: {
    _id,
    username,
    avatar
  },
  additionalProperties: false,
  required: [
    '_id',
    'username',
    'avatar'
  ]
}

export const UserBase = {
  title: 'UserBase',
  type: 'object',
  properties: {
    _id: _id,
    username: username,
    email: email,
    role: role,
    avatar: avatar,
    createdAt: createdAt,
    updatedAt: updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'username',
    'email',
    'role',
    'createdAt',
    'updatedAt'
  ]
}

export interface CreateUser {
  username: string,
  email: string,
  role: UserRole,
  password: string
}

export const CreateUser = {
  title: 'CreateUser',
  type: 'object',
  properties: {
    username: username,
    email: email,
    role: role,
    password: password
  },
  additionalProperties: false,
  required: ['username', 'email', 'role', 'password'],
  errorMessage: {
    type: 'User data must be object',
    required: {
      username: 'Enter username',
      email: 'Enter email',
      role: 'Select role',
      password: 'Enter password'
    }
  }
}

export interface FindUsersQuery {
  mUsername: string,
  fEmail: string,
  page: number,
  limit: number
}

export const FindUsersQuery = {
  title: 'FindUsersQuery',
  type: 'object',
  properties: {
    mUsername,
    fEmail,
    page: new QueryPageNumber().setDefault(1),
    limit: new QueryPageLimit().setDefault(10)
  },
  additionalProperties: false,
  required: ['page', 'limit']
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
  email?: string,
  username?: string,
  password?: string,
  role?: UserRole
}

export const UpdateUserById = {
  title: 'UpdateUserById',
  type: 'object',
  properties: {
    email: email,
    username: username,
    password: password,
    role: role
  },
  additionalProperties: false
}

export interface UpdateUser {
  username?: string
}

export const UpdateUser = {
  title: 'UpdateUser',
  type: 'object',
  properties: {
    username: username
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
      password: 'Enter your password',
      oldPassword: 'Enter your old password'
    }
  }
}