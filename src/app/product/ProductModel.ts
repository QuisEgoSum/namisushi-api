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

export interface SingleProduct extends ProductCommon {
  type: ProductType.SINGLE
  cost: number
  weight: number
}

export interface ProductVariant {
  _id: Types.ObjectId
  title: string
  icon: string
  cost: number
  weight: number
}

export interface VariantProduct<T = ProductVariant | Partial<ProductVariant>> extends ProductCommon {
  type: ProductType.VARIANT
  variants: T[]
}

export type IProduct = SingleProduct | VariantProduct


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
    variants: [
      {
        title: String,
        icon: {
          type: String,
          default: null
        },
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