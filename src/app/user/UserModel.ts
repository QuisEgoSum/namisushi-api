import {Schema, model, Types} from 'mongoose'
import {UserRole} from './UserRole'
import {v4} from 'uuid'


export interface IUser {
  _id: Types.ObjectId,
  username: string,
  email: string,
  role: UserRole,
  avatar: string,
  passwordHash: string | null,
  createdAt: number,
  updatedAt: number
}


const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String
    },
    email: {
      type: String
    },
    role: {
      type: String,
      enum: Object.values(UserRole)
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
  .index({email: 1}, {unique: true})
  .index({username: 1}, {unique: true})
  .index({createdAt: 1})


export const UserModel = model<IUser>('User', UserSchema, 'users')