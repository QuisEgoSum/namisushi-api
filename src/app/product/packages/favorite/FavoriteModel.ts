import {model, Schema, Types} from 'mongoose'


export interface IFavorite {
  _id: Types.ObjectId
  userId: Types.ObjectId
  productId: Types.ObjectId
  createdAt: number
}


const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    createdAt: Number
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
)
  .index({userId: 1, createdAt: 1})
  .index({userId: 1, productId: 1}, {unique: true})


export const FavoriteModel = model<IFavorite>('ProductFavorite', FavoriteSchema, 'product_favorites')
