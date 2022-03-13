import {model, Schema, Types} from 'mongoose'


export interface ICategory {
  _id: Types.ObjectId
  title: string
  visible: boolean
  productIds: Types.ObjectId[]
  createdAt: number
  updatedAt: number
}


const CategorySchema = new Schema<ICategory>(
  {
    title: String,
    visible: Boolean,
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
  .index({productIds: 1})
  .index({_id: 1, productIds: 1})
  .index({visible: 1})


export const CategoryModel = model<ICategory>('ProductCategory', CategorySchema, 'product_categories')