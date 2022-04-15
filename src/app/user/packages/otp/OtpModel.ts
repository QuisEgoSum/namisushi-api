import {model, Schema, Types} from 'mongoose'
import {OtpTarget} from '@app/user/packages/otp/OtpTarget'


export interface IOtp {
  _id: Types.ObjectId
  code: string
  phone: string
  target: OtpTarget
  createdAt: Date
}

const OtpSchema = new Schema<IOtp>(
  {
    code: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true,
      enum: Object.values(OtpTarget)
    },
    createdAt: Date
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
)
  .index({code: 1, phone: 1}, {unique: true})
  .index({phone: 1, target: 1})
  .index({createdAt: 1}, {expireAfterSeconds: 900})


export const OtpModel = model<IOtp>('UserOtp', OtpSchema, 'user_otp')