import {model, Schema, Types} from 'mongoose'
import {ProductType} from '@app/product/ProductType'


interface ProductCommon {
  _id: Types.ObjectId
  show: boolean
  title: string
  description: string
  ingredients: string[]
  createdAt: number
  updatedAt: number
}

export interface SingleProduct extends ProductCommon {
  type: ProductType.SINGLE
  cost: number
  weight: string[]
}

export interface VariantProduct extends ProductCommon {
  type: ProductType.VERSION
  variants: {
    _id: Types.ObjectId
    title: string
    cost: number
    weight: number
  }[]
}

export type IProduct = SingleProduct | VariantProduct


const ProductSchema = new Schema<IProduct>(
  {
    show: Boolean,
    title: String,
    description: String,
    ingredients: [String],
    type: String,
    cost: Number,
    weight: Number,
    variants: [
      {
        _id: Types.ObjectId,
        title: String,
        cost: Number,
        weight: Number
      }
    ],
    createdAt: Number,
    updatedAt: Number
  },
  {
    versionKey: false,
    timestamps: true
  }
)


export const ProductModel = model<IProduct>('Product', ProductSchema, 'products')