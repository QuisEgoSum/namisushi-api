import {model, Schema, Types} from 'mongoose'


export interface IOrderTelegramMessage {
  _id: Types.ObjectId
  orderId: Types.ObjectId
  message: string
}

const OrderTelegramMessageSchema = new Schema<IOrderTelegramMessage>(
  {
    orderId: Types.ObjectId,
    message: String
  },
  {
    versionKey: false,
    timestamps: false
  }
)

export const OrderTelegramMessageModel = model<IOrderTelegramMessage>(
  'OrderTelegramMessage',
      OrderTelegramMessageSchema,
  'order_telegram_sent_messages'
)