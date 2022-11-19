import {model, Schema, Types} from 'mongoose'


export interface IConfig {
  _id: Types.ObjectId
  theme: string | null
  infoMessage: string | null
  infoMessageEnabled: boolean
  globalDiscountPercent: number
  globalDiscountEnabled: boolean
  __id: number
}


const ConfigSchema = new Schema<IConfig>(
  {
    theme: String,
    infoMessage: String,
    infoMessageEnabled: Boolean,
    globalDiscountPercent: Number,
    globalDiscountEnabled: Boolean,
    __id: {
      type: Number,
      default: 1,
      select: false
    }
  },
  {
    versionKey: false,
    timestamps: false
  }
)
  .index({__id: 1}, {unique: true})


export const ConfigModel = model<IConfig>('Config', ConfigSchema, 'config')