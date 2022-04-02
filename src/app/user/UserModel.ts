import {model, Schema, Types} from 'mongoose'
import {UserRole} from './UserRole'
import {v4} from 'uuid'


export interface IUser {
  _id: Types.ObjectId
  name: string | null
  username: string | null
  email: string | null
  phone: string | null
  role: UserRole
  avatar: string
  passwordHash: string | null
  telegramId: number | null
  createdAt: number
  updatedAt: number
}


const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: null
    },
    username: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER
    },
    avatar: {
      type: String,
      default: (): string => `#=${v4()}`
    },
    passwordHash: {
      type: String,
      select: false,
      default: null
    },
    telegramId: {
      type: Number,
      default: null,
      select: false
    },
    createdAt: {
      type: Number
    },
    updatedAt: {
      type: Number
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
  .index({role: 1})
  .index({email: 1}, {unique: true, partialFilterExpression: {email: {$type: 'string'}}})
  .index({username: 1}, {unique: true, partialFilterExpression: {username: {$type: 'string'}}})
  .index({telegramId: 1})
  .index({createdAt: 1})


export const UserModel = model<IUser>('User', UserSchema, 'users')