import {model, Schema, Types} from 'mongoose'


export interface ICategory {
  _id: Types.ObjectId
  title: string
  productIds: Types.ObjectId[]
  createdAt: number
  updatedAt: number
}


const CategorySchema = new Schema<ICategory>(
  {
    title: String,
    productIds: [{type: Types.ObjectId, ref: 'Product', default: []}],
    createdAt: Number,
    updatedAt: Number
  },
  {
    versionKey: false,
    timestamps: true
  }
)
  .index({title: 1}, {unique: true})


export const CategoryModel = model<ICategory>('ProductCategory', CategorySchema, 'product_categories')