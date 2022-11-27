import {model, Schema, Types} from 'mongoose'


export interface INews {
  _id: Types.ObjectId
  slug: string
  title: string
  description: string
  contentJson: Record<string, any>
  contentHtml: string
  isDeleted?: boolean
  updatedAt: number
  createdAt: number
}


const NewsSchema = new Schema<INews>(
  {
    slug: String,
    title: String,
    description: String,
    contentJson: Object,
    contentHtml: String,
    isDeleted: {
      type: Boolean,
      select: false
    },
    updatedAt: Number,
    createdAt: Number
  },
  {
    versionKey: false,
    timestamps: true
  }
)
  .index({title: 1, isDeleted: 1}, {unique: true, partialFilterExpression: {isDeleted: false}})
  .index({slug: 1, isDeleted: 1}, {unique: true, partialFilterExpression: {isDeleted: false}})
  .index({createdAt: -1})


export const NewsModel = model<INews>('News', NewsSchema, 'news')
