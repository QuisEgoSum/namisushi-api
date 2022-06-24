import {model, Schema, Types} from 'mongoose'
import {OtpProvider, OtpTarget} from '@app/user/packages/otp/enums'


export interface IOtp {
  _id: Types.ObjectId
  code: string
  phone: string
  target: OtpTarget
  provider: OtpProvider
  active: boolean
  used: boolean
  createdAt: number
  updatedAt: number
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
    provider: {
      type: String,
      required: true,
      enum: Object.values(OtpProvider)
    },
    active: {
      type: Boolean,
      default: true
    },
    used: {
      type: Boolean,
      default: false
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
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  }
)
  .index({target: 1, phone: 1, code: 1, createdAt: 1})
  .index({provider: 1, createdAt: 1})
  .index({provider: 1, phone: 1, createdAt: 1})
  .index({phone: 1, active: 1, target: 1})


export const OtpModel = model<IOtp>('UserOtp', OtpSchema, 'user_otp')