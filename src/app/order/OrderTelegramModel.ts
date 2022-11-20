import {model, Schema, Types} from 'mongoose'


export interface IOrderTelegram {
  _id: Types.ObjectId
  chatId: number
  messageId: number
  orderId: Types.ObjectId
  message: string
}


const OrderTelegramSchema = new Schema<IOrderTelegram>(
  {
    chatId: Number,
    messageId: Number,
    orderId: Types.ObjectId,
    message: String
  },
  {
    versionKey: false,
    timestamps: false
  }
)
  .index({orderId: 1})


export const OrderTelegramModel = model<IOrderTelegram>(
  'OrderTelegram',
  OrderTelegramSchema,
  'order_telegram_messages'
)
