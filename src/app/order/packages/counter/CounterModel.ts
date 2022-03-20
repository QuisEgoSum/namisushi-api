import {model, Schema, Types} from 'mongoose'


export interface ICounter {
  _id: Types.ObjectId
  isTest: boolean
  number: number
}

const CounterSchema = new Schema<ICounter>(
  {
    isTest: Boolean,
    number: Number
  },
  {
    versionKey: false,
    timestamps: false
  }
)


export const CounterModel = model<ICounter>('OrderCounter', CounterSchema, 'order_counter')