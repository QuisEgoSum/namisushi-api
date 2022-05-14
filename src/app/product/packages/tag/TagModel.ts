import {model, Schema, Types} from 'mongoose'


export interface ITag {
  _id: Types.ObjectId
  name: string
  icon: string
  createdAt: number
  updatedAt: number
}


const TagSchema = new Schema<ITag>(
  {
    name: String,
    icon: String,
    createdAt: Number,
    updatedAt: Number
  },
  {
    timestamps: true,
    versionKey: false
  }
)
  .index({name: 1}, {unique: true})


export const TagModel = model<ITag>('ProductTag', TagSchema, 'product_tags')