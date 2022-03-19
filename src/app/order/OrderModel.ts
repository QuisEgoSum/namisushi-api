import {model, Schema, Types} from 'mongoose'
import {OrderCondition} from '@app/order/OrderCondition'
import {OrderDiscount} from '@app/order/OrderDiscount'


export interface IOrderProduct {
  productId: Types.ObjectId
  number: number
  cost: number
  weight: number
  variantId?: Types.ObjectId
}

export interface IOrder {
  _id: Types.ObjectId
  number: number,
  clientId: Types.ObjectId | null
  phone: string
  address?: string
  cost: number
  weight: number
  username: string
  condition: OrderCondition,
  delivery: boolean
  deliveryCost?: number | null
  discount?: {
    type: OrderDiscount,
    percent: number
  } | null
  additionalInformation?: string
  deliveryCalculateManually: boolean | null
  time?: number | null
  products: IOrderProduct[]
  isTestOrder: boolean
  createdAt: number
  updatedAt: number
}

const OrderSchema = new Schema<IOrder>(
  {
    number: Number,
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    phone: String,
    address: String,
    cost: Number,
    weight: Number,
    username: String,
    deliveryCost: Number,
    condition: {
      type: Number
      //TODO: Validation
    },
    delivery: Boolean,
    discount: {
      type: {
        type: String,
        enum: Object.values(OrderDiscount)
      },
      percent: {
        type: Number
      }
    },
    additionalInformation: String,
    deliveryCalculateManually: Boolean,
    time: Number,
    products: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      },
      number: Number,
      cost: Number,
      weight: Number,
      variantId: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant'
      }
    }],
    createdAt: Number,
    updatedAt: Number
  },
  {
    versionKey: false,
    timestamps: true
  }
)
  .index({number: 1}, {unique: true})
  .index({client: 1})
  .index({createdAt: 1})
  .index({phone: 1})

export const OrderModel = model<IOrder>('Order', OrderSchema, 'orders')