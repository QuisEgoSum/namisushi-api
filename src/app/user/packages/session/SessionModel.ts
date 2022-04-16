import {Types, Schema, model} from 'mongoose'
import {v4} from 'uuid'


export interface ISession {
  _id: string,
  user: Types.ObjectId,
  createdAt: number,
  updatedAt: number
}

const SessionSchema = new Schema<ISession>(
  {
    _id: {
      type: String,
      default: v4
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
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
  .index({user: 1})
  .index({updatedAt: 1}, {expires: 5184000})


export const SessionModel = model('UserSession', SessionSchema, 'user_sessions')
