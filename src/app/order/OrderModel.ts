import {model, Schema, Types} from 'mongoose'
import {OrderCondition} from '@app/order/OrderCondition'
import {OrderDiscount} from '@app/order/OrderDiscount'


export interface IOrderProduct {
  productId: Types.ObjectId
  number: number
  cost: number
  weight: number
  variantId: Types.ObjectId | null
}

export interface IOrder {
  _id: Types.ObjectId
  number: number,
  clientId: Types.ObjectId | null
  phone: string
  address: string | null
  cost: number
  weight: number
  username: string
  condition: OrderCondition
  delivery: boolean
  deliveryCost: number | null
  discount: {
    type: OrderDiscount,
    percent: number
  } | null
  additionalInformation: string | null
  deliveryCalculateManually: boolean | null
  time: number | null
  productsSum: number
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
      ref: 'User',
      default: null
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      default: null
    },
    cost: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    deliveryCost: Number,
    condition: {
      type: Number,
      default: OrderCondition.NEW
    },
    delivery: {
      type: Boolean
    },
    discount: new Schema(
      {
        type: {
          type: String,
          enum: Object.values(OrderDiscount)
        },
        percent: {
          type: Number
        }
      },
      {
        _id: false
      }
    ),
    additionalInformation: {
      type: String,
      default: null
    },
    deliveryCalculateManually: {
      type: Boolean,
      default: null
    },
    time: {
      type: Number,
      default: null
    },
    productsSum: {
      type: Number,
      required: true
    },
    products: [new Schema({
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      number: {
        type: Number,
        required: true
      },
      cost: {
        type: Number,
        required: true
      },
      weight: {
        type: Number,
        required: true
      },
      variantId: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant',
        default: null
      }
    })],
    isTestOrder: {
      type: Boolean,
      default: false
    },
    createdAt: Number,
    updatedAt: Number
  },
  {
    versionKey: false,
    timestamps: true
  }
)
  .index({number: 1, isTestOrder: 1}, {unique: true})
  .index({client: 1})
  .index({createdAt: 1})
  .index({phone: 1})

export const OrderModel = model<IOrder>('Order', OrderSchema, 'orders')