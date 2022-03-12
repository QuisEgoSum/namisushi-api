import {model, Schema, Types} from 'mongoose'
import {ProductType} from '@app/product/ProductType'


interface ProductCommon {
  _id: Types.ObjectId
  show: boolean
  title: string
  description: string
  ingredients: string[]
  images: string[]
  createdAt: number
  updatedAt: number
}

export interface ISingleProduct extends ProductCommon {
  type: ProductType.SINGLE
  cost: number
  weight: number
}

export interface IVariantProduct extends ProductCommon {
  type: ProductType.VARIANT
}

export type IProduct = ISingleProduct | IVariantProduct


const ProductSchema = new Schema<IProduct>(
  {
    show: Boolean,
    title: String,
    description: String,
    ingredients: [String],
    images: [String],
    type: String,
    cost: Number,
    weight: Number,
    createdAt: Number,
    updatedAt: Number
  },
  {
    versionKey: false,
    timestamps: true
  }
)

/**
 * collection name used in /app/product/ProductRepository.ts
 */
export const ProductModel = model<IProduct>('Product', ProductSchema, 'products')