import {model, Schema, Types} from 'mongoose'


export interface IVariant {
  _id: Types.ObjectId
  productId: Types.ObjectId
  title: string
  show: boolean
  icon: string | null
  cost: number
  weight: number
  createdAt: number
  updatedAt: number
}

const VariantSchema = new Schema<IVariant>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    show: Boolean,
    title: String,
    icon: String,
    cost: Number,
    weight: Number,
    createdAt: Number,
    updatedAt: Number
  },
  {
    timestamps: true,
    versionKey: false
  }
)
  .index({productId: 1})
  .index({show: 1})
  .index({productId: 1, show: 1})


export const VariantModel = model<IVariant>('ProductVariant', VariantSchema, 'product_variants')